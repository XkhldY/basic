import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
