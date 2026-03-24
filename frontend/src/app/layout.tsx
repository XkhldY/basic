import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

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
  other: {
    "google-adsense-account": "ca-pub-4040445036727842",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4040445036727842"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${instrumentSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
