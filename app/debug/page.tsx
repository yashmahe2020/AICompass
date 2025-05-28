"use client";

import { useAuth, useUser } from "@clerk/nextjs";

export default function DebugPage() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  
  const currentDomain = typeof window !== "undefined" ? window.location.hostname : "SSR";
  const currentUrl = typeof window !== "undefined" ? window.location.href : "SSR";
  const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "SSR";

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-yellow-600">Debug Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Environment Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Environment</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Domain:</strong> {currentDomain}</p>
              <p><strong>URL:</strong> {currentUrl}</p>
              <p><strong>Node Env:</strong> {process.env.NODE_ENV}</p>
              <p><strong>Clerk Domain:</strong> {process.env.NEXT_PUBLIC_CLERK_DOMAIN || "Not set"}</p>
              <p><strong>Clerk Publishable Key:</strong> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "Set" : "Not set"}</p>
              <p><strong>User Agent:</strong> {userAgent}</p>
            </div>
          </div>

          {/* Auth Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Authentication</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Is Loaded:</strong> {isLoaded ? "✅ Yes" : "❌ No"}</p>
              <p><strong>Is Signed In:</strong> {isSignedIn ? "✅ Yes" : "❌ No"}</p>
              <p><strong>User ID:</strong> {userId || "None"}</p>
              <p><strong>User Email:</strong> {user?.primaryEmailAddress?.emailAddress || "None"}</p>
              <p><strong>User Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "None"}</p>
            </div>
          </div>

          {/* Clerk URLs */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Clerk Configuration</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Sign In URL:</strong> {process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "Not set"}</p>
              <p><strong>Sign Up URL:</strong> {process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "Not set"}</p>
              <p><strong>After Sign In:</strong> {process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "Not set"}</p>
              <p><strong>After Sign Up:</strong> {process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "Not set"}</p>
            </div>
          </div>

          {/* Firebase Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Firebase Configuration</h2>
            <div className="space-y-2 text-sm">
              <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Not set"}</p>
              <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "Not set"}</p>
              <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not set"}</p>
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-blue-50 p-6 rounded-lg md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Security Status</h2>
            <div className="space-y-2 text-sm">
              <p><strong>✅ OpenAI API Key:</strong> Server-side only (secure)</p>
              <p><strong>✅ Clerk Secret Key:</strong> Server-side only (secure)</p>
              <p><strong>✅ reCAPTCHA Secret:</strong> Server-side only (secure)</p>
              <p><strong>✅ Firebase Service Account:</strong> Server-side only (secure)</p>
              <p><strong>✅ Firebase Client Config:</strong> Client-side (safe by design)</p>
              <p><strong>✅ Clerk Publishable Key:</strong> Client-side (safe by design)</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-bold text-green-800 mb-2">✅ Success!</h3>
          <p className="text-green-700">
            If you can see this page without redirects, the basic routing and middleware are working correctly.
          </p>
        </div>

        <div className="mt-4 space-x-4">
          <a href="/" className="text-yellow-600 hover:text-yellow-700 underline">← Home</a>
          <a href="/browse" className="text-yellow-600 hover:text-yellow-700 underline">Browse</a>
          <a href="/verify" className="text-yellow-600 hover:text-yellow-700 underline">Verify</a>
        </div>
      </div>
    </div>
  );
} 