import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative pt-40 pb-20 sm:pt-48 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
          AI Compass
          <br />
          <span className="text-yellow-400">Your Guide to AI Tools</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10">
          Discover, compare, and choose the best AI tools with comprehensive reviews and insights from the community.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/browse">
            <Button className="relative group px-8 py-6 text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:opacity-90">
              <span className="relative z-10 text-black font-bold">Browse Tools</span>
              <div className="absolute inset-0 bg-white/20 blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            </Button>
          </Link>
          <Link href="/submit">
            <Button variant="outline" className="px-8 py-6 text-lg border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
              Submit Review
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

