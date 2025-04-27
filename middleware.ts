import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Create a matcher for protected routes
const isProtectedRoute = createRouteMatcher([
  "/submit(.*)",
  "/api/tools/:toolId/reviews",
  "/api/ai-summary/:toolId"
]);

export default clerkMiddleware((auth, req) => {
  // If the user is not authenticated and trying to access a protected route, redirect to the home page
  if (isProtectedRoute(req) && !auth) {
    return Response.redirect(new URL("/", req.url));
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
