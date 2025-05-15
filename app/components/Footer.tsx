import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 py-12 border-t border-gray-200">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:items-center">
        <div className="md:text-center">
          <h3 className="text-lg font-semibold mb-4 text-yellow-600">AI Compass</h3>
          <p className="text-gray-600">Your guide to navigating the world of AI tools and reviews.</p>
        </div>
        <div className="md:text-center">
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
        <div className="md:text-center">
          <h4 className="text-lg font-semibold mb-4 text-yellow-600">Connect</h4>
          <div className="flex justify-center space-x-4">
            <a
              href="https://www.linkedin.com/company/mvhs-principal-s-tech-internship/"
              className="text-gray-600 hover:text-yellow-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/mvhs.tech"
              className="text-gray-600 hover:text-yellow-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} AI Compass. All rights reserved.</p>
      </div>
    </footer>
  )
}
