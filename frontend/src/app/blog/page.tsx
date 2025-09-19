'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Search, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BlogPost } from '@/types/blog';
import { unifiedBlogService } from '@/services/blog';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 5; // Desktop version
  const mobilePostsPerPage = 3; // Mobile carousel version

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        const response = await unifiedBlogService.getPosts({
          limit: 20, // Load more articles initially to test pagination
          offset: 0
        });
        
        console.log('Received posts:', response.posts.length, 'posts');
        setPosts(response.posts);
        setHasMore(response.posts.length === postsPerPage);
        setCurrentPage(0);
      } catch (err) {
        setError('Failed to load articles');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const loadMorePosts = async () => {
    console.log('loadMorePosts called', { loadingMore, hasMore, currentPage, postsLength: posts.length });
    
    if (loadingMore) {
      console.log('Already loading, skipping');
      return;
    }

    try {
      setLoadingMore(true);
      console.log('Setting loading to true');
      
      // Since we already have all articles loaded, we just need to update the display
      // The articles are already in the posts array, we just need to show more
      setCurrentPage(prevPage => {
        const newPage = prevPage + 1;
        console.log('Updating page from', prevPage, 'to', newPage);
        return newPage;
      });
      
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.error('Error loading more posts:', err);
      setError('Failed to load more articles. Please try again.');
    } finally {
      setLoadingMore(false);
      console.log('Setting loading to false');
    }
  };

  const showAllArticlesHandler = async () => {
    if (loadingMore) return;
    
    try {
      setLoadingMore(true);
      setShowAllArticles(true);
      
      // Load first batch of articles (5 more)
      const response = await unifiedBlogService.getPosts({
        limit: postsPerPage,
        offset: posts.length
      });
      
      setPosts(prevPosts => [...prevPosts, ...response.posts]);
      setHasMore(response.posts.length === postsPerPage);
    } catch (err) {
      console.error('Error loading more articles:', err);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle carousel scroll to update active dot
  const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const cardWidth = 320; // w-80 = 320px
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentCardIndex(Math.min(newIndex, 2)); // Max index is 2 (3 cards)
  };

  // Load more articles for infinite scroll
  const loadMoreArticles = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      
      const response = await unifiedBlogService.getPosts({
        limit: postsPerPage,
        offset: posts.length
      });
      
      setPosts(prevPosts => [...prevPosts, ...response.posts]);
      setHasMore(response.posts.length === postsPerPage);
    } catch (err) {
      console.error('Error loading more articles:', err);
      setError('Failed to load more articles. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  // Intersection Observer for infinite scroll on mobile
  useEffect(() => {
    if (!showAllArticles) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore) {
          loadMoreArticles();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('mobile-scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [showAllArticles, hasMore, loadingMore, posts.length]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <div className="text-xl text-white mb-2">Loading news articles...</div>
          <div className="text-gray-400 text-sm">Fetching the latest content</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-xl text-white mb-4">Unable to load articles</div>
          <div className="text-gray-400 mb-6">{error}</div>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary px-6 py-2 mr-3"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="px-6 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
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
      
      {/* Hero Section */}
      <section className={`pt-32 pb-4 md:pt-48 md:pb-16 relative z-10 ${showAllArticles ? 'md:block hidden' : ''}`}>
        <div className="container-custom">
          <motion.div
            className="text-center max-w-4xl mx-auto space-y-3 md:space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl lg:text-6xl font-bold text-white leading-tight normal-case"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Stay informed with latest industry insights
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Discover industry trends, career insights, and professional development tips 
              from our expert network of talent and employers.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className={`pt-4 pb-4 md:pb-8 relative z-10 ${showAllArticles ? 'md:block hidden' : ''}`}>
        <div className="container-custom">
          <div className="max-w-2xl mx-auto md:max-w-2xl w-80 md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search articles by title, content, or author"
                aria-describedby="search-results-count"
                className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-300 z-10"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div id="search-results-count" className="mt-2 text-sm text-gray-400 text-center">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="pt-8 pb-16 md:py-16 relative z-10">
        <div className="container-custom">
          {/* No Results Message */}
          {searchQuery && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <div className="text-white text-xl mb-4">No articles found</div>
              <div className="text-gray-400 mb-6">
                We couldn't find any articles matching "{searchQuery}".<br />
                Try adjusting your search terms or browse all articles.
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search and show all articles"
                  className="btn-primary px-6 py-2 mr-3"
                >
                  Clear search
                </button>
                <button
                  onClick={() => setShowAllArticles(true)}
                  aria-label="Browse all articles"
                  className="px-6 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors duration-300"
                >
                  Browse all articles
                </button>
              </div>
            </div>
          )}

          {/* Mobile: Horizontal Carousel */}
          {!showAllArticles && (
            <div className="md:hidden">
              <div 
                className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 py-4"
                style={{ 
                  scrollBehavior: 'smooth',
                  scrollSnapType: 'x mandatory'
                }}
                onScroll={handleCarouselScroll}
              >
                {filteredPosts.slice(0, mobilePostsPerPage).map((post, index) => (
                  <motion.article
                    key={post.id}
                    className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 hover:border-amber-300/50 hover:bg-white/20 transition-all duration-500 group snap-center flex flex-col"
                    style={{ scrollSnapAlign: 'center' }}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.1, 
                      ease: "easeOut" 
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    role="article"
                    aria-labelledby={`mobile-title-${post.id}`}
                    aria-describedby={`mobile-excerpt-${post.id}`}
                  >
                    {/* Article Picture */}
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-6">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                          <div className="text-white/60 text-sm">Article picture</div>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h2 id={`mobile-title-${post.id}`} className="text-xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Author and Date */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Author */}
                      <p className="text-sm text-gray-400">
                        By <span className="text-white font-medium">{post.author.name}</span>
                      </p>

                      {/* Date */}
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Calendar size={14} />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Article's first lines */}
                    <p id={`mobile-excerpt-${post.id}`} className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Reading Time and Dots - positioned at bottom with same margin as image */}
                    <div className="flex items-center justify-between mt-6">
                      {/* Reading Time */}
                      <div className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                        {post.readTime} min read
                      </div>
                      
                      {/* Carousel Dots */}
                      <div className="flex space-x-2" role="tablist" aria-label="Article navigation">
                        {filteredPosts.slice(0, mobilePostsPerPage).map((_, dotIndex) => (
                          <button
                            key={dotIndex}
                            role="tab"
                            aria-selected={dotIndex === index}
                            aria-label={`Go to article ${dotIndex + 1}`}
                            className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${
                              dotIndex === index 
                                ? 'bg-amber-400 scale-110' 
                                : 'bg-white/30 hover:bg-white/50'
                            }`}
                            onClick={() => {
                              const container = document.querySelector('.overflow-x-auto');
                              if (container) {
                                container.scrollTo({
                                  left: dotIndex * 336, // 320px width + 16px gap
                                  behavior: 'smooth'
                                });
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div className="mt-4 flex justify-center">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent"
                        style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                      >
                        <div className="flex items-center space-x-1 text-amber-400 group-hover:text-amber-300 transition-colors duration-200 cursor-pointer">
                          <span className="text-sm font-medium">Read more</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {/* Desktop: Vertical List */}
          <div className="hidden md:block space-y-12">
            {filteredPosts.slice(0, (currentPage + 1) * postsPerPage).map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 hover:border-amber-300/50 hover:bg-white/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1, 
                  ease: "easeOut" 
                }}
                whileHover={{ scale: 1.01 }}
                role="article"
                aria-labelledby={`desktop-title-${post.id}`}
                aria-describedby={`desktop-excerpt-${post.id}`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Article Picture */}
                  <div className="md:w-1/3">
                    {post.featuredImage ? (
                      <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 md:h-64 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                        <div className="text-white/60 text-sm">Article picture</div>
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="md:w-2/3 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h2 id={`desktop-title-${post.id}`} className="text-xl md:text-3xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-200 text-justify">
                        {post.title}
                      </h2>

                      {/* Author and Date */}
                      <div className="flex items-center justify-between mb-6">
                        {/* Author */}
                        <p className="text-sm text-gray-400">
                          By <span className="text-white font-medium">{post.author.name}</span>
                        </p>

                        {/* Date */}
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <Calendar size={14} />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>

                      {/* Article's first lines */}
                      <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-200 mb-6">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Read Time and Read More */}
                    <div className="flex items-center justify-between">
                      {/* Read Time */}
                      <div className="text-sm text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                        {post.readTime} min read
                      </div>
                      
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent"
                        style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                      >
                        <div className="flex items-center space-x-1 text-amber-400 group-hover:text-amber-300 transition-colors duration-200 cursor-pointer">
                          <span className="text-sm font-medium">Read more</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Desktop: Load More Button */}
          {(() => {
            const shouldShow = filteredPosts.length > (currentPage + 1) * postsPerPage;
            console.log('Button condition check:', {
              filteredPostsLength: filteredPosts.length,
              currentPage,
              postsPerPage,
              shouldShow,
              articlesShown: (currentPage + 1) * postsPerPage
            });
            return shouldShow;
          })() && (
            <motion.div
              className="text-center mt-12 hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <button
                onClick={loadMorePosts}
                disabled={loadingMore}
                aria-label={loadingMore ? "Loading more articles" : "Load more articles"}
                className="btn-primary px-8 py-3 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Loading more...</span>
                  </>
                ) : (
                  <>
                    <span>Load more articles</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Mobile: Back Button */}
          {showAllArticles && (
            <div className="md:hidden mb-6 pt-12 max-w-80 mx-auto">
              <button
                onClick={() => setShowAllArticles(false)}
                aria-label="Back to carousel view"
                className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors duration-300"
              >
                <ArrowRight size={16} className="rotate-180" />
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>
          )}

          {/* Mobile: All Articles Vertical */}
          {showAllArticles && (
            <div className="md:hidden space-y-8 max-w-80 mx-auto">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 hover:border-amber-300/50 hover:bg-white/20 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1, 
                    ease: "easeOut" 
                  }}
                  whileHover={{ scale: 1.01 }}
                  role="article"
                  aria-labelledby={`mobile-vertical-title-${post.id}`}
                  aria-describedby={`mobile-vertical-excerpt-${post.id}`}
                >
                  <div className="flex flex-col gap-4">
                    {/* Article Picture */}
                    <div className="w-full h-48 rounded-xl overflow-hidden">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-48 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                          <div className="text-white/60 text-sm">Article picture</div>
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className="flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h2 id={`mobile-vertical-title-${post.id}`} className="text-xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-200 text-justify">
                          {post.title}
                        </h2>

                        {/* Author and Date */}
                        <div className="flex items-center justify-between mb-4">
                          {/* Author */}
                          <p className="text-sm text-gray-400">
                            By <span className="text-white font-medium">{post.author.name}</span>
                          </p>

                          {/* Date */}
                          <div className="flex items-center space-x-1 text-sm text-gray-400">
                            <Calendar size={14} />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                        </div>

                      {/* Article's first lines */}
                      <p id={`mobile-vertical-excerpt-${post.id}`} className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-200 mb-4">
                        {post.excerpt}
                      </p>
                      </div>

                      {/* Read Time */}
                      <div className="text-sm text-gray-400 bg-white/10 px-2 py-1 rounded-full self-start">
                        {post.readTime} min read
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div className="mt-4 flex justify-center">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent"
                        style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                      >
                        <div className="flex items-center space-x-1 text-amber-400 group-hover:text-amber-300 transition-colors duration-200 cursor-pointer">
                          <span className="text-sm font-medium">Read more</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
              
              {/* Scroll Sentinel for Infinite Scroll */}
              <div id="mobile-scroll-sentinel" className="h-4"></div>
              
              {/* Loading Indicator */}
              {loadingMore && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
                  <div className="text-white mb-2">Loading more articles...</div>
                  <div className="text-gray-400 text-sm">Please wait while we fetch the latest content</div>
                </div>
              )}
            </div>
          )}

          {/* Mobile: See All Articles Button */}
          {!showAllArticles && filteredPosts.length > mobilePostsPerPage && (
            <motion.div
              className="text-center mt-8 md:hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <button
                onClick={showAllArticlesHandler}
                disabled={loadingMore}
                aria-label={loadingMore ? "Loading more articles" : "See all articles"}
                className="btn-primary px-8 py-3 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-300"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Loading more...</span>
                  </>
                ) : (
                  <>
                    <span>See all articles</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* No More Posts Message */}
          {!hasMore && posts.length > 0 && filteredPosts.length <= postsPerPage && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-400 text-sm">
                You've reached the end of our articles. Check back soon for more insights!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}