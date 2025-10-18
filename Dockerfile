# ---------------------------------
# Base builder image
# ---------------------------------
FROM node:22-slim AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Install root deps
RUN pnpm install --frozen-lockfile

# Copy apps selectively
COPY apps/api ./apps/api
COPY apps/web ./apps/web
COPY apps/api/src/prisma ./prisma

# ⚡ FIX: Generate Prisma client BEFORE build
RUN cd apps/api && pnpm db:generate

# Build each app
RUN cd apps/api && pnpm run build
RUN cd apps/web && pnpm run build

# ---------------------------------
# Production image for API
# ---------------------------------
FROM node:22-slim AS api
WORKDIR /app

# Install OpenSSL and other system dependencies
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

# Copy workspace files needed for pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/

# Copy only built files and runtime deps
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY apps/api/src/prisma ./prisma

# Copy generated Prisma client from builder instead of regenerating
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Install production dependencies only (without Prisma postinstall issues)
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

EXPOSE 5000
CMD ["node", "apps/api/dist/main.js"]
