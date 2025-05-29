"use client";

import { notFound } from "next/navigation";
import { Reviews } from "@/components/reviews";
import Link from "next/link";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Product, Review } from "@/lib/types";
import { AIProductReviewSummary } from "@/components/ai-review-summary";

// Utility to decode HTML entities (e.g., for apostrophes)
function decodeHTMLEntities(text: string) {
  if (!text) return '';
  if (typeof window === 'undefined') return text; // SSR safety
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
}

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
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when toolId changes
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
        // Sort reviews by date in descending order (newest first) as a fallback
        const sortedReviews = reviewsData.sort((a: Review, b: Review) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setReviews(sortedReviews);
        
        // Calculate average rating
        if (sortedReviews.length > 0) {
          const avg = sortedReviews.reduce((sum: number, review: Review) => sum + review.stars, 0) / sortedReviews.length;
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

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/browse" 
          className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Reviews (full width, no scroll box) */}
          <div className="lg:col-span-8 col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
              <div className="p-6 flex-1">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">User Reviews</h2>
                {/* Only reviews, no AI summary */}
                {paginatedReviews.length > 0 ? (
                  paginatedReviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{review.authorName}</span>
                          <span className="text-gray-500 ml-2">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-xl ${star <= review.stars ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{decodeHTMLEntities(review.review)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet. Be the first to review this tool!</p>
                  </div>
                )}
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2 flex-wrap items-center">
                    {/* Left Arrow */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded border font-semibold transition-colors flex items-center ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                      }`}
                      aria-label="Previous Page"
                    >
                      &#8592;
                    </button>
                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded font-semibold border transition-colors mx-1 ${
                          currentPage === i + 1
                            ? "bg-yellow-600 text-white border-yellow-600"
                            : "bg-white text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                        }`}
                        aria-current={currentPage === i + 1 ? "page" : undefined}
                      >
                        {i + 1}
                      </button>
                    ))}
                    {/* Right Arrow */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded border font-semibold transition-colors flex items-center ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                      }`}
                      aria-label="Next Page"
                    >
                      &#8594;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right: AI Summary + Share Experience (sticky) */}
          <div className="lg:col-span-4 col-span-1">
            <div className="sticky top-36 flex flex-col gap-8">
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                <AIProductReviewSummary product={{ ...product, id: params.toolId }} reviews={reviews} />
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">Share Your Experience</h2>
                <p className="text-gray-600 mb-6">
                  Have you used <span className="font-semibold text-yellow-700">{product.name}</span>? Share your experience to help others make informed decisions.
                </p>
                <Link 
                  href={`/submit?toolId=${params.toolId}`} 
                  className="block w-full bg-yellow-600 text-white text-center py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors shadow-md"
                >
                  Submit a Review
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 