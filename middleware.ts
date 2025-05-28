import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/browse",
    "/browse/(.*)",
    "/api/webhooks(.*)",
    "/[productId]",
    "/tool/(.*)",
    "/api/tools",
    "/api/tools/(.*)",
    "/submit",
    "/debug",
    "/sign-in",
    "/sign-up",
    "/verify"
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/tools/(.*)/reviews",
    "/_next/(.*)",
    "/favicon.ico",
    "/api/webhooks(.*)"
  ],
  // Add debug mode to help diagnose issues - only in development
  debug: process.env.NODE_ENV === "development",
  // Prevent Clerk from redirecting to /sign-in
  afterAuth(auth, req, evt) {
    // Add logging to help debug - only in development
    if (process.env.NODE_ENV === "development") {
      console.log("Middleware - URL:", req.url);
      console.log("Middleware - Auth state:", {
        userId: auth.userId,
        isPublicRoute: auth.isPublicRoute,
        isApiRoute: auth.isApiRoute
      });
    }
    
    // Don't redirect if it's already a public route or API route
    if (auth.isPublicRoute || auth.isApiRoute) {
      return;
    }
    
    // Don't redirect if user is already signed in
    if (auth.userId) {
      return;
    }
    
    // For protected routes, let Clerk handle the redirect naturally
    // Don't force any custom redirects here to avoid loops
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
