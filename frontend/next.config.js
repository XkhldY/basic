/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint checks during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checks during production builds (for now)
    ignoreBuildErrors: true,
  },
  // Disable standalone output for now to fix static asset serving
  // ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  // Server external packages moved to top level in Next.js 15
  serverExternalPackages: [],
  
  // Configure webpack for path aliases (since TypeScript checks are disabled)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    }
    return config
  }
};

module.exports = nextConfig;