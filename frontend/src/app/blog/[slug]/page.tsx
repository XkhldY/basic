import { ArrowLeft, Calendar, Clock, User, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { BlogPost } from '@/types/blog'
import { unifiedBlogService } from '@/services/blog'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ShareButton from '@/components/ShareButton'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const response = await unifiedBlogService.getPosts({ limit: 100 })
    return response.posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  try {
    const resolvedParams = await params;
    const response = await unifiedBlogService.getPosts({ limit: 100 })
    const post = response.posts.find(p => p.slug === resolvedParams.slug)
    
    if (!post) {
      return {
        title: 'Article Not Found',
        description: 'The article you are looking for does not exist.',
      }
    }

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post.',
    }
  }
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  let post: BlogPost | null = null
  let error: string | null = null
  let isLoading = false

  try {
    const resolvedParams = await params;
    const response = await unifiedBlogService.getPosts({ limit: 100 })
    post = response.posts.find(p => p.slug === resolvedParams.slug) || null
    
    if (!post) {
      notFound()
    }
  } catch (err) {
    console.error('Error fetching post:', err)
    error = err instanceof Error ? err.message : 'Failed to load article'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ffc759] mx-auto mb-4"></div>
          <h1 className="text-white text-xl font-bold mb-2">Loading Article</h1>
          <p className="text-gray-300">
            Please wait while we fetch the article content...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-4">📄</div>
          <h1 className="text-white text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-300 mb-8">
            The article you're looking for doesn't exist or may have been moved.
          </p>
          <div className="space-y-4">
            <Link href="/blog" prefetch={true}>
              <button className="btn-primary w-48">
                Back to Blog
              </button>
            </Link>
            <div className="pt-2"></div>
            <Link href="/">
              <button className="bg-gray-900 hover:bg-gray-800 text-[#ffc759] hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 border border-[#ffc759]/30 hover:border-[#ffc759] w-48">
                Return to Homepage
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 relative overflow-hidden">
      {/* Navigation */}
      <Navigation />
      
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
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }} />
      </div>
      
      {/* Animated Mesh Flow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/15 to-transparent animate-mesh-flow" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-400/15 to-transparent animate-mesh-flow-reverse" />

      <div className="relative z-10">
        {/* Header */}
         <div className="container-custom pt-20 pb-4 md:pt-32 md:pb-16 px-8 md:px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto md:max-w-4xl">
            {/* Back Navigation */}
            <div className="mb-8">
              <Link 
                href="/blog"
                prefetch={true}
                className="inline-flex items-center space-x-2 text-[#ffc759] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-12">
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-64 md:h-96 object-cover"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 md:mb-6">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-base md:text-xl text-gray-300 leading-relaxed mb-8">
                {post.excerpt}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 md:gap-6 text-gray-400 mb-8">
                {/* Author */}
                <div className="flex items-center space-x-2 min-w-0 md:min-w-auto">
                  <User size={18} className="text-[#ffc759] flex-shrink-0" />
                  <div className="min-w-0 flex-1 md:flex-none">
                    <div className="truncate md:truncate-none">
                      <span className="font-medium">{post.author.name}</span>
                      {post.author.role && (
                        <span className="text-gray-500 font-medium"> • {post.author.role}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Calendar size={18} className="text-[#ffc759]" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                {/* Reading Time */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Clock size={18} className="text-[#ffc759]" />
                  <span>{post.readTime} min read</span>
                </div>
                
                {/* Share Button - Mobile only, right side */}
                <div className="md:hidden flex-shrink-0 ml-auto">
                  <ShareButton 
                    title={post.title}
                    excerpt={post.excerpt}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
                
                {/* Share Button - Desktop only, right side */}
                <div className="hidden md:flex flex-shrink-0 ml-auto">
                  <ShareButton 
                    title={post.title}
                    excerpt={post.excerpt}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-[#ffc759]/20 to-[#ffb84d]/20 border border-[#ffc759]/30 rounded-full text-sm font-light text-[#ffc759]/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            </header>

            {/* Article Content */}
            <article className="prose prose-lg prose-invert max-w-none">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-12 border border-white/10">
                <div 
                  className="text-gray-200 leading-relaxed text-sm md:text-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content.replace(/\n/g, '<br>') 
                  }}
                />
              </div>
            </article>

            {/* Footer - Desktop only */}
            <footer className="hidden md:block mt-4 md:mt-16 pt-4 md:pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  {post.author.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-[#ffc759] to-[#ffb84d] rounded-full flex items-center justify-center">
                      <User size={16} className="text-gray-900 md:hidden" />
                      <User size={24} className="text-gray-900 hidden md:block" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-semibold text-sm md:text-base">{post.author.name}</h3>
                    {post.author.role && (
                      <p className="text-gray-400 text-sm md:text-base">{post.author.role}</p>
                    )}
                  </div>
                </div>

                {/* Back to Blog Button */}
                <Link href="/blog" prefetch={true}>
                  <button className="btn-primary text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
                    Back to Blog
                  </button>
                </Link>
              </div>
            </footer>
          </div>
        </div>

        {/* Home page footer - Mobile only */}
        <div className="md:hidden mt-8">
          <Footer />
        </div>

        {/* Home page footer - Desktop only */}
        <div className="hidden md:block mt-8">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default BlogPostPage
