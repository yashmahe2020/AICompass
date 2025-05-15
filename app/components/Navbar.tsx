"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs"

export default function Navbar() {
  const { openSignIn, openSignUp } = useClerk();

  const handleSignIn = () => {
    openSignIn();
  };

  const handleSignUp = () => {
    openSignUp();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-16 flex items-center">
        {/* Left: Logo */}
        <div className="flex items-center h-full">
          <Link
            href="/"
            className="text-2xl font-bold text-yellow-600 hover:text-yellow-700"
          >
            AI Compass
          </Link>
        </div>
        {/* Center: Nav links, absolutely centered */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-sm text-gray-600 hover:text-yellow-600">
              Browse Tools
            </Link>
            <Link href="/submit" className="text-sm text-gray-600 hover:text-yellow-600">
              Submit Review
            </Link>
          </div>
        </div>
        {/* Right: Auth/User buttons */}
        <div className="flex items-center space-x-4 ml-auto h-full">
          <SignedOut>
            <Button 
              variant="ghost" 
              className="text-sm text-gray-600 hover:text-yellow-600 hover:bg-gray-200"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button 
              className="text-sm bg-yellow-600 text-white hover:bg-yellow-700"
              onClick={handleSignUp}
            >
              Get Started
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}

