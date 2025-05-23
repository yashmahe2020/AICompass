import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="py-4 px-6 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          StreamLine
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-yellow-600">
            Features
          </Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-yellow-600">
            Testimonials
          </Link>
          <Link href="#pricing" className="text-gray-600 hover:text-yellow-600">
            Pricing
          </Link>
        </nav>
        <Button>Get Started</Button>
      </div>
    </header>
  )
}

