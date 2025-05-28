import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getProductReviews, addReview, getProduct, updateProduct } from '@/lib/firebase-db';
import { Product, Review } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { product, reviews } = await request.json();

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: 'No reviews provided' },
        { status: 400 }
      );
    }

    // First, check if we already have a summary in Firebase
    const existingProduct = await getProduct(product.id);
    
    // If we have a summary and the review count matches, return the existing summary
    if (existingProduct && 
        existingProduct.summary && 
        existingProduct.reviewCount === reviews.length) {
      return NextResponse.json({
        summary: existingProduct.summary,
        themes: [
          existingProduct.theme1,
          existingProduct.theme2,
          existingProduct.theme3,
          existingProduct.theme4
        ].filter(Boolean) // Filter out any empty themes
      });
    }

    // If we don't have a summary or the review count has changed, generate a new one
    // Calculate average rating
    const averageRating = reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length;

    // Prepare reviews for the prompt
    const reviewsText = reviews
      .map(review => `Rating: ${review.stars}/5\nComment: ${review.review}`)
      .join('\n\n');

    // Create a prompt for the OpenAI model
    const prompt = `Analyze the following reviews for ${product.name} (Average Rating: ${averageRating.toFixed(1)}/5, Total Reviews: ${reviews.length}):

${reviewsText}

Please provide a concise summary and identify four specific themes from these reviews. Format your response as a JSON object with the following structure:

{
  "summary": "Two sentences summarizing the overall sentiment and key points from the reviews.",
  "themes": [
    "Theme 1: A specific theme identified from the reviews",
    "Theme 2: A specific theme identified from the reviews",
    "Theme 3: A specific theme identified from the reviews",
    "Theme 4: A specific theme identified from the reviews"
  ]
}

Ensure your response is strictly in this JSON format.`;

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that analyzes product reviews and provides concise summaries and themes.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Parse the response
    const responseContent = completion.choices[0]?.message?.content || '';
    const parsedResponse = JSON.parse(responseContent);

    // Store the AI-generated summary and themes in Firebase
    const productData = {
      name: product.name,
      reviewCount: reviews.length,
      summary: parsedResponse.summary,
      theme1: parsedResponse.themes[0],
      theme2: parsedResponse.themes[1],
      theme3: parsedResponse.themes[2],
      theme4: parsedResponse.themes[3],
    };

    await updateProduct(product.id, productData);

    return NextResponse.json({
      summary: parsedResponse.summary,
      themes: parsedResponse.themes,
    });
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

function extractThemes(reviews: Review[]): string[] {
  // In a real app, this would use NLP to extract themes
  // For now, we'll return some hardcoded themes based on ratings
  
  const themes = [];
  
  // Check if there are many positive reviews
  const positiveReviews = reviews.filter(review => review.stars >= 4).length;
  if (positiveReviews > reviews.length / 2) {
    themes.push("Easy to use and intuitive interface");
    themes.push("Effective at solving problems");
  }
  
  // Check if there are many negative reviews
  const negativeReviews = reviews.filter(review => review.stars <= 2).length;
  if (negativeReviews > reviews.length / 3) {
    themes.push("Occasional bugs or errors");
    themes.push("Learning curve for new users");
  }
  
  // Add some neutral themes
  themes.push("Regular updates and improvements");
  themes.push("Good customer support");
  
  return themes;
} 