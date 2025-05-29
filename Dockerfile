# Multi-stage build for minimal production image
FROM node:18-alpine AS builder

# Install security updates and build dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache git && \
    rm -rf /var/cache/apk/*

# Create non-root user for build process
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Change ownership of the working directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Copy package files with correct ownership
COPY --chown=nextjs:nodejs package*.json ./

# Install dependencies with npm ci for faster, reliable builds
RUN npm ci --only=production=false --no-audit --no-fund

# Copy source code with correct ownership
COPY --chown=nextjs:nodejs . .

# Build the application
RUN npm run build && \
    npm prune --production

# Production stage - use Node.js for serving
FROM node:18-alpine AS production

# Add metadata labels
LABEL maintainer="Mayur Chavhan <mayur@example.com>" \
    description="Portfolio website for Mayur Chavhan - DevOps Engineer & Cloud Architect" \
    version="1.0.0" \
    org.opencontainers.image.title="Mayur Chavhan Portfolio" \
    org.opencontainers.image.description="DevOps Engineer & Cloud Architect Portfolio" \
    org.opencontainers.image.vendor="Mayur Chavhan" \
    org.opencontainers.image.licenses="MIT"

# Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache \
    dumb-init \
    wget \
    curl && \
    rm -rf /var/cache/apk/*

# Create non-root user with specific UID/GID
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Change ownership of the working directory
RUN chown -R nextjs:nodejs /app

# Copy built assets, server, and production dependencies from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --chown=nextjs:nodejs server.js ./

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 8080

# Add health check with improved configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
