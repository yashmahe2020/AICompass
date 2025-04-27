import { FeedbackForm } from "@/components/feedback-form";
import { MessageSquare, Star, Send } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function SubmitPage() {
  const { userId } = await auth();
  
  // If the user is not authenticated, redirect to the home page
  if (!userId) {
    redirect("/");
  }
  
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-yellow-400">Share Your Experience</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Help others discover the best AI tools by sharing your insights and experiences.
          </p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-6 w-6 text-yellow-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Submit Your Review</h2>
            </div>
            <p className="text-gray-300">
              Your review will help others make informed decisions about AI tools.
            </p>
          </div>
          
          <div className="p-6">
            <FeedbackForm />
          </div>
          
          <div className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-400">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>Your feedback is valuable to our community</span>
            </div>
            <button className="flex items-center text-yellow-400 hover:text-yellow-300 text-sm font-medium">
              <Send className="h-4 w-4 mr-1" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
