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
      <div className="min-h-screen bg-white text-gray-900 pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/browse" 
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
          
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600">Loading tool details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-900 pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/browse" 
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
          
          <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-yellow-600 hover:text-yellow-700 transition-colors"
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
    <div className="min-h-screen bg-white text-gray-900 pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/browse" 
          className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600">Loading tool details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-yellow-600 hover:text-yellow-700 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : product ? (
          <>
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">{product.name}</h1>
              <div className="flex items-center text-gray-600">
                <Star className="h-5 w-5 text-yellow-600 mr-1" />
                <span className="mr-2 text-yellow-600 font-medium">{averageRating.toFixed(1)}</span>
                <span className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-1" />
                  {reviews.length} reviews
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">Reviews</h2>
                  <Reviews product={product} reviews={reviews} />
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Share Your Experience</h2>
              <p className="text-gray-600 mb-6">
                Have you used {product.name}? Share your experience to help others make informed decisions.
              </p>
              <Link 
                href="/submit" 
                className="block w-full bg-yellow-600 text-white text-center py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
              >
                Submit a Review
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
} 