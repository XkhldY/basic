'use client';

import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import LatestBlogPosts from '@/components/LatestBlogPosts';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import CookiesBanner from '@/components/CookiesBanner';
import GoogleAd from '@/components/GoogleAd';

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth">
      <Navigation />
      
      {/* Hero section - no scroll animation wrapper so it's immediately visible */}
      <Hero />

      {/* arabic_keyboard_1 Ad Unit */}
      <div className="container mx-auto px-4 my-8">
        <GoogleAd slot="7136445175" />
      </div>

      <AnimateOnScroll type="fade-up" amount={0.01} once={false} duration={0.8}>
        <Features />
      </AnimateOnScroll>

      <AnimateOnScroll type="fade-up" amount={0.2}>
        <LatestBlogPosts />
      </AnimateOnScroll>

      {/* arabic_keyboard_1 Ad Unit */}
      <div className="container mx-auto px-4 my-8">
        <GoogleAd slot="7136445175" />
      </div>

      <AnimateOnScroll type="fade-up" amount={0.2}>
        <Contact />
      </AnimateOnScroll>

      <Footer />
      
      {/* Cookies Banner */}
      <CookiesBanner />
    </main>
  );
}
