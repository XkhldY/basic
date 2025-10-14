import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Only use Clerk middleware if properly configured
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const shouldUseClerk = clerkKey && clerkKey.startsWith('pk_');

export default shouldUseClerk 
  ? clerkMiddleware()
  : (request: NextRequest) => {
      // Pass through without Clerk when disabled
      return NextResponse.next();
    };

export const config = {
  // Only run middleware on specific routes to avoid conflicts
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};