import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk reads the session on every request, so pages and server routes know who's
// signed in. Every page is open: signed out, it runs as a guest trial that only
// lives in the visitor's own tab. Saved data is protected where it lives, by
// row-level security in Supabase: without a signed-in token, no rows come back.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
