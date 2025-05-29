import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Product, Review as ReviewType } from "@/lib/types";
import { Star, MessageSquare } from "lucide-react";
import { FiveStarRating } from "./five-star-rating";
import { AIReviewSummary } from "./ai-review-summary";

// Create a display-only version of FiveStarRating for server components
function DisplayRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl ${
            star <= rating ? "text-yellow-400" : "text-gray-500"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function Reviews({ product, reviews }: { product: Product; reviews: ReviewType[] }) {
  // Sort reviews by date in descending order (newest first)
  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Calculate average rating
  const averageRating = sortedReviews.length > 0
    ? sortedReviews.reduce((sum, review) => sum + review.stars, 0) / sortedReviews.length
    : 0;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Overall Rating</h2>
          <div className="flex items-center">
            <DisplayRating rating={averageRating} />
            <span className="ml-2 text-lg font-medium text-yellow-600">
              {averageRating.toFixed(1)} out of 5
            </span>
          </div>
        </div>
        <p className="text-gray-600">
          Based on {sortedReviews.length} reviews
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">AI Summary</h2>
        <AIReviewSummary reviews={sortedReviews} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">User Reviews</h2>
        <div className="space-y-6">
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{review.authorName}</span>
                    <span className="text-gray-500 ml-2">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <DisplayRating rating={review.stars} />
                </div>
                <p className="text-gray-600">{review.review}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No reviews yet. Be the first to review this tool!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Review({ review }: { review: ReviewType }) {
  const date = new Date(review.date);
  return (
    <div className="flex gap-4">
      <Avatar className="w-10 h-10 border border-gray-200">
        <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="grid gap-4">
        <div className="flex gap-4 items-start">
          <div className="grid gap-0.5 text-sm">
            <h3 className="font-semibold text-gray-900">{review.authorName}</h3>
            <time
              className="text-sm text-gray-500"
              suppressHydrationWarning
            >
              {timeAgo(date)}
            </time>
          </div>
          <div className="flex items-center gap-0.5 ml-auto">
            <DisplayRating rating={review.stars} />
          </div>
        </div>
        <div className="text-sm leading-loose text-gray-600">
          <p>{review.review}</p>
        </div>
      </div>
    </div>
  );
}

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};
