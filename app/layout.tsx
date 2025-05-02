import "./globals.css"
import {
  ClerkProvider,
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
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <ClerkProvider
          appearance={{
            baseTheme: undefined,
            elements: {
              formButtonPrimary: 
                "bg-yellow-600 hover:bg-yellow-700 text-sm normal-case",
              card: "bg-white shadow-xl",
              headerTitle: "text-gray-900",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: 
                "border border-gray-200 hover:bg-gray-50 text-gray-900",
              formFieldLabel: "text-gray-900",
              formFieldInput: 
                "border-gray-200 focus:border-yellow-600 focus:ring-yellow-600",
              footerActionLink: "text-yellow-600 hover:text-yellow-700",
            },
            variables: {
              colorPrimary: "#ca8a04",
              colorText: "#111827",
              colorTextSecondary: "#4b5563",
              colorBackground: "#ffffff",
              colorInputBackground: "#ffffff",
              colorInputText: "#111827",
              colorInputBorder: "#e5e7eb",
              colorInputBorderFocus: "#ca8a04",
              colorInputBorderHover: "#d1d5db",
              colorInputBorderError: "#ef4444",
              colorInputBorderSuccess: "#22c55e",
              colorInputBorderWarning: "#f59e0b",
              colorInputBorderInfo: "#3b82f6",
              colorInputBorderDisabled: "#e5e7eb",
              colorInputTextDisabled: "#9ca3af",
              colorInputBackgroundDisabled: "#f3f4f6",
              colorInputBorderFocusError: "#ef4444",
              colorInputBorderFocusSuccess: "#22c55e",
              colorInputBorderFocusWarning: "#f59e0b",
              colorInputBorderFocusInfo: "#3b82f6",
              colorInputBorderFocusDisabled: "#e5e7eb",
              colorInputTextFocus: "#111827",
              colorInputBackgroundFocus: "#ffffff",
              colorInputBorderFocusHover: "#ca8a04",
              colorInputBorderFocusErrorHover: "#ef4444",
              colorInputBorderFocusSuccessHover: "#22c55e",
              colorInputBorderFocusWarningHover: "#f59e0b",
              colorInputBorderFocusInfoHover: "#3b82f6",
              colorInputBorderFocusDisabledHover: "#e5e7eb",
              colorInputTextFocusError: "#ef4444",
              colorInputTextFocusSuccess: "#22c55e",
              colorInputTextFocusWarning: "#f59e0b",
              colorInputTextFocusInfo: "#3b82f6",
              colorInputTextFocusDisabled: "#9ca3af",
              colorInputBackgroundFocusError: "#ffffff",
              colorInputBackgroundFocusSuccess: "#ffffff",
              colorInputBackgroundFocusWarning: "#ffffff",
              colorInputBackgroundFocusInfo: "#ffffff",
              colorInputBackgroundFocusDisabled: "#f3f4f6",
            },
          }}
        >
          <MouseMoveEffect />
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}

