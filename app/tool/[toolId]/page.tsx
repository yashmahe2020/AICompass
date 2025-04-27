"use client";

import { notFound } from "next/navigation";
import { Reviews } from "@/components/reviews";
import Link from "next/link";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Product, Review } from "@/lib/types";

export default function ToolPage({
  params,
}: {
  params: { toolId: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setIsLoading(true);
        
        // Fetch product details
        const productResponse = await fetch(`/api/tools/${params.toolId}`);
        
        if (!productResponse.ok) {
          if (productResponse.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch tool');
        }
        
        const productData = await productResponse.json();
        setProduct(productData);
        
        // Fetch reviews
        const reviewsResponse = await fetch(`/api/tools/${params.toolId}/reviews`);
        
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
        
        // Calculate average rating
        if (reviewsData.length > 0) {
          const avg = reviewsData.reduce((sum: number, review: Review) => sum + review.stars, 0) / reviewsData.length;
          setAverageRating(avg);
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching tool:", error);
        setError("Failed to load tool. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [params.toolId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-gray-300">Loading tool details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-gray-300">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null; // This should not happen as notFound() should be called
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href="/browse" 
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Browse
          </Link>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="text-yellow-400 font-medium">{averageRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-gray-400 mr-1" />
              <span className="text-gray-300">{reviews.length} reviews</span>
            </div>
          </div>
          <p className="text-gray-300">
            Reviews and insights from users who have used this AI tool
          </p>
        </div>
        
        <Reviews product={product} reviews={reviews} />
        
        <div className="mt-12 text-center">
          <Link 
            href="/browse" 
            className="inline-flex items-center bg-yellow-400 text-black px-6 py-3 rounded-md hover:bg-yellow-500 transition-colors font-medium"
          >
            Browse More Tools
          </Link>
        </div>
      </div>
    </div>
  );
} 