import { db } from './firebase';
import { adminDb } from './firebase-admin';
import { collection, doc, getDocs, setDoc, query, where, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Product, Review } from './types';
import OpenAI from 'openai';
import * as admin from 'firebase-admin';

// Initialize OpenAI client - using server-side API key for security
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to determine if we're in a server environment
const isServer = () => typeof window === 'undefined';

// Products Collection Operations
export async function getProduct(productId: string): Promise<Product | null> {
  try {
    if (isServer()) {
      // Use admin SDK for server-side operations
      const productDoc = await adminDb.collection('products').doc(productId).get();
      if (!productDoc.exists) {
        return null;
      }
      return productDoc.data() as Product;
    } else {
      // Use client SDK for client-side operations
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (!productDoc.exists()) {
        return null;
      }
      return productDoc.data() as Product;
    }
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

export async function createProduct(productId: string, product: Product): Promise<void> {
  try {
    if (isServer()) {
      // Use admin SDK for server-side operations
      await adminDb.collection('products').doc(productId).set(product);
    } else {
      // Use client SDK for client-side operations
      await setDoc(doc(db, 'products', productId), product);
    }
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// Reviews Collection Operations
export async function getProductReviews(productId: string, options?: { includeUnsafe?: boolean }): Promise<Review[]> {
  try {
    if (isServer()) {
      let queryRef = adminDb.collection('reviews').where('productId', '==', productId);
      if (!options?.includeUnsafe) {
        queryRef = queryRef.where('safe', 'in', [true, null]);
      }
      const reviewsSnapshot = await queryRef.get();
      return reviewsSnapshot.docs.map(doc => doc.data() as Review);
    } else {
      let reviewsQuery = query(
        collection(db, 'reviews'),
        where('productId', '==', productId)
      );
      if (!options?.includeUnsafe) {
        reviewsQuery = query(
          collection(db, 'reviews'),
          where('productId', '==', productId),
          where('safe', 'in', [true, null])
        );
      }
      const querySnapshot = await getDocs(reviewsQuery);
      return querySnapshot.docs.map(doc => doc.data() as Review);
    }
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
}

export async function addReview(productId: string, review: Review, options?: { skipAISummary?: boolean }): Promise<void> {
  try {
    if (isServer()) {
      // Use admin SDK for server-side operations
      // Add the review to the reviews collection
      const reviewId = review.id || `${productId}_${Date.now()}`;
      await adminDb.collection('reviews').doc(reviewId).set({
        ...review,
        id: reviewId
      });

      // Only update the product's review count and summary if not skipping and review is safe
      if (!options?.skipAISummary && review.safe !== false) {
        const productRef = adminDb.collection('products').doc(productId);
        const productDoc = await productRef.get();
        if (productDoc.exists) {
          await productRef.update({
            reviewCount: admin.firestore.FieldValue.increment(1),
            updatedAt: new Date().toISOString()
          });
        } else {
          // If the product doesn't exist, create it
          const newProduct = {
            name: review.productName,
            reviewCount: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await createProduct(productId, newProduct);
        }
        // Generate and update AI summary for the product
        await updateProductAISummary(productId);
      }
    } else {
      // Use client SDK for client-side operations
      const reviewId = review.id || `${productId}_${Date.now()}`;
      await setDoc(doc(db, 'reviews', reviewId), {
        ...review,
        id: reviewId
      });
      if (!options?.skipAISummary && review.safe !== false) {
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, {
          reviewCount: increment(1),
          updatedAt: new Date().toISOString()
        }).catch(async (error) => {
          if (error.code === 'not-found') {
            const newProduct = {
              name: review.productName,
              reviewCount: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await createProduct(productId, newProduct);
          } else {
            throw error;
          }
        });
        await updateProductAISummary(productId);
      }
    }
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

export async function getAllProducts(): Promise<{ id: string; product: Product }[]> {
  try {
    if (isServer()) {
      // Use admin SDK for server-side operations
      const querySnapshot = await adminDb.collection('products').get();
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        product: doc.data() as Product
      }));
    } else {
      // Use client SDK for client-side operations
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        product: doc.data() as Product
      }));
    }
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
}

// AI Summary Generation and Storage
export async function updateProductAISummary(productId: string): Promise<void> {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      // Get all reviews for the product
      const reviews = await getProductReviews(productId);
      
      // If there are no reviews, clear the summary and themes
      if (reviews.length === 0) {
        if (isServer()) {
          await adminDb.collection('products').doc(productId).update({
            summary: "No reviews available for this product yet.",
            theme1: "",
            theme2: "",
            theme3: "",
            theme4: "",
            summaryUpdatedAt: new Date().toISOString()
          });
        } else {
          await updateDoc(doc(db, 'products', productId), {
            summary: "No reviews available for this product yet.",
            theme1: "",
            theme2: "",
            theme3: "",
            theme4: "",
            summaryUpdatedAt: new Date().toISOString()
          });
        }
        return;
      }
      
      // Calculate average rating
      const averageRating = reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
      
      // Get product details
      const product = await getProduct(productId);
      const productName = product?.name || productId;
      
      // Prepare reviews for the prompt
      const reviewsText = reviews.map((review, index) => 
        `Review ${index + 1} (${review.stars} stars): ${review.review}`
      ).join('\n\n');
      
      // Create the prompt for OpenAI
      const prompt = `Analyze the following product reviews and provide a concise summary and key themes.
      
Product: ${productName}
Average Rating: ${averageRating.toFixed(1)} out of 5 stars
Number of Reviews: ${reviews.length}

Reviews:
${reviewsText}

INSTRUCTIONS:
1. Generate a concise 2-sentence summary of the overall sentiment and key points from these reviews.
2. Identify exactly 4 specific themes or patterns mentioned across the reviews.
3. Your response MUST be in valid JSON format with the following structure:
{
  "summary": "Your 2-sentence summary here",
  "themes": [
    "Theme 1",
    "Theme 2",
    "Theme 3",
    "Theme 4"
  ]
}
4. Be specific and concise. Each theme should be a short phrase (5-10 words).
5. Focus on actual content from the reviews, not generic statements.
6. Ensure your response is ONLY the JSON object with no additional text.`;

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that analyzes product reviews and provides concise summaries and key themes in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      // Parse the response
      const aiResponse = JSON.parse(response.choices[0].message.content || '{"summary": "Error parsing AI response", "themes": []}');
      
      // Update the product document with the AI summary and themes
      const updateData = {
        summary: aiResponse.summary,
        theme1: aiResponse.themes[0] || "",
        theme2: aiResponse.themes[1] || "",
        theme3: aiResponse.themes[2] || "",
        theme4: aiResponse.themes[3] || "",
        summaryUpdatedAt: new Date().toISOString()
      };

      if (isServer()) {
        await adminDb.collection('products').doc(productId).update(updateData);
      } else {
        await updateDoc(doc(db, 'products', productId), updateData);
      }

      // If we get here, the operation was successful
      return;
    } catch (error) {
      console.error(`Error updating AI summary (attempt ${retryCount + 1}/${maxRetries}):`, error);
      
      // Type guard for Firebase error
      if (error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied') {
        retryCount++;
        if (retryCount < maxRetries) {
          // Wait for 1 second before retrying (with exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          continue;
        }
      }
      
      // If we've exhausted retries or it's not a permission error, throw
      throw error;
    }
  }
}

export async function updateProduct(productId: string, productData: Partial<Product>) {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, productData);
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// User Profile Operations
export async function getUserProfile(userId: string) {
  try {
    if (isServer()) {
      const userDoc = await adminDb.collection('users').doc(userId).get();
      return userDoc.exists ? userDoc.data() : null;
    } else {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data() : null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function setUserProfile(userId: string, profile: any) {
  try {
    if (isServer()) {
      await adminDb.collection('users').doc(userId).set(profile, { merge: true });
    } else {
      await setDoc(doc(db, 'users', userId), profile, { merge: true });
    }
  } catch (error) {
    console.error('Error setting user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, profile: any) {
  try {
    if (isServer()) {
      await adminDb.collection('users').doc(userId).update(profile);
    } else {
      await updateDoc(doc(db, 'users', userId), profile);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
} 