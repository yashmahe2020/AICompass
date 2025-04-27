import { NextResponse } from 'next/server';
import { getProductReviews, addReview, getProduct, createProduct } from '@/lib/firebase-db';

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
    const { review, authorName, stars, userId, productName } = body;

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
      productName: product.name
    };

    // Add the review to Firebase
    await addReview(params.toolId, newReview);

    return NextResponse.json(newReview);
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
} 