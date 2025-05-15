"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiveStarRating } from "./five-star-rating";
import { Loader2 } from "lucide-react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { RecaptchaCheckbox } from "./recaptcha-checkbox";
import Script from 'next/script';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app as firebaseApp } from "@/lib/firebase";

interface Tool {
  id: string;
  name: string;
  reviewCount?: number;
  averageRating?: number;
}

export function FeedbackForm() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [formData, setFormData] = useState({
    toolName: "",
    review: "",
    stars: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [eduVerified, setEduVerified] = useState<null | boolean>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        setProfileLoading(true);
        try {
          const db = getFirestore(firebaseApp);
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            setEduVerified(userDoc.data().eduVerified === true);
          } else {
            setEduVerified(false);
          }
        } catch (e) {
          setEduVerified(false);
        } finally {
          setProfileLoading(false);
        }
      };
      fetchProfile();
    }
  }, [userId]);

  const handleSignIn = () => {
    openSignIn();
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.toolName.trim()) {
      setError('Please enter a tool name');
      return false;
    }
    
    if (formData.stars < 1 || formData.stars > 5) {
      setError('Please select a rating between 1 and 5 stars');
      return false;
    }
    
    if (formData.review.length < 5) {
      setError('Please enter a review with at least 5 characters');
      return false;
    }
    
    if (formData.review.length > 1000) {
      setError('Review is too long. Please keep it under 1000 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError('You must be signed in to submit a review');
      return;
    }
    
    if (!isRecaptchaVerified) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }
    
    if (eduVerified === false) {
      setError('You must be a verified student or teacher to submit a review.');
      return;
    }
    
    // Validate form data
    if (!validateForm()) {
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
      
      // Get the user's full name from Clerk
      const firstName = user?.firstName || '';
      const lastName = user?.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim() || 'Anonymous User';
      
      // Submit the review with user information
      const reviewData = {
        ...formData,
        authorName: fullName,
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

  if (profileLoading) {
    return <div className="py-8 text-center text-gray-500">Loading profile...</div>;
  }

  if (eduVerified === false) {
    return (
      <div className="py-8 text-center text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-lg font-semibold mb-2">Verification Required</div>
        <div className="mb-4">You must verify your student or teacher status to submit a review.</div>
        <button
          onClick={() => router.push('/verify')}
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors mr-2"
        >
          Verify Now
        </button>
        <button
          onClick={() => router.push('/browse')}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Verify Later
        </button>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
          <p className="font-medium">Thank you for your review!</p>
          <p className="mt-2">Your feedback has been submitted successfully.</p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => router.push('/browse')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Browse more tools →
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="toolName">AI Tool Name</Label>
            <Input
              id="toolName"
              value={formData.toolName}
              onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
              placeholder="Enter the name of the AI tool"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Rating</Label>
            <FiveStarRating
              rating={formData.stars}
              onRatingChange={(rating) => setFormData({ ...formData, stars: rating })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              placeholder="Share your experience with this AI tool..."
              rows={5}
              required
            />
          </div>
          
          <RecaptchaCheckbox onVerified={setIsRecaptchaVerified} />
          
          <div className="flex justify-start">
            <Button type="submit" disabled={isSubmitting || !isRecaptchaVerified}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  );
} 