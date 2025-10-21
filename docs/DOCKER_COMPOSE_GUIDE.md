# Docker Compose Guide - Tahaqaq-360

## 📦 What's Included

Both docker-compose files now include all three applications:

- **API Backend** (NestJS) - Port 3000 (dev) / 5000 (prod)
- **Web Frontend** (React + Vite) - Port 5173 (dev) / 3000 (prod)
- **Admin Panel** (React + Vite) - Port 3001 (dev/prod)
- **PostgreSQL Database** - Port 5432

## 🚀 Quick Start

### Development Mode

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Start with rebuild
docker-compose -f docker-compose.dev.yml up --build

# Start in detached mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes
docker-compose -f docker-compose.dev.yml down -v
```

**Access the apps:**
- API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs
- Web App: http://localhost:5173
- Admin Panel: http://localhost:3001
- Database: localhost:5432

### Production Mode

```bash
# Create production environment file
cp .env.prod.example .env.prod
# Edit .env.prod with your actual values

# Start all services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up

# Start in detached mode
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop all services
docker-compose -f docker-compose.prod.yml down
```

**Access the apps:**
- API: http://localhost:5000
- API Docs: http://localhost:5000/api/docs
- Web App: http://localhost:3000
- Admin Panel: http://localhost:3001
- Database: localhost:5432

## 🔧 Common Commands

### View Service Status
```bash
docker-compose -f docker-compose.dev.yml ps
```

### Restart a Specific Service
```bash
# Development
docker-compose -f docker-compose.dev.yml restart api
docker-compose -f docker-compose.dev.yml restart web
docker-compose -f docker-compose.dev.yml restart admin

# Production
docker-compose -f docker-compose.prod.yml restart api
```

### View Logs for Specific Service
```bash
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f web
docker-compose -f docker-compose.dev.yml logs -f admin
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### Execute Commands in Running Container
```bash
# Access API container bash
docker-compose -f docker-compose.dev.yml exec api sh

# Run Prisma commands
docker-compose -f docker-compose.dev.yml exec api sh -c "cd apps/api && pnpm prisma studio"
docker-compose -f docker-compose.dev.yml exec api sh -c "cd apps/api && pnpm prisma migrate dev"

# Access database
docker-compose -f docker-compose.dev.yml exec postgres psql -U tahaqaq -d tahaqaq_dev
```

### Rebuild Specific Service
```bash
docker-compose -f docker-compose.dev.yml up --build api
docker-compose -f docker-compose.dev.yml up --build web
docker-compose -f docker-compose.dev.yml up --build admin
```

## 🗄️ Database Management

### Run Migrations (Development)
```bash
docker-compose -f docker-compose.dev.yml exec api sh -c "cd apps/api && pnpm prisma migrate dev"
```

### Run Migrations (Production)
```bash
docker-compose -f docker-compose.prod.yml exec api sh -c "cd /app && pnpm prisma migrate deploy --schema=src/prisma/schema.prisma"
```

### Seed Database
```bash
# Development
docker-compose -f docker-compose.dev.yml exec api sh -c "cd apps/api && pnpm db:seed"

# Production
docker-compose -f docker-compose.prod.yml exec api sh -c "cd /app && pnpm prisma db seed --schema=src/prisma/schema.prisma"
```

### Backup Database
```bash
# Development
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U tahaqaq tahaqaq_dev > backup.sql

# Production
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U tahaqaq tahaqaq_db > backup.sql
```

### Restore Database
```bash
# Development
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U tahaqaq tahaqaq_dev < backup.sql

# Production
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U tahaqaq tahaqaq_db < backup.sql
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5000
netstat -ano | findstr :5173
netstat -ano | findstr :5432

# Kill the process or change the port in docker-compose
```

### Container Won't Start
```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs api

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache api

# Remove all containers and volumes
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### Database Connection Issues
```bash
# Ensure database is healthy
docker-compose -f docker-compose.dev.yml ps postgres

# Check database logs
docker-compose -f docker-compose.dev.yml logs postgres

# Recreate database container
docker-compose -f docker-compose.dev.yml stop postgres
docker-compose -f docker-compose.dev.yml rm -f postgres
docker-compose -f docker-compose.dev.yml up postgres
```

### Hot Reload Not Working (Development)
```bash
# Ensure volumes are mounted correctly
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
```

## 📝 Environment Variables

### Development (docker-compose.dev.yml)
All environment variables are hardcoded in the file for easy development.

### Production (docker-compose.prod.yml)
Create `.env.prod` file from `.env.prod.example`:

```bash
cp .env.prod.example .env.prod
```

Edit `.env.prod` with your production values:
- Database credentials
- JWT secrets (generate with `openssl rand -hex 64`)
- Google OAuth credentials
- Supabase credentials
- CORS origins (your production domains)
- API URLs

## 🔒 Security Best Practices

1. **Never commit `.env.prod`** - It's in `.gitignore`
2. **Use strong passwords** for PostgreSQL
3. **Generate strong JWT secrets** (64+ characters)
4. **Update CORS_ORIGIN** to only include your domains
5. **Change default credentials** in production
6. **Use environment-specific secrets** for each deployment
7. **Enable HTTPS** in production (use reverse proxy like Nginx/Traefik)

## 🎯 Recommended Workflow

### For Development
```bash
# 1. Start all services
docker-compose -f docker-compose.dev.yml up

# 2. In another terminal, run migrations
docker-compose -f docker-compose.dev.yml exec api sh -c "cd apps/api && pnpm prisma migrate dev"

# 3. Seed database
docker-compose -f docker-compose.dev.yml exec api sh -c "cd apps/api && pnpm db:seed"

# 4. Access applications
# Web: http://localhost:5173
# Admin: http://localhost:3001
# API: http://localhost:3000
```

### For Production Testing
```bash
# 1. Configure environment
cp .env.prod.example .env.prod
# Edit .env.prod

# 2. Start services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# 3. Check logs
docker-compose -f docker-compose.prod.yml logs -f

# 4. Verify health
curl http://localhost:5000/api/v1/health
curl http://localhost:3000
curl http://localhost:3001
```

## 📊 Resource Usage

### Development Mode
- **CPU**: ~2-4 cores
- **RAM**: ~2-4 GB
- **Disk**: ~500 MB (without node_modules)

### Production Mode
- **CPU**: ~1-2 cores
- **RAM**: ~1-2 GB
- **Disk**: ~200 MB (optimized builds)

## 🆘 Getting Help

- Check container logs: `docker-compose logs -f [service-name]`
- Verify containers are running: `docker-compose ps`
- Inspect container: `docker inspect [container-name]`
- Check Docker resources: `docker stats`

## 🔄 Updating Services

```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Or update specific service
docker-compose -f docker-compose.prod.yml up -d --build api
```
