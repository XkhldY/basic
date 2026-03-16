'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

const ClerkProvider = dynamic(
  () => import('@clerk/nextjs').then((m) => m.ClerkProvider),
  { ssr: false }
);

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const shouldUseClerk = Boolean(
    clerkPublishableKey &&
    clerkPublishableKey !== 'your_clerk_publishable_key_here' &&
    clerkPublishableKey.startsWith('pk_')
  );

  if (shouldUseClerk && ClerkProvider) {
    return (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <AuthProvider>{children}</AuthProvider>
      </ClerkProvider>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
}