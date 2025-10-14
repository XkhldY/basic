'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
  index?: number;
}

const BlogCard = ({ post, variant = 'default', index = 0 }: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCardClasses = () => {
    switch (variant) {
      case 'featured':
        return 'bg-white/90 rounded-3xl p-8 shadow-xl border border-amber-200/30 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 hover:bg-white hover:border-amber-300/50';
      case 'compact':
        return 'bg-white/80 rounded-2xl p-6 shadow-lg border border-amber-200/30 hover:shadow-xl transition-all duration-200 group hover:-translate-y-1 hover:bg-white hover:border-amber-300/50';
      default:
        return 'bg-white/80 rounded-2xl p-6 shadow-lg border border-amber-200/30 hover:shadow-xl transition-all duration-200 group hover:-translate-y-1 hover:bg-white hover:border-amber-300/50';
    }
  };

  const getImageClasses = () => {
    switch (variant) {
      case 'featured':
        return 'w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6';
      case 'compact':
        return 'w-full h-40 rounded-xl overflow-hidden mb-4';
      default:
        return 'w-full h-48 rounded-xl overflow-hidden mb-4';
    }
  };

  const getTitleClasses = () => {
    switch (variant) {
      case 'featured':
        return 'text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-200';
      case 'compact':
        return 'text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-200';
      default:
        return 'text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-200';
    }
  };

  const getExcerptClasses = () => {
    switch (variant) {
      case 'featured':
        return 'text-gray-700 leading-relaxed mb-6 group-hover:text-gray-600 transition-colors duration-200';
      case 'compact':
        return 'text-gray-600 text-sm mb-3 group-hover:text-gray-500 transition-colors duration-200';
      default:
        return 'text-gray-700 leading-relaxed mb-4 group-hover:text-gray-600 transition-colors duration-200';
    }
  };

  return (
    <motion.article
      className={getCardClasses()}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1, 
        ease: "easeOut" 
      }}
      whileHover={{ scale: variant === 'featured' ? 1.02 : 1.01 }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className={getImageClasses()}>
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
            {post.category}
          </span>
          {post.isFeatured && (
            <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={getTitleClasses()}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className={getExcerptClasses()}>
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg flex items-center space-x-1"
              >
                <Tag size={10} />
                <span>{tag}</span>
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          
          {/* Read More Arrow */}
          <div className="flex items-center space-x-1 text-amber-600 group-hover:text-amber-700 transition-colors duration-200">
            <span className="text-sm font-medium">Read more</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
