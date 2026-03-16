const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone',
  images: {
    unoptimized: false,
  },

  // If the app is served under a subpath (e.g. example.com/app/), set NEXT_PUBLIC_BASE_PATH=/app
  ...(process.env.NEXT_PUBLIC_BASE_PATH && {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  }),
  // If assets are served from a different origin (e.g. CDN or proxy), set ASSET_PREFIX to full URL
  ...(process.env.ASSET_PREFIX && {
    assetPrefix: process.env.ASSET_PREFIX,
  }),

  // Monorepo: use frontend dir as trace root so _next static files resolve correctly
  outputFileTracingRoot: path.join(__dirname),

  // Fix: framer-motion uses "export *" which Next.js 15 disallows in client boundary.
  transpilePackages: ['framer-motion'],

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;