/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment-based configuration
  eslint: {
    // Only ignore ESLint during builds in development for faster iteration
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  
  typescript: {
    // Only ignore TypeScript errors in development for faster iteration
    // In production, we want strict type checking
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  // Enable standalone output for better performance in production
  ...(process.env.NODE_ENV === 'production' && { 
    output: 'standalone' 
  }),

  // Optimize for production builds
  ...(process.env.NODE_ENV === 'production' && {
    compress: true,
    generateEtags: true,
    poweredByHeader: false, // Security: remove X-Powered-By header
  }),

  // Environment-specific optimizations
  experimental: {
    // Enable optimizations that work well in both environments
    optimizePackageImports: ['lucide-react'],
  },

  // Turbopack configuration (stable in Next.js 15)
  ...(process.env.NODE_ENV === 'development' && {
    turbopack: {
      rules: {},
    }
  }),

  // Configure webpack for path aliases and optimizations
  webpack: (config, { dev, isServer }) => {
    // Import path module properly
    const path = require('path');
    
    // Path aliases for cleaner imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    }

    // Production optimizations
    if (!dev && !isServer) {
      // Optimize bundle splitting for better caching
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }

    return config
  },

  // Security headers for production
  ...(process.env.NODE_ENV === 'production' && {
    headers: async () => [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }),

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

module.exports = nextConfig;