'use client';

import Image from 'next/image';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { STATIC_BLOG_POSTS } from '@/data/blog';

// Use UTC so server and client render the same (avoids hydration mismatch for date-only strings like "2025-05-14")
function formatDate(dateString: string) {
  return new Date(dateString + (dateString.includes('T') ? '' : 'T12:00:00Z')).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function BlogListClient() {
  return (
    <div className="relative z-10">
      <h1 className="text-4xl sm:text-5xl font-semibold text-white text-center mb-12">
        Blog
      </h1>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {STATIC_BLOG_POSTS.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex flex-col"
          >
            {post.featuredImage && (
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
            )}
            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <span className="inline-block text-xs font-medium text-blue-400 uppercase tracking-wide mb-2">
                {post.category}
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="inline-flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-blue-400" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="inline-flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-blue-400" />
                    {post.readTime} min read
                  </span>
                </div>
                <span className="inline-flex items-center text-blue-400 font-medium">
                  Read more
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
