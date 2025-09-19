export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readTime: number; // in minutes
  tags: string[];
  category: string;
  featuredImage?: string;
  slug: string;
  isPublished: boolean;
  isFeatured?: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface BlogFilters {
  category?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
}
