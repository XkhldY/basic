import { BlogPost, BlogCategory } from '@/types/blog';

// Helper function to create unique slug from article data
function createUniqueSlug(title: string, url: string, publishedAt: string): string {
  // Extract a unique identifier from the URL or create one from title + date
  const urlHash = url ? url.split('/').pop()?.split('?')[0] : '';
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 50); // Limit length
  
  // Use URL hash if available, otherwise use title + date
  const uniqueId = urlHash || `${titleSlug}-${publishedAt.split('T')[0]}`;
  
  return `news-${uniqueId}`;
}

// Mock data for blog posts
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The future of remote work: Trends and insights for 2024',
    excerpt: 'Explore the latest trends in remote work and how companies are adapting to the new normal. Discover what the future holds for distributed teams.',
    content: `# The Future of Remote Work: Trends and Insights for 2024

Remote work has transformed from a temporary solution to a permanent fixture in the modern workplace. As we move through 2024, several key trends are shaping how organizations approach distributed teams.

## Key Trends Shaping Remote Work

### 1. Hybrid Work Models
Companies are increasingly adopting hybrid work models that combine the flexibility of remote work with the collaboration benefits of in-person interaction. This approach allows employees to choose when and where they work while maintaining team cohesion.

### 2. Advanced Collaboration Tools
The evolution of collaboration technology has made remote work more seamless than ever. From virtual reality meeting spaces to AI-powered project management tools, technology is bridging the gap between remote and in-person collaboration.

### 3. Focus on Employee Wellbeing
Organizations are placing greater emphasis on supporting remote employees' mental health and work-life balance. This includes flexible schedules, wellness programs, and regular check-ins to ensure team members feel connected and supported.

## Best Practices for Remote Teams

- Establish clear communication protocols
- Invest in reliable technology infrastructure
- Create opportunities for informal team interaction
- Provide regular feedback and recognition
- Support professional development opportunities

The future of remote work is bright, with companies finding innovative ways to maintain productivity while supporting their distributed teams.`,
    author: {
      name: 'Sarah Johnson',
      avatar: '/img/hassan_productDesigner.avif',
      role: 'HR Director'
    },
    publishedAt: '2024-01-15',
    readTime: 8,
    tags: ['Remote Work', 'HR', 'Future of Work', 'Productivity'],
    category: 'HR & Culture',
    featuredImage: '/img/hassan_productDesigner.avif',
    slug: 'future-remote-work-trends-2024',
    isPublished: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Building inclusive teams: A guide for modern employers',
    excerpt: 'Learn how to create more inclusive workplaces that attract and retain diverse talent. Practical strategies for building better teams.',
    content: `# Building Inclusive Teams: A Guide for Modern Employers

Creating an inclusive workplace isn't just the right thing to do—it's essential for business success. Diverse teams outperform homogeneous ones by 35%, according to recent studies.

## The Business Case for Inclusion

Inclusive teams bring diverse perspectives that lead to:
- Better problem-solving
- Increased innovation
- Higher employee engagement
- Improved customer satisfaction
- Enhanced company reputation

## Practical Steps to Build Inclusive Teams

### 1. Start with Leadership Commitment
Inclusion must be championed from the top. Leaders should model inclusive behaviors and hold themselves accountable for creating an environment where everyone can thrive.

### 2. Implement Bias-Free Hiring Practices
- Use structured interviews
- Implement blind resume screening
- Create diverse interview panels
- Focus on skills and potential over credentials

### 3. Foster Psychological Safety
Create an environment where employees feel safe to:
- Share their ideas
- Ask questions
- Admit mistakes
- Challenge the status quo

### 4. Provide Equal Growth Opportunities
Ensure all employees have access to:
- Mentorship programs
- Professional development
- Leadership training
- Career advancement opportunities

Building inclusive teams is an ongoing process that requires commitment, education, and continuous improvement.`,
    author: {
      name: 'Michael Chen',
      role: 'Diversity & Inclusion Lead'
    },
    publishedAt: '2024-01-12',
    readTime: 6,
    tags: ['Diversity', 'Inclusion', 'Team Building', 'Culture'],
    category: 'Diversity & Inclusion',
    slug: 'building-inclusive-teams-guide',
    isPublished: true,
    isFeatured: true
  },
  {
    id: '3',
    title: 'Tech skills in demand: What employers are looking for in 2024',
    excerpt: 'Discover the most sought-after technical skills and how to position yourself for success in the competitive tech job market.',
    content: `# Tech Skills in Demand: What Employers Are Looking for in 2024

The technology landscape is constantly evolving, and staying current with in-demand skills is crucial for career success. Here are the top skills employers are seeking in 2024.

## Top Technical Skills

### 1. Artificial Intelligence and Machine Learning
AI/ML expertise continues to be highly sought after, with applications across industries:
- Natural Language Processing
- Computer Vision
- Predictive Analytics
- Deep Learning Frameworks

### 2. Cloud Computing
Cloud skills remain essential as more companies migrate to cloud infrastructure:
- AWS, Azure, Google Cloud Platform
- Containerization (Docker, Kubernetes)
- Serverless Architecture
- Cloud Security

### 3. Cybersecurity
With increasing cyber threats, security skills are in high demand:
- Threat Detection and Response
- Identity and Access Management
- Security Architecture
- Compliance and Risk Management

### 4. Data Science and Analytics
Data-driven decision making drives demand for:
- Python and R Programming
- SQL and Database Management
- Statistical Analysis
- Data Visualization

## Soft Skills That Matter

Technical skills are important, but employers also value:
- Problem-solving abilities
- Communication skills
- Adaptability
- Team collaboration
- Continuous learning mindset

## How to Stay Competitive

1. **Continuous Learning**: Invest in ongoing education and certification
2. **Hands-on Practice**: Build projects and contribute to open source
3. **Networking**: Connect with professionals in your field
4. **Stay Updated**: Follow industry trends and emerging technologies

The key to success in tech is maintaining a growth mindset and staying adaptable to the ever-changing landscape.`,
    author: {
      name: 'Alex Rodriguez',
      role: 'Tech Recruiter'
    },
    publishedAt: '2024-01-10',
    readTime: 7,
    tags: ['Technology', 'Skills', 'Career Development', 'Programming'],
    category: 'Career Development',
    slug: 'tech-skills-demand-2024',
    isPublished: true
  },
  {
    id: '4',
    title: 'The art of networking: Building meaningful professional relationships',
    excerpt: 'Master the art of professional networking with these proven strategies for building lasting relationships in your industry.',
    content: `# The Art of Networking: Building Meaningful Professional Relationships

Networking isn't just about collecting business cards—it's about building genuine relationships that can advance your career and enrich your professional life.

## Why Networking Matters

Professional networking provides:
- Career opportunities
- Industry insights
- Mentorship possibilities
- Knowledge sharing
- Long-term relationship building

## Effective Networking Strategies

### 1. Focus on Giving, Not Just Taking
The best networkers focus on how they can help others:
- Share valuable resources
- Make introductions
- Offer your expertise
- Support others' goals

### 2. Attend Industry Events
- Conferences and seminars
- Professional association meetings
- Local meetups
- Online webinars and virtual events

### 3. Leverage Social Media
- LinkedIn for professional connections
- Twitter for industry discussions
- Industry-specific platforms
- Online communities and forums

### 4. Follow Up Consistently
- Send thank-you notes after meetings
- Share relevant articles or resources
- Check in periodically
- Maintain regular communication

## Building Your Personal Brand

Your personal brand is how others perceive you professionally:
- Define your unique value proposition
- Share your expertise through content
- Maintain a consistent online presence
- Be authentic and genuine

## Networking Best Practices

- Listen more than you talk
- Ask thoughtful questions
- Remember details about people
- Be patient—relationships take time
- Stay in touch regularly

Remember, networking is about building relationships, not just making contacts. Focus on creating genuine connections that benefit everyone involved.`,
    author: {
      name: 'Emma Thompson',
      role: 'Career Coach'
    },
    publishedAt: '2024-01-08',
    readTime: 5,
    tags: ['Networking', 'Career Growth', 'Professional Development'],
    category: 'Career Development',
    slug: 'art-networking-professional-relationships',
    isPublished: true
  },
  {
    id: '5',
    title: 'Startup hiring: How to attract top talent on a budget',
    excerpt: 'Learn effective strategies for startups to compete with larger companies when hiring the best talent without breaking the bank.',
    content: `# Startup Hiring: How to Attract Top Talent on a Budget

Startups face unique challenges when competing for talent against well-funded companies. However, with the right strategies, you can attract exceptional people even with limited resources.

## The Startup Advantage

While startups can't always compete on salary, they offer unique benefits:
- Equity ownership opportunities
- Rapid career growth
- Direct impact on company success
- Flexible work environments
- Learning opportunities

## Cost-Effective Hiring Strategies

### 1. Leverage Your Network
- Ask for referrals from current employees
- Reach out to your professional network
- Use alumni networks from universities
- Tap into industry connections

### 2. Build a Strong Employer Brand
- Share your company story and mission
- Highlight your unique culture
- Showcase employee success stories
- Create engaging content about your work

### 3. Offer Non-Monetary Benefits
- Flexible work arrangements
- Professional development opportunities
- Equity or stock options
- Unique perks and experiences
- Autonomy and responsibility

### 4. Use Creative Recruitment Methods
- Host meetups and events
- Participate in hackathons
- Create internship programs
- Partner with coding bootcamps
- Use social media creatively

## Interview Process Optimization

Make your interview process efficient and candidate-friendly:
- Streamline the process
- Provide clear timelines
- Give candidates a chance to showcase skills
- Include team members in interviews
- Offer constructive feedback

## Retention Strategies

Once you've hired great people, focus on retention:
- Provide growth opportunities
- Offer regular feedback and recognition
- Create a positive work environment
- Invest in team building
- Listen to employee feedback

Remember, the best talent often chooses opportunities over just compensation. Focus on creating an environment where people can do their best work and grow their careers.`,
    author: {
      name: 'David Park',
      role: 'Startup Founder'
    },
    publishedAt: '2024-01-05',
    readTime: 9,
    tags: ['Startups', 'Hiring', 'Budget', 'Talent Acquisition'],
    category: 'Startup Advice',
    slug: 'startup-hiring-attract-talent-budget',
    isPublished: true
  },
  {
    id: '6',
    title: 'Mental health in the workplace: Creating supportive environments',
    excerpt: 'Understand the importance of mental health support in the workplace and how to create environments that promote employee wellbeing.',
    content: `# Mental Health in the Workplace: Creating Supportive Environments

Mental health is a critical component of overall employee wellbeing and organizational success. Creating supportive workplace environments benefits both employees and employers.

## The Impact of Mental Health on Work

Poor mental health affects:
- Employee productivity
- Job satisfaction
- Retention rates
- Team dynamics
- Company culture

## Signs of Mental Health Challenges

Managers should be aware of:
- Changes in work performance
- Increased absenteeism
- Social withdrawal
- Mood changes
- Difficulty concentrating

## Creating a Supportive Environment

### 1. Promote Open Communication
- Create safe spaces for discussion
- Train managers to recognize signs
- Encourage employees to speak up
- Provide multiple channels for support

### 2. Implement Mental Health Policies
- Develop clear policies and procedures
- Provide mental health training
- Offer flexible work arrangements
- Create accommodation processes

### 3. Offer Support Resources
- Employee Assistance Programs (EAPs)
- Mental health benefits
- Access to counseling services
- Wellness programs
- Stress management resources

### 4. Reduce Stigma
- Normalize mental health discussions
- Share leadership experiences
- Provide education and training
- Celebrate mental health awareness

## Manager Training

Equip managers with skills to:
- Recognize mental health signs
- Have supportive conversations
- Provide appropriate accommodations
- Connect employees with resources
- Maintain confidentiality

## Building Resilience

Help employees build resilience through:
- Stress management training
- Mindfulness programs
- Work-life balance initiatives
- Social connection opportunities
- Recognition and appreciation

Creating a mentally healthy workplace is an ongoing process that requires commitment from leadership and participation from all employees.`,
    author: {
      name: 'Dr. Lisa Wang',
      role: 'Workplace Psychologist'
    },
    publishedAt: '2024-01-03',
    readTime: 6,
    tags: ['Mental Health', 'Wellbeing', 'Workplace Culture', 'Support'],
    category: 'Wellness',
    slug: 'mental-health-workplace-supportive-environments',
    isPublished: true
  }
];

// Mock data for blog categories
const mockCategories: BlogCategory[] = [
  { id: '1', name: 'HR & Culture', slug: 'hr-culture', description: 'Human resources and workplace culture', postCount: 12 },
  { id: '2', name: 'Career Development', slug: 'career-development', description: 'Professional growth and career advice', postCount: 18 },
  { id: '3', name: 'Diversity & Inclusion', slug: 'diversity-inclusion', description: 'Building inclusive workplaces', postCount: 8 },
  { id: '4', name: 'Startup Advice', slug: 'startup-advice', description: 'Tips for startup founders and employees', postCount: 15 },
  { id: '5', name: 'Wellness', slug: 'wellness', description: 'Workplace wellness and mental health', postCount: 10 },
  { id: '6', name: 'Technology', slug: 'technology', description: 'Tech trends and skills', postCount: 22 }
];

// Mock API functions
export const blogService = {
  // Get all blog posts
  async getPosts(filters?: {
    category?: string;
    tags?: string[];
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
    limit?: number;
    offset?: number;
  }): Promise<{ posts: BlogPost[]; total: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredPosts = [...mockBlogPosts];

    // Apply filters
    if (filters?.category) {
      filteredPosts = filteredPosts.filter(post => post.category === filters.category);
    }

    if (filters?.tags && filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        filters.tags!.some(tag => post.tags.includes(tag))
      );
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          break;
        case 'oldest':
          filteredPosts.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
          break;
        case 'popular':
          filteredPosts.sort((a, b) => b.readTime - a.readTime);
          break;
        case 'trending':
          // Random for demo purposes
          filteredPosts.sort(() => Math.random() - 0.5);
          break;
      }
    }

    // Apply pagination
    const total = filteredPosts.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || filteredPosts.length;
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);

    return {
      posts: paginatedPosts,
      total
    };
  },

  // Get a single blog post by slug
  async getPost(slug: string): Promise<BlogPost | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const post = mockBlogPosts.find(p => p.slug === slug);
    return post || null;
  },

  // Get featured posts
  async getFeaturedPosts(limit: number = 2): Promise<BlogPost[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));

    return mockBlogPosts
      .filter(post => post.isFeatured)
      .slice(0, limit);
  },

  // Get all categories
  async getCategories(): Promise<BlogCategory[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return mockCategories;
  },

  // Get related posts
  async getRelatedPosts(postId: string, limit: number = 3): Promise<BlogPost[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));

    const currentPost = mockBlogPosts.find(p => p.id === postId);
    if (!currentPost) return [];

    return mockBlogPosts
      .filter(post => 
        post.id !== postId && 
        (post.category === currentPost.category || 
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .slice(0, limit);
  },

  // Search posts
  async searchPosts(query: string, limit: number = 10): Promise<BlogPost[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const searchTerm = query.toLowerCase();
    return mockBlogPosts
      .filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        post.category.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit);
  }
};

// Enhanced cache system for better performance
interface CacheEntry {
  data: BlogPost[];
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const STATIC_TTL = 60 * 60 * 1000; // 1 hour for static content

// Simple cache to store NewsAPI data (legacy)
let newsAPICache: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Slug-based cache for individual posts
let slugCache: Map<string, BlogPost> = new Map();

// Cache management functions
function getCacheKey(filters?: any): string {
  return JSON.stringify(filters || {});
}

function getFromCache(key: string): BlogPost[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

function setCache(key: string, data: BlogPost[], ttl: number = DEFAULT_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
}

function clearCache(): void {
  cache.clear();
  newsAPICache = null;
  cacheTimestamp = 0;
  slugCache.clear();
}

// Export cache management functions for manual control
export const cacheManager = {
  clearCache,
  getCacheStats: () => ({
    cacheSize: cache.size,
    hasNewsAPICache: !!newsAPICache,
    newsAPICacheAge: newsAPICache ? Date.now() - cacheTimestamp : 0,
    slugCacheSize: slugCache.size,
    cacheEntries: Array.from(cache.keys())
  }),
  forceRefresh: () => {
    clearCache();
    console.log('🔄 Cache cleared - next request will fetch fresh data');
  }
};

// Helper function to process posts with filters
function processPosts(allPosts: BlogPost[], filters?: any): { posts: BlogPost[]; total: number } {
  // Apply filters
  let filteredPosts = allPosts;
  
  if (filters?.category) {
    filteredPosts = filteredPosts.filter(post => post.category === filters.category);
    console.log('🔍 Filtered by category:', filters.category, '->', filteredPosts.length, 'posts');
  }

  if (filters?.tags && filters.tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.tags!.some(tag => post.tags.includes(tag))
    );
    console.log('🏷️ Filtered by tags:', filters.tags, '->', filteredPosts.length, 'posts');
  }

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    console.log('🔍 Filtered by search:', searchTerm, '->', filteredPosts.length, 'posts');
  }

  // Apply sorting
  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'oldest':
        filteredPosts.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'popular':
        filteredPosts.sort((a, b) => b.readTime - a.readTime);
        break;
      case 'trending':
        filteredPosts.sort(() => Math.random() - 0.5);
        break;
    }
    console.log('📊 Sorted by:', filters.sortBy);
  }

  // Apply pagination
  const total = filteredPosts.length;
  const offset = filters?.offset || 0;
  const limit = filters?.limit || filteredPosts.length;
  const paginatedPosts = filteredPosts.slice(offset, offset + limit);

  console.log('🎯 Pagination debug:', {
    totalPosts: total,
    paginatedPosts: paginatedPosts.length,
    offset: offset,
    limit: limit,
    sliceRange: `${offset} to ${offset + limit}`,
    firstPostTitle: paginatedPosts[0]?.title,
    lastPostTitle: paginatedPosts[paginatedPosts.length - 1]?.title,
    allPostTitles: filteredPosts.map(p => p.title.substring(0, 30))
  });
  
  return {
    posts: paginatedPosts,
    total
  };
}

// Unified blog service that can handle both mock data and NewsAPI
export const unifiedBlogService = {
  // Get all blog posts (combines mock data and NewsAPI data)
  async getPosts(filters?: {
    category?: string;
    tags?: string[];
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
    limit?: number;
    offset?: number;
  }): Promise<{ posts: BlogPost[]; total: number }> {
    const cacheKey = getCacheKey(filters);
    
    // Temporarily disable cache to debug pagination issues
    // const cachedData = getFromCache(cacheKey);
    // if (cachedData) {
    //   console.log('📦 Using enhanced cache');
    //   return processPosts(cachedData, filters);
    // }

    try {
      // Temporarily disable NewsAPI cache to debug pagination issues
      // if (newsAPICache && (now - cacheTimestamp) < CACHE_DURATION) {
      //   console.log('📦 Using cached NewsAPI data');
      //   const allPosts = [...newsAPICache, ...mockBlogPosts.slice(0, 2)];
      //   
      //   // Cache the processed result
      //   setCache(cacheKey, allPosts, STATIC_TTL);
      //   
      //   return processPosts(allPosts, filters);
      // }

      // Try to get NewsAPI data first
      console.log('🔄 Attempting to fetch NewsAPI data...');
      
      // Determine the base URL for API calls
      const baseUrl = typeof window !== 'undefined' 
        ? '' // Client-side: use relative URL
        : process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` // Vercel deployment
          : 'http://localhost:3000'; // Local development
      
      const apiUrl = `${baseUrl}/api/news/everything?pageSize=20&q=technology`;
      console.log('📡 Fetching from:', apiUrl);
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const newsResponse = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      console.log('📡 NewsAPI response status:', newsResponse.status);
      
      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        console.log('📰 NewsAPI data received:', {
          status: newsData.status,
          totalResults: newsData.totalResults,
          articlesCount: newsData.articles?.length || 0,
          firstArticle: newsData.articles?.[0]?.title || 'No articles'
        });
        
        if (newsData.articles && newsData.articles.length > 0) {
          console.log('🔄 Converting NewsAPI articles to blog posts...');
          // Convert NewsAPI articles to BlogPost format
          const newsPosts: BlogPost[] = newsData.articles.map((article: any, index: number) => ({
            id: `news-${index}`,
            title: article.title.substring(0, 100),
            excerpt: article.description ? article.description.substring(0, 200) : article.title.substring(0, 200),
            content: article.content ? article.content.substring(0, 2000) + '...' : article.description || article.title,
            author: {
              name: (article.author || article.source.name || 'News Reporter').split(',')[0].trim(),
              role: article.author ? 'Journalist' : 'News Source'
            },
            publishedAt: article.publishedAt,
            readTime: Math.max(1, Math.ceil((article.content || article.description || '').split(' ').length / 200)),
            tags: ['News', 'Current Events'],
            category: 'News',
            featuredImage: article.urlToImage || undefined,
            slug: createUniqueSlug(article.title, article.url, article.publishedAt),
            isPublished: true,
            isFeatured: index < 2
          }));

          // Remove duplicates from NewsAPI data based on title
          const uniqueNewsPosts = newsPosts.filter((post, index, self) => 
            index === self.findIndex(p => p.title === post.title)
          );

          console.log('✅ NewsAPI posts created:', newsPosts.length, 'posts');
          console.log('🔄 After deduplication:', uniqueNewsPosts.length, 'unique posts');
          console.log('📝 First NewsAPI post:', {
            title: uniqueNewsPosts[0]?.title,
            author: uniqueNewsPosts[0]?.author.name,
            category: uniqueNewsPosts[0]?.category,
            slug: uniqueNewsPosts[0]?.slug
          });
          
          // Cache the NewsAPI data
          newsAPICache = uniqueNewsPosts;
          cacheTimestamp = Date.now();
          console.log('💾 NewsAPI data cached');
          
          // Populate slug cache for efficient individual post lookups
          uniqueNewsPosts.forEach(post => {
            slugCache.set(post.slug, post);
          });
          console.log('💾 Slug cache populated with', uniqueNewsPosts.length, 'posts');
          
          // Use NewsAPI data as primary, don't mix with mock data to avoid duplicates
          const allPosts = uniqueNewsPosts;
          console.log('📊 Total posts (NewsAPI only):', allPosts.length);
          console.log('🔍 First 3 posts:', allPosts.slice(0, 3).map(p => ({ title: p.title, category: p.category, id: p.id })));
          
          // Cache the processed result
          setCache(cacheKey, allPosts, STATIC_TTL);
          
          return processPosts(allPosts, filters);
        } else {
          console.log('❌ No articles found in NewsAPI response');
        }
      } else {
        console.log('❌ NewsAPI response not OK:', newsResponse.status, newsResponse.statusText);
        const errorText = await newsResponse.text();
        console.log('❌ Error details:', errorText);
      }
    } catch (error) {
      console.log('❌ NewsAPI not available, using mock data only:', error);
    }

    // Fallback to mock data only
    console.log('⚠️ Using mock data only - NewsAPI unavailable');
    const result = await blogService.getPosts(filters);
    
    // Populate slug cache with mock data
    result.posts.forEach(post => {
      slugCache.set(post.slug, post);
    });
    console.log('💾 Slug cache populated with', result.posts.length, 'mock posts');
    
    // Cache the mock data result with shorter TTL since it's fallback
    setCache(cacheKey, result.posts, DEFAULT_TTL);
    
    return result;
  },

  // Get a single blog post by slug
  async getPost(slug: string): Promise<BlogPost | null> {
    console.log('🔍 Looking for post with slug:', slug);
    
    // First check the efficient slug cache
    if (slugCache.has(slug)) {
      const cachedPost = slugCache.get(slug)!;
      console.log('✅ Found post in slug cache:', cachedPost.title);
      return cachedPost;
    }
    
    // If not in slug cache, check mock data as fallback
    console.log('🔍 Checking mock data for slug:', slug);
    const mockPost = await blogService.getPost(slug);
    if (mockPost) {
      // Add to slug cache for future lookups
      slugCache.set(slug, mockPost);
      console.log('✅ Found post in mock data:', mockPost.title);
      return mockPost;
    }
    
    // If still not found, try to populate cache by fetching posts
    console.log('🔄 Post not in cache, attempting to populate cache...');
    try {
      // This will populate the slug cache if successful
      await this.getPosts({ limit: 50 });
      
      // Check slug cache again after population
      if (slugCache.has(slug)) {
        const cachedPost = slugCache.get(slug)!;
        console.log('✅ Found post after cache population:', cachedPost.title);
        return cachedPost;
      }
    } catch (error) {
      console.log('❌ Error populating cache:', error);
    }
    
    console.log('❌ Post not found:', slug);
    return null;
  },

  // Get featured posts
  async getFeaturedPosts(limit: number = 2): Promise<BlogPost[]> {
    return blogService.getFeaturedPosts(limit);
  },

  // Get all categories
  async getCategories(): Promise<BlogCategory[]> {
    return blogService.getCategories();
  },

  // Get related posts
  async getRelatedPosts(postId: string, limit: number = 3): Promise<BlogPost[]> {
    return blogService.getRelatedPosts(postId, limit);
  },

  // Search posts
  async searchPosts(query: string, limit: number = 10): Promise<BlogPost[]> {
    return blogService.searchPosts(query, limit);
  }
};

// Export mock data for direct use if needed
export { mockBlogPosts, mockCategories };
