'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';

interface LatestBlogPostsProps {
  className?: string;
}

export default function LatestBlogPosts({ className = '' }: LatestBlogPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/blog/latest?limit=3');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch latest posts');
        }
        
        setPosts(data.data.posts);
      } catch (err) {
        console.error('Error fetching latest posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load latest posts');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <section className={`pt-0 sm:pt-12 pb-12 sm:pb-16 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 relative overflow-hidden ${className}`}>
        {/* Background with Subtle Animations */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50" />
        
        {/* Visible but Elegant Geometric Patterns */}
        <div className="absolute inset-0 opacity-40">
          {/* Clear Grid Pattern - Matching spacing but keeping amber theme */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(251, 191, 36, 0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251, 191, 36, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Visible Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-300/25 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2.5}s`
              }}
            />
              ))}
            </div>
        
        {/* Visible Mesh Flow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent animate-mesh-flow" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-200/20 to-transparent animate-mesh-flow-reverse" />
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-400 rounded-full text-sm font-medium text-gray-900 mb-10 mt-12 sm:mt-8">
              <BookOpen size={16} />
              <span>Blog</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-semibold text-gray-900 mb-4">
              Latest blog posts
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-800 max-w-3xl mx-auto">
              Stay updated with our latest insights and industry trends
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white/80 rounded-2xl p-6 shadow-xl border border-amber-200/30 animate-pulse">
                <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl mb-4 animate-pulse"></div>
                <div className="h-6 bg-gradient-to-r from-amber-200 to-amber-300 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded mb-4 w-3/4 animate-pulse"></div>
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={`pt-0 sm:pt-12 pb-12 sm:pb-16 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 relative overflow-hidden ${className}`}>
        {/* Background with Subtle Animations */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50" />
        
        {/* Visible but Elegant Geometric Patterns */}
        <div className="absolute inset-0 opacity-40">
          {/* Clear Grid Pattern - Matching spacing but keeping amber theme */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(251, 191, 36, 0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251, 191, 36, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Visible Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-300/25 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2.5}s`
              }}
            />
              ))}
            </div>
        
        {/* Visible Mesh Flow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent animate-mesh-flow" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-200/20 to-transparent animate-mesh-flow-reverse" />
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-400 rounded-full text-sm font-medium text-gray-900 mb-10 mt-12 sm:mt-8">
              <BookOpen size={16} />
              <span>Blog</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-semibold text-gray-900 mb-4">
              Latest blog posts
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-800 max-w-3xl mx-auto">
              Stay updated with our latest insights and industry trends
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-gray-900 text-xl font-semibold mb-2">Unable to Load Posts</h3>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                // Retry the fetch
                const fetchLatestPosts = async () => {
                  try {
                    setLoading(true);
                    setError(null);
                    
                    const response = await fetch('/api/blog/latest?limit=3');
                    const data = await response.json();
                    
                    if (!response.ok) {
                      throw new Error(data.message || 'Failed to fetch latest posts');
                    }
                    
                    setPosts(data.data.posts);
                  } catch (err) {
                    console.error('Error fetching latest posts:', err);
                    setError(err instanceof Error ? err.message : 'Failed to load latest posts');
                  } finally {
                    setLoading(false);
                  }
                };
                fetchLatestPosts();
              }}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <section className={`pt-0 sm:pt-12 pb-12 sm:pb-16 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 relative overflow-hidden ${className}`}>
        {/* Background with Subtle Animations */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50" />
        
        {/* Visible but Elegant Geometric Patterns */}
        <div className="absolute inset-0 opacity-40">
          {/* Clear Grid Pattern - Matching spacing but keeping amber theme */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(251, 191, 36, 0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251, 191, 36, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Visible Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-300/25 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2.5}s`
              }}
            />
              ))}
            </div>
        
        {/* Visible Mesh Flow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent animate-mesh-flow" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-200/20 to-transparent animate-mesh-flow-reverse" />
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-400 rounded-full text-sm font-medium text-gray-900 mb-10 mt-12 sm:mt-8">
              <BookOpen size={16} />
              <span>Blog</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-semibold text-gray-900 mb-4">
              Latest blog posts
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-800 max-w-3xl mx-auto">
              Stay updated with our latest insights and industry trends
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="text-gray-600 text-6xl mb-4">📝</div>
            <h3 className="text-gray-900 text-xl font-semibold mb-2">No Posts Available</h3>
            <p className="text-gray-700 mb-6">
              We're working on creating amazing content for you. Check back soon!
            </p>
            <Link href="/blog" className="btn-primary">
              Visit our blog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Main content
  return (
    <section className={`pt-0 sm:pt-12 pb-12 sm:pb-16 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 relative overflow-hidden ${className}`}>
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
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-400 rounded-full text-sm font-medium text-gray-900 mb-10 mt-12 sm:mt-8">
            <BookOpen size={16} />
            <span>Blog</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-semibold text-white mb-4">
            Latest blog posts
          </h2>
          <p className="text-base text-gray-300 max-w-3xl mx-auto">
            Stay updated with our latest insights and industry trends
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-[#ffc759]/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${post.slug}`} prefetch={true}>
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#ffc759]/20 to-[#ffb84d]/20 flex items-center justify-center">
                      <User size={48} className="text-[#ffc759]/60" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 bg-[#ffc759]/90 text-gray-900 text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-white font-semibold text-lg mb-3 line-clamp-2 group-hover:text-[#ffc759] transition-colors duration-200">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      {/* Author */}
                      <div className="flex items-center space-x-2">
                        <User size={14} className="text-[#ffc759]" />
                        <span className="truncate max-w-20">{post.author.name}</span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-[#ffc759]" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Reading Time */}
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-[#ffc759]" />
                      <span>{post.readTime}m</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Articles Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link 
            href="/blog" 
            className="btn-primary text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 group w-[200px] sm:w-[220px] h-[48px] sm:h-[56px] mx-auto whitespace-nowrap"
          >
            <span>View all articles</span>
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
