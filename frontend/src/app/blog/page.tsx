import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Search, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BlogPost } from '@/types/blog';
import { unifiedBlogService } from '@/services/blog';
import Link from 'next/link';
import Image from 'next/image';
import BlogPageClient from './BlogPageClient';

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Blog - Industry Insights & Career Development',
    description: 'Discover industry trends, career insights, and professional development tips from our expert network of talent and employers.',
    openGraph: {
      title: 'Blog - Industry Insights & Career Development',
      description: 'Discover industry trends, career insights, and professional development tips from our expert network of talent and employers.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog - Industry Insights & Career Development',
      description: 'Discover industry trends, career insights, and professional development tips from our expert network of talent and employers.',
    },
  };
}

// Force dynamic rendering to ensure NewsAPI calls work properly
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  // Fetch posts at request time to ensure NewsAPI is available
  let initialPosts: BlogPost[] = [];
  let hasError = false;
  let errorMessage = '';
  
  try {
    console.log('🔄 Fetching posts at request time...');
        const response = await unifiedBlogService.getPosts({
          limit: 20, // Load more articles initially to test pagination
          offset: 0
        });
    initialPosts = response.posts;
    console.log('✅ Successfully fetched posts:', initialPosts.length);
  } catch (error) {
    console.error('Error fetching posts at request time:', error);
    hasError = true;
    errorMessage = error instanceof Error ? error.message : 'Failed to load blog posts';
    // Fallback to empty array, client will handle error state
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Background with Modern 2025 Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 animate-gradient-shift" />
      
      {/* Modern Texture Layers */}
      <div className="absolute inset-0 opacity-40">
        {/* Geometric Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }} />
      </div>
      
      {/* Animated Mesh Flow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/15 to-transparent animate-mesh-flow" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-400/15 to-transparent animate-mesh-flow-reverse" />

      <Navigation />
      
      {/* Client Component for Interactive Features */}
      <BlogPageClient 
        initialPosts={initialPosts} 
        hasError={hasError}
        errorMessage={errorMessage}
      />

      <Footer />
    </main>
  );
}