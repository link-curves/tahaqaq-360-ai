# ===========================================
# Stage 1: Base - Install dependencies
# ===========================================
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl openssl-dev
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY turbo.json ./

# ===========================================
# Stage 2: Dependencies - Install all deps
# ===========================================
FROM base AS deps
WORKDIR /app

# Copy package files for all workspaces
COPY apps/api/package.json ./apps/api/
COPY packages ./packages

# Install dependencies (use --no-frozen-lockfile to allow updates)
RUN pnpm install --no-frozen-lockfile

# ===========================================
# Stage 3: Builder - Build the application
# ===========================================
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

# Copy source code
COPY apps/api ./apps/api
COPY packages ./packages
COPY turbo.json ./
COPY pnpm-workspace.yaml ./

# Generate Prisma client
WORKDIR /app/apps/api
RUN pnpm prisma generate --schema=src/prisma/schema.prisma

# Build the application
WORKDIR /app
RUN pnpm turbo build --filter=api

# ===========================================
# Stage 4: Production - Run the application
# ===========================================
FROM node:22-alpine AS production
RUN apk add --no-cache libc6-compat openssl openssl-dev
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/src/prisma ./src/prisma

# Copy entrypoint script
COPY apps/api/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Regenerate Prisma client with correct binaries for Alpine
RUN pnpm prisma generate --schema=src/prisma/schema.prisma

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
