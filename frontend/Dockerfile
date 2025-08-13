FROM node:18-slim

WORKDIR /app

# Install curl for health checks and other required packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set environment for production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install all dependencies including dev for building
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 3 && \
    npm ci --cache /tmp/.npm

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Add health check endpoint for Docker health checks
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the production server
CMD ["npm", "start"]