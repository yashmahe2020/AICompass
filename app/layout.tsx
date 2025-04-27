import "./globals.css"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import MouseMoveEffect from "@/components/mouse-move-effect"
import Navbar from "@/app/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Compass - Your Guide to AI Tools",
  description: "Discover, compare, and choose the best AI tools with comprehensive reviews and insights from the community.",
}

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <ClerkProvider>
          <MouseMoveEffect />
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}

