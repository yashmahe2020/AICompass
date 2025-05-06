import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/browse",
    "/api/webhooks(.*)",
    "/[productId]",
    "/tool/(.*)",
    "/api/tools",
    "/api/tools/(.*)",
    "/submit"
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/tools/(.*)/reviews"
  ],
  // Add debug mode to help diagnose issues
  debug: false,
  // Prevent Clerk from redirecting to /sign-in
  afterAuth(auth, req, evt) {
    // Your authentication logic here
  }
});
