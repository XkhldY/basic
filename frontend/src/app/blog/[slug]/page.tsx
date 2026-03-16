import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { BlogPost } from '@/types/blog'
import { unifiedBlogService } from '@/services/blog'
import { getStaticPostBySlug, getAllStaticBlogSlugs } from '@/data/blog'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ShareButton from '@/components/ShareButton'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Normalized post shape for rendering (from static data or API)
type RenderedPost = {
  title: string
  excerpt: string
  publishedAt: string
  readTime: number
  author: { name: string; role: string; avatar?: string }
  content: string
  featuredImage?: string
  tags?: string[]
}

// Generate static params for static blog posts (and optionally API posts)
export async function generateStaticParams() {
  const staticSlugs = getAllStaticBlogSlugs()
  return staticSlugs.map((slug) => ({ slug }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  try {
    const resolvedParams = await params
    const staticPost = getStaticPostBySlug(resolvedParams.slug)
    if (staticPost) {
      return {
        title: staticPost.title,
        description: staticPost.excerpt,
        openGraph: {
          title: staticPost.title,
          description: staticPost.excerpt,
          type: 'article',
          publishedTime: staticPost.publishedAt,
          authors: [staticPost.author.name],
        },
        twitter: {
          card: 'summary_large_image',
          title: staticPost.title,
          description: staticPost.excerpt,
        },
      }
    }
    const post = await unifiedBlogService.getPost(resolvedParams.slug)
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
  } catch {
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post.',
    }
  }
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const resolvedParams = await params
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const shareUrl = `${baseUrl}/blog/${resolvedParams.slug}`

  // Prefer static blog post (hirewithpom-style content)
  const staticPost = getStaticPostBySlug(resolvedParams.slug)
  let post: RenderedPost | null = null

  if (staticPost) {
    post = {
      title: staticPost.title,
      excerpt: staticPost.excerpt,
      publishedAt: staticPost.publishedAt,
      readTime: staticPost.readTime,
      author: { name: staticPost.author.name, role: staticPost.author.role },
      content: staticPost.content,
      featuredImage: staticPost.featuredImage,
      tags: [staticPost.category],
    }
  } else {
    try {
      const apiPost = await unifiedBlogService.getPost(resolvedParams.slug)
      if (apiPost) {
        post = {
          title: apiPost.title,
          excerpt: apiPost.excerpt,
          publishedAt: apiPost.publishedAt,
          readTime: apiPost.readTime,
          author: apiPost.author,
          content: apiPost.content,
          featuredImage: apiPost.featuredImage,
          tags: apiPost.tags,
        }
      }
    } catch (err) {
      console.error('Error fetching post:', err)
    }
  }

  if (!post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const normalized = dateString.includes('T') ? dateString : dateString + 'T12:00:00Z'
    return new Date(normalized).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })
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
                    url={shareUrl}
                  />
                </div>
                
                {/* Share Button - Desktop only, right side */}
                <div className="hidden md:flex flex-shrink-0 ml-auto">
                  <ShareButton 
                    title={post.title}
                    excerpt={post.excerpt}
                    url={shareUrl}
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
                <div className="text-gray-200 leading-relaxed text-sm md:text-lg prose prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Custom styling for markdown elements
                      h1: ({ children }) => <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-white text-xl md:text-2xl font-bold mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-white text-lg md:text-xl font-bold mb-2">{children}</h3>,
                      p: ({ children }) => <p className="text-gray-200 mb-4 leading-relaxed">{children}</p>,
                      strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="text-gray-300 italic">{children}</em>,
                      code: ({ children }) => <code className="bg-white/10 text-amber-300 px-2 py-1 rounded text-sm">{children}</code>,
                      pre: ({ children }) => <pre className="bg-white/10 text-gray-200 p-4 rounded-lg overflow-x-auto">{children}</pre>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-400 pl-4 italic text-gray-300 my-4">{children}</blockquote>,
                      ul: ({ children }) => <ul className="list-disc list-inside text-gray-200 mb-4 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside text-gray-200 mb-4 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-200">{children}</li>,
                      a: ({ href, children }) => <a href={href} className="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
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
