"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiveStarRating } from "./five-star-rating";
import { Loader2 } from "lucide-react";
import { useAuth, SignInButton } from "@clerk/nextjs";

interface Tool {
  id: string;
  name: string;
  reviewCount?: number;
  averageRating?: number;
}

export function FeedbackForm() {
  const { userId, isLoaded } = useAuth();
  const [formData, setFormData] = useState({
    toolName: "",
    review: "",
    stars: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError('You must be signed in to submit a review');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // First, find the tool ID based on the tool name
      const toolsResponse = await fetch('/api/tools');
      if (!toolsResponse.ok) {
        throw new Error('Failed to fetch tools');
      }
      
      const tools = await toolsResponse.json() as Tool[];
      // Normalize the tool name for comparison by removing spaces and converting to lowercase
      const normalizedToolName = formData.toolName.toLowerCase().replace(/\s+/g, '');
      const tool = tools.find((t) => t.id === normalizedToolName);
      
      let toolId: string;
      if (!tool) {
        // Create a new tool if it doesn't exist
        const createToolResponse = await fetch('/api/tools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: formData.toolName }),
        });
        
        if (!createToolResponse.ok) {
          throw new Error('Failed to create new tool');
        }
        
        const newTool = await createToolResponse.json() as Tool;
        toolId = newTool.id;
      } else {
        toolId = tool.id;
      }
      
      // Submit the review with user information
      const reviewData = {
        ...formData,
        authorName: "User", // We'll use a generic name since we don't have access to the user's name in the client
        userId: userId,
      };
      
      const response = await fetch(`/api/tools/${toolId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }
      
      setSuccess(true);
      setFormData({
        toolName: "",
        review: "",
        stars: 0,
      });
      
      // Redirect to the tool page after a short delay
      setTimeout(() => {
        router.push(`/tool/${toolId}`);
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      setError(error.message || 'An error occurred while submitting your review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-800 rounded-md text-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-900/50 border border-green-800 rounded-md text-green-200">
          Your review has been submitted successfully! Redirecting...
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="toolName" className="text-gray-300">Tool Name</Label>
        <Input
          id="toolName"
          value={formData.toolName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, toolName: e.target.value })}
          placeholder="Enter the name of the AI tool"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="review" className="text-gray-300">Your Review</Label>
        <Textarea
          id="review"
          value={formData.review}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, review: e.target.value })}
          placeholder="Share your experience with this AI tool"
          rows={5}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-gray-300">Rating</Label>
        <FiveStarRating
          rating={formData.stars}
          onRatingChange={(rating: number) => setFormData({ ...formData, stars: rating })}
          disabled={isSubmitting}
        />
      </div>
      
      {!userId ? (
        <SignInButton mode="modal">
          <Button
            type="button"
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Sign in to submit a review
          </Button>
        </SignInButton>
      ) : (
        <Button
          type="submit"
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      )}
    </form>
  );
} 