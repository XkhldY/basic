# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Build arguments
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=$NODE_ENV

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

# Build the application only in production mode
RUN if [ "$NODE_ENV" = "production" ]; then \
    timeout 600 npm run build || npm run build; \
    else \
    echo "Skipping build in development mode"; \
    fi

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

# Set environment from build arg (defaults to production for safety)
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files and install dependencies based on environment
COPY package*.json ./
RUN if [ "$NODE_ENV" = "development" ]; then \
    npm ci --cache /tmp/.npm; \
    else \
    npm ci --only=production --cache /tmp/.npm; \
    fi && npm cache clean --force

# Copy public directory and handle .next based on environment
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy built application from builder stage only in production mode
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; then \
    echo "Copying production build artifacts"; \
    else \
    echo "Development mode - creating empty .next directory"; \
    mkdir -p ./.next; \
    fi

# Conditional copy of .next directory for production
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

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
# Use development mode if NODE_ENV is development, otherwise production
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else npm start; fi"]