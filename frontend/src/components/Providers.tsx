'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/contexts/AuthContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Check if Clerk is configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Only use Clerk if key exists, is not a placeholder, and has valid format
  const shouldUseClerk = clerkPublishableKey && 
                         clerkPublishableKey !== 'your_clerk_publishable_key_here' &&
                         clerkPublishableKey.startsWith('pk_');
  
  if (shouldUseClerk) {
    // Use Clerk if properly configured
    return (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ClerkProvider>
    );
  }
  
  // Fallback to custom AuthProvider if Clerk is not configured
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}