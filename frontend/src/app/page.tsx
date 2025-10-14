'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import LatestBlogPosts from '@/components/LatestBlogPosts';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import CookiesBanner from '@/components/CookiesBanner';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-modern flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen scroll-smooth">
      <Navigation />
      
      {/* Hero section - no scroll animation wrapper so it's immediately visible */}
      <Hero />

      <AnimateOnScroll type="fade-up" amount={0.01} once={false} duration={0.8}>
        <Features />
      </AnimateOnScroll>

      <AnimateOnScroll type="fade-up" amount={0.2}>
        <LatestBlogPosts />
      </AnimateOnScroll>

      <AnimateOnScroll type="fade-up" amount={0.2}>
        <Contact />
      </AnimateOnScroll>

      <Footer />
      
      {/* Cookies Banner */}
      <CookiesBanner />
    </main>
  );
}
