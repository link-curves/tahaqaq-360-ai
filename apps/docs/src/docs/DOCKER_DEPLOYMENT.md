# 🐳 Docker Deployment Guide

Complete guide for deploying Tahaqaq-360 using Docker and Docker Compose.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Production Deployment](#production-deployment)
- [Development Setup](#development-setup)
- [Docker Hub Deployment](#docker-hub-deployment)
- [Free Hosting Options](#free-hosting-options)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites

- Docker Engine 20.10+ and Docker Compose 2.0+
- Node.js 22+ (for local development)
- pnpm 8+ (for local development)
- Docker Hub account (for image hosting)

### Install Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# macOS (using Homebrew)
brew install docker docker-compose

# Windows
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
```

---

## ⚡ Quick Start

### 1. Clone and Configure

```bash
# Clone repository
git clone https://github.com/yourusername/tahaqaq-360.git
cd tahaqaq-360

# Copy environment file
cp .env.prod.example .env.prod

# Edit .env.prod with your configurations
nano .env.prod
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:5000
# API Docs: http://localhost:5000/api/docs
```

---

## 🚀 Production Deployment

### Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│  NestJS API │────▶│ PostgreSQL  │
│  (Web App)  │     │   (Port 5000)│     │  (Port 5432)│
│  (Port 80)  │     └─────────────┘     └─────────────┘
└─────────────┘
```

### Step 1: Configure Environment

```bash
# Copy and edit production environment
cp .env.prod.example .env.prod

# Important variables to set:
# - POSTGRES_PASSWORD (use strong password)
# - JWT_ACCESS_SECRET (generate: openssl rand -base64 64)
# - JWT_REFRESH_SECRET (generate: openssl rand -base64 64)
# - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
# - SUPABASE_URL & SUPABASE_ANON_KEY
# - CORS_ORIGIN (your domain)
# - VITE_API_URL (your API URL)
```

### Step 2: Build Images

```bash
# Build both images
docker-compose -f docker-compose.prod.yml build

# Or build individually
docker build -f apps/api/Dockerfile.prod -t tahaqaq-api:latest .
docker build -f apps/web/Dockerfile.prod -t tahaqaq-web:latest .
```

### Step 3: Start Services

```bash
# Start all services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f web
```

### Step 4: Database Migrations

Migrations run automatically on API startup. To run manually:

```bash
docker exec -it tahaqaq-api sh -c "cd apps/api && npx prisma migrate deploy --schema=src/prisma/schema.prisma"
```

### Step 5: Seed Database (Optional)

```bash
# Seed with Arabic data
docker exec -it tahaqaq-api sh -c "cd apps/api && pnpm db:seed:ar"

# Or English data
docker exec -it tahaqaq-api sh -c "cd apps/api && pnpm db:seed"
```

---

## 🔧 Development Setup

For local development with hot-reload:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Access services
# Frontend: http://localhost:5173 (Vite dev server)
# API: http://localhost:3000 (NestJS with hot-reload)
# Database: localhost:5432

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

---

## 📦 Docker Hub Deployment

### Step 1: Configure Docker Hub

```bash
# Set your Docker Hub username
export DOCKER_USERNAME=yourusername

# Login to Docker Hub
docker login
```

### Step 2: Build and Push Images

```bash
# Make script executable
chmod +x scripts/build-and-push.sh

# Build and push with version tag
./scripts/build-and-push.sh v1.0.0

# Or push as latest
./scripts/build-and-push.sh latest
```

### Step 3: Pull and Deploy on Server

```bash
# On your production server
export DOCKER_USERNAME=yourusername
export VERSION=v1.0.0

# Make deploy script executable
chmod +x scripts/deploy.sh

# Deploy
./scripts/deploy.sh
```

---

## 🆓 Free Hosting Options

### Option 1: Railway.app (Recommended)

**Pros:** Free tier, PostgreSQL included, easy setup
**Limits:** $5 credit/month (enough for small apps)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Option 2: Render.com

**Pros:** Free tier, automatic deployments
**Limits:** Spins down after inactivity, 750 hours/month

1. Connect GitHub repo
2. Create Web Service (Dockerfile: `apps/web/Dockerfile.prod`)
3. Create Web Service (Dockerfile: `apps/api/Dockerfile.prod`)
4. Create PostgreSQL database
5. Set environment variables

### Option 3: Fly.io

**Pros:** Good free tier, multiple regions
**Limits:** 3 VMs, 160GB transfer/month

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy
flyctl launch
```

### Option 4: Oracle Cloud (Always Free)

**Pros:** Always free, 4 ARM CPUs, 24GB RAM
**Limits:** Requires credit card, ARM architecture

1. Create VM instance
2. Install Docker
3. Clone repository
4. Run deployment script

### Option 5: DigitalOcean App Platform

**Pros:** $200 credit for 60 days
**Limits:** Paid after trial

---

## 🏗️ Image Optimization

### Current Image Sizes

```
tahaqaq-api:latest   ~400MB (Alpine-based)
tahaqaq-web:latest   ~50MB  (Nginx Alpine)
postgres:16-alpine   ~230MB
```

### Build Optimization Tips

1. **Use BuildKit for faster builds:**
   ```bash
   export DOCKER_BUILDKIT=1
   docker build ...
   ```

2. **Layer caching:**
   - Dependencies are cached separately
   - Only rebuilds on package.json changes
   - Subsequent builds: ~30 seconds

3. **Multi-platform builds:**
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 ...
   ```

---

## 🔍 Troubleshooting

### API not starting

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs api

# Common issues:
# 1. Database not ready - wait 30 seconds and check again
# 2. Missing env variables - check .env.prod
# 3. Prisma client not generated - rebuild image
```

### Database connection issues

```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.prod.yml ps postgres

# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yml logs postgres

# Test connection
docker exec -it tahaqaq-db psql -U tahaqaq -d tahaqaq_db
```

### Web app can't reach API

```bash
# Check CORS settings in .env.prod
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Check API URL in web container
docker exec -it tahaqaq-web env | grep VITE_API_URL

# Rebuild web image if needed
docker-compose -f docker-compose.prod.yml build web
```

### Rate limiting issues

```bash
# Increase limits in .env.prod
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Restart API
docker-compose -f docker-compose.prod.yml restart api
```

---

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f api

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 api
```

### Resource Usage

```bash
# Check container stats
docker stats

# Check disk usage
docker system df
```

### Health Checks

```bash
# API health
curl http://localhost:5000/api/v1/health

# Web health
curl http://localhost:3000/health

# Database health
docker exec -it tahaqaq-db pg_isready -U tahaqaq
```

---

## 🛑 Stopping Services

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes (deletes database!)
docker-compose -f docker-compose.prod.yml down -v

# Stop specific service
docker-compose -f docker-compose.prod.yml stop api
```

---

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Run migrations if needed
docker exec -it tahaqaq-api sh -c "cd apps/api && npx prisma migrate deploy --schema=src/prisma/schema.prisma"
```

### Backup Database

```bash
# Backup
docker exec tahaqaq-db pg_dump -U tahaqaq tahaqaq_db > backup.sql

# Restore
docker exec -i tahaqaq-db psql -U tahaqaq tahaqaq_db < backup.sql
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

## 🤝 Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/tahaqaq-360/issues
- Email: support@tahaqaq.com
