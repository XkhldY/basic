import { NextRequest, NextResponse } from 'next/server';
import { unifiedBlogService } from '@/services/blog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;

    console.log('📡 API: Fetching latest blog posts', { limit, offset, category, tags });

    const response = await unifiedBlogService.getPosts({
      limit,
      offset,
      category,
      tags,
      sortBy: 'newest'
    });

    console.log('✅ API: Successfully fetched latest posts', response.posts.length);

    const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

    return NextResponse.json({
      success: true,
      data: {
        posts: response.posts,
        total: response.total,
        hasMore: offset + limit < response.total,
        pagination: {
          limit,
          offset,
          nextOffset: offset + limit < response.total ? offset + limit : null
        }
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('❌ API: Error fetching latest posts:', error);
    
    const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch latest blog posts',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
