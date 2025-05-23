"use client";

import { FeedbackForm } from "@/components/feedback-form";
import { MessageSquare, Star, Send } from "lucide-react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { Notification } from "@/components/ui/notification";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { app as firebaseApp } from "@/lib/firebase";

export default function SubmitPage() {
  const { userId, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [showNotification, setShowNotification] = useState(false);
  const [eduVerified, setEduVerified] = useState<null | boolean>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      // Fetch user profile from Firestore
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
    } else if (isLoaded && !userId) {
      setShowNotification(true);
      setProfileLoading(false);
    }
  }, [isLoaded, userId]);

  const handleSignIn = () => {
    openSignIn();
  };

  const handleVerify = () => {
    router.push("/verify");
  };

  if (!isLoaded || profileLoading) {
    return <div className="min-h-screen bg-white text-gray-900 pt-32 pb-16">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-32 pb-16">
      <Notification
        show={showNotification}
        onClose={() => setShowNotification(false)}
      >
        You must be logged in to submit a review
      </Notification>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!userId ? (
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-yellow-600">Sign In Required</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Please sign in to submit your review.
            </p>
            <button 
              onClick={handleSignIn}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
            >
              Sign In to Submit
            </button>
          </div>
        ) : eduVerified === false ? (
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-yellow-600">Verification Required</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              You must verify your student or teacher status to submit a review.<br />
              <span className="text-sm text-gray-500">(Only verified educators and students can post reviews.)</span>
            </p>
            <button 
              onClick={handleVerify}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors mr-4"
            >
              Verify Now
            </button>
            <button
              onClick={() => router.push("/browse")}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Verify Later
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-yellow-600">Share Your Experience</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Help others discover the best AI tools by sharing your insights and experiences.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-6 w-6 text-yellow-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Submit Your Review</h2>
                </div>
                <p className="text-gray-600">
                  Your review will help others make informed decisions about AI tools.
                </p>
              </div>
              
              <div className="p-6">
                <FeedbackForm />
              </div>
              
              <div className="bg-gray-50 p-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-600 mr-1" />
                  <span>View current reviews for common AI Tools!</span>
                </div>
                <Link href="/browse" className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                  <Send className="h-4 w-4 mr-1" />
                  View Reviews
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 
