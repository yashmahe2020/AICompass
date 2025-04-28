import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 py-12 border-t border-gray-200">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-yellow-600">AI Compass</h3>
          <p className="text-gray-600">Your guide to navigating the world of AI tools and reviews.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-yellow-600">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/browse" className="text-gray-600 hover:text-yellow-600">
                Browse Tools
              </Link>
            </li>
            <li>
              <Link href="/submit" className="text-gray-600 hover:text-yellow-600">
                Submit Review
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-yellow-600">
                Featured Tools
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-yellow-600">Resources</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-gray-600 hover:text-yellow-600">
                AI Guides
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-yellow-600">
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-yellow-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-yellow-600">Connect</h4>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-600 hover:text-yellow-600">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-yellow-600">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-yellow-600">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-yellow-600">
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} AI Compass. All rights reserved.</p>
      </div>
    </footer>
  )
}

