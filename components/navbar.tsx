import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800/40 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Amane Soft</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/solutions" className="transition-colors hover:text-gray-900 dark:hover:text-gray-50">
            Solutions
          </Link>
          <Link href="/industries" className="transition-colors hover:text-gray-900 dark:hover:text-gray-50">
            Industries
          </Link>
          <Link href="/about" className="transition-colors hover:text-gray-900 dark:hover:text-gray-50">
            About Us
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="https://github.com/amanesoft" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            Contact
          </Button>
          <Button size="sm">Get a Demo</Button>
        </div>
      </div>
    </header>
  )
}

