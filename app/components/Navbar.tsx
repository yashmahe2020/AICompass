import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-yellow-400 hover:text-yellow-300"
            >
              AI Compass
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link href="/browse" className="text-sm text-gray-300 hover:text-yellow-400">
                Browse Tools
              </Link>
              <Link href="/submit" className="text-sm text-gray-300 hover:text-yellow-400">
                Submit Review
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-sm text-gray-300 hover:text-yellow-400">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="text-sm bg-yellow-400 text-black hover:bg-yellow-500">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}

