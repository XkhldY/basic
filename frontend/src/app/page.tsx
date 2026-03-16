'use client';

import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import LatestBlogPosts from '@/components/LatestBlogPosts';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import CookiesBanner from '@/components/CookiesBanner';

export default function Home() {
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
