import { NextResponse } from 'next/server';
import { getAllProducts, getProductReviews, createProduct } from '@/lib/firebase-db';

export async function GET() {
  try {
    const products = await getAllProducts();
    
    // Calculate average rating for each product
    const productsWithRatings = await Promise.all(
      products.map(async ({ id, product }) => {
        const reviews = await getProductReviews(id);
        const averageRating = reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
          : 0;
        
        return {
          id,
          name: product.name,
          reviewCount: product.reviewCount || 0,
          averageRating
        };
      })
    );
    
    return NextResponse.json(productsWithRatings);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    }
    
    // Generate a URL-friendly ID from the name by removing spaces and converting to lowercase
    const id = name.toLowerCase().replace(/\s+/g, '');
    
    // Create a new product
    const newProduct = {
      name, // Keep the original name with spaces and capitalization
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the new product to Firebase
    await createProduct(id, newProduct);
    
    return NextResponse.json({ id, name });
  } catch (error) {
    console.error('Error creating tool:', error);
    return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 });
  }
} 