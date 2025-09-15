import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans"
});

export const metadata: Metadata = {
  title: "POM",
  description: "A modern platform for employers and candidates",
  icons: {
    icon: '/img/icon- white bg- dark logo.png',
    shortcut: '/img/icon- white bg- dark logo.png',
    apple: '/img/icon- white bg- dark logo.png',
  },
};

// Conditional Clerk wrapper
function ConditionalClerkProvider({ children }: { children: React.ReactNode }) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Only render ClerkProvider if we have a valid-looking key
  if (clerkKey && clerkKey.startsWith('pk_') && clerkKey.length > 20) {
    return <ClerkProvider>{children}</ClerkProvider>;
  }
  
  // Fallback when Clerk key is not available or invalid
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.className} antialiased`}>
        <ConditionalClerkProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConditionalClerkProvider>
      </body>
    </html>
  );
}
