import { NextResponse } from 'next/server';
import { getProductReviews, addReview, getProduct, createProduct } from '@/lib/firebase-db';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 1 minute
const MAX_REVIEWS_PER_WINDOW = 3; // Max 3 reviews per minute

// Helper function to check rate limit
async function checkRateLimit(userId: string): Promise<boolean> {
  try {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    
    // Get the user's review submissions
    const submissionsRef = adminDb.collection('reviewSubmissions').doc(userId);
    const submissionDoc = await submissionsRef.get();
    
    if (!submissionDoc.exists) {
      // First submission, create the document
      await submissionsRef.set({
        submissions: [now],
        count: 1
      });
      return true;
    }
    
    const data = submissionDoc.data();
    if (!data) {
      return true; // No data, allow submission
    }
    
    // Filter out old submissions
    const recentSubmissions = (data.submissions || []).filter(
      (timestamp: number) => timestamp > windowStart
    );
    
    // Check if user has exceeded the rate limit
    if (recentSubmissions.length >= MAX_REVIEWS_PER_WINDOW) {
      return false;
    }
    
    // Add the new submission
    recentSubmissions.push(now);
    
    // Update the document
    await submissionsRef.update({
      submissions: recentSubmissions,
      count: recentSubmissions.length
    });
    
    return true;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return true; // Allow submission if rate limit check fails
  }
}

// Helper function to validate review data
function validateReviewData(data: any): { isValid: boolean; error?: string } {
  // Check required fields
  if (!data.review || typeof data.review !== 'string') {
    return { isValid: false, error: 'Review text is required' };
  }
  
  if (!data.authorName || typeof data.authorName !== 'string') {
    return { isValid: false, error: 'Author name is required' };
  }
  
  if (!data.stars || typeof data.stars !== 'number') {
    return { isValid: false, error: 'Rating is required' };
  }
  
  // Validate rating range
  if (data.stars < 1 || data.stars > 5) {
    return { isValid: false, error: 'Rating must be between 1 and 5' };
  }
  
  // Validate review length
  if (data.review.length < 5) {
    return { isValid: false, error: 'Review must be at least 5 characters long' };
  }
  
  if (data.review.length > 1000) {
    return { isValid: false, error: 'Review must be less than 1000 characters' };
  }
  
  // Sanitize review text (basic HTML escaping)
  data.review = data.review
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  return { isValid: true };
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function GET(
  request: Request,
  { params }: { params: { toolId: string } }
) {
  try {
    const reviews = await getProductReviews(params.toolId);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { toolId: string } }
) {
  try {
    const body = await request.json();
    
    // Validate review data
    const validation = validateReviewData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const { review, authorName, stars, userId, productName } = body;
    
    // Check rate limit
    if (userId) {
      const isAllowed = await checkRateLimit(userId);
      if (!isAllowed) {
        return NextResponse.json(
          { error: 'You have submitted too many reviews recently. Please try again later.' },
          { status: 429 }
        );
      }
    }

    // Use OpenAI Moderation endpoint to check for unsafe, spam, or harmful content
    const moderationResponse = await openai.moderations.create({ input: review });
    const flagged = moderationResponse.results[0]?.flagged;
    const categories = moderationResponse.results[0]?.categories || {};

    // If flagged, upload to Firebase as unsafe (safe: false), do not update summary/rating
    if (flagged) {
      const reviewId = `${params.toolId}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const unsafeReview = {
        id: reviewId,
        review,
        authorName,
        stars,
        userId,
        date: new Date().toISOString(),
        productId: params.toolId,
        productName: productName || params.toolId,
        safe: false,
        moderationCategories: categories as unknown as Record<string, boolean>,
      };
      // Store the unsafe review in Firebase (but do not update summary/rating)
      await addReview(params.toolId, unsafeReview, { skipAISummary: true });
      return NextResponse.json({
        message: 'Your review may have been unsafe and is being reviewed by our team.',
        heldForReview: true,
        categories,
      }, { status: 202 });
    }

    // Check if the product exists, if not create it
    let product = await getProduct(params.toolId);
    if (!product) {
      // Create a new product with the provided name or use the ID as fallback
      const newProduct = {
        name: productName || params.toolId,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await createProduct(params.toolId, newProduct);
      product = newProduct;
    }

    // Create the review object with a unique ID
    const reviewId = `${params.toolId}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const newReview = {
      id: reviewId,
      review,
      authorName,
      stars,
      userId,
      date: new Date().toISOString(),
      productId: params.toolId,
      productName: product.name,
      safe: true,
    };

    // Add the review to Firebase and update summary/rating
    await addReview(params.toolId, newReview);

    return NextResponse.json({ ...newReview, published: true });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
} 