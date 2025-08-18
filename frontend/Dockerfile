# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Build argument for API URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Set environment for building
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true

# Copy package files
COPY package*.json ./

# Install all dependencies including dev for building
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 3 && \
    npm ci --include=dev --cache /tmp/.npm

# Copy source code
COPY . .

# Build the application with timeout (API URL is now embedded)
RUN timeout 600 npm run build || npm run build

# Production stage
FROM node:18-slim AS runner

WORKDIR /app

# Install curl for health checks
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user first (before copying files)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production --cache /tmp/.npm && npm cache clean --force

# Copy built application from builder stage with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy static files for standalone mode if they exist
RUN if [ -d ".next/standalone" ]; then \
    cp -r .next/static .next/standalone/.next/ && \
    cp -r public .next/standalone/; \
fi

USER nextjs

# Expose port
EXPOSE 3000

# Add health check endpoint for Docker health checks
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start server based on environment
# Use npm start for all modes to ensure proper static asset serving
CMD ["npm", "start"]