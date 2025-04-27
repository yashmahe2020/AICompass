'use client';

import { useState, useEffect } from 'react';
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Product, Review } from "@/lib/types";
import { Star } from 'lucide-react';

// Create a display-only version of FiveStarRating for server components
function DisplayRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
          }`}
        />
      ))}
    </div>
  );
}

interface AIProductReviewSummaryProps {
  product: Product;
  reviews: Review[];
}

export function AIProductReviewSummary({ product, reviews }: AIProductReviewSummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [themes, setThemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAISummary() {
      try {
        const response = await fetch('/api/ai-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product, reviews }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch AI summary');
        }

        const data = await response.json();
        setSummary(data.summary);
        setThemes(data.themes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAISummary();
  }, [product, reviews]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">AI Review Summary</CardTitle>
          <CardDescription className="text-gray-400">Loading summary...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Summary</h3>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Key Themes</h3>
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Average Rating</h3>
              <div className="flex items-center">
                <DisplayRating rating={averageRating} />
                <span className="ml-2 text-yellow-400 font-medium">
                  {averageRating.toFixed(1)} out of 5
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">AI Review Summary</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-yellow-400">AI Review Summary</CardTitle>
        <CardDescription className="text-gray-400">
          Based on {reviews.length} reviews
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Summary</h3>
            <p className="text-gray-300">{summary}</p>
          </div>
          
          {themes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Key Themes</h3>
              <ul className="list-disc pl-5 space-y-1">
                {themes.map((theme, index) => (
                  <li key={index} className="text-gray-300">{theme}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Average Rating</h3>
            <div className="flex items-center">
              <DisplayRating rating={averageRating} />
              <span className="ml-2 text-yellow-400 font-medium">
                {averageRating.toFixed(1)} out of 5
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AIReviewSummary({ reviews }: { reviews: Review[] }) {
  const [summary, setSummary] = useState<string>('');
  const [themes, setThemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAISummary() {
      try {
        // If there are no reviews, don't try to fetch a summary
        if (!reviews || reviews.length === 0) {
          setSummary("No reviews available for this product yet.");
          setThemes([]);
          setLoading(false);
          return;
        }

        // Create a product object from the first review
        const product = {
          id: reviews[0].productId,
          name: reviews[0].productName
        };

        const response = await fetch('/api/ai-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product, reviews }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch AI summary');
        }

        const data = await response.json();
        setSummary(data.summary);
        setThemes(data.themes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAISummary();
  }, [reviews]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">AI Review Summary</CardTitle>
          <CardDescription className="text-gray-400">Loading summary...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Summary</h3>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Key Themes</h3>
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Average Rating</h3>
              <div className="flex items-center">
                <DisplayRating rating={averageRating} />
                <span className="ml-2 text-yellow-400 font-medium">
                  {averageRating.toFixed(1)} out of 5
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">AI Review Summary</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-yellow-400">AI Review Summary</CardTitle>
        <CardDescription className="text-gray-400">
          Based on {reviews.length} reviews
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Summary</h3>
            <p className="text-gray-300">{summary}</p>
          </div>
          
          {themes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Key Themes</h3>
              <ul className="list-disc pl-5 space-y-1">
                {themes.map((theme, index) => (
                  <li key={index} className="text-gray-300">{theme}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Average Rating</h3>
            <div className="flex items-center">
              <DisplayRating rating={averageRating} />
              <span className="ml-2 text-yellow-400 font-medium">
                {averageRating.toFixed(1)} out of 5
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function extractThemes(reviews: Review[]): string[] {
  // This is a placeholder function that would be replaced with actual theme extraction logic
  const themes = new Set<string>();
  
  reviews.forEach(review => {
    // Simple keyword extraction based on common words
    const words = review.review.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 4 && !['this', 'that', 'with', 'from', 'have', 'what', 'when', 'where', 'which'].includes(word)) {
        themes.add(word);
      }
    });
  });
  
  return Array.from(themes).slice(0, 5); // Return top 5 themes
}
