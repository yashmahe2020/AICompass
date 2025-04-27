import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-20 bg-black text-white border-t border-gray-800">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Ready to Find Your Perfect AI Tool?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
          Join our community of AI enthusiasts and professionals to discover, review, and share insights about the best AI tools.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/browse">
            <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500">
              Browse AI Tools
            </Button>
          </Link>
          <Link href="/submit">
            <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
              Submit a Review
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

