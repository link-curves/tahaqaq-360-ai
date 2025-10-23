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
# Install runtime dependencies + build tools for native modules (argon2 needs these!)
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    python3 \
    make \
    g++ \
    linux-headers

WORKDIR /app

# Copy only what we need to install dependencies
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/src/prisma ./src/prisma

# Use NPM instead of pnpm for better native module support in Alpine
# Install dependencies
RUN npm install --omit=dev

# Install dev dependencies needed for migrations (prisma, @prisma/client)
RUN npm install -D prisma @prisma/client

# Force rebuild of argon2 with npm (works better than pnpm on Alpine)
RUN npm rebuild argon2

# Verify argon2 binary was created
RUN echo "=== Checking argon2 binary ===" && \
    find node_modules -name "argon2.node" -type f -ls && \
    echo "=== Argon2 found! ===" || echo "=== WARNING: argon2.node NOT FOUND! ==="

# Generate Prisma Client with Alpine binaries
RUN npx prisma generate --schema=src/prisma/schema.prisma

# NOW copy the built application
COPY --from=builder /app/apps/api/dist ./dist

# Copy entrypoint script
COPY apps/api/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Set environment
ENV NODE_ENV=production
# Default port (Render will override this with their own PORT env var)
ENV PORT=10000
EXPOSE 10000

# Health check (uses PORT env var which Render will provide)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 10000) + '/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
