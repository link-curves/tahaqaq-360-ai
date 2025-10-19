# 🚀 Quick Deployment Reference

## One-Command Deployments

### Local Development
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Production (Local Build)
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Production (From Docker Hub)
```bash
export DOCKER_USERNAME=yourusername
./scripts/deploy.sh
```

## Essential Commands

### Build
```bash
# Build both images
docker-compose -f docker-compose.prod.yml build

# Build specific service
docker build -f apps/api/Dockerfile.prod -t tahaqaq-api .
```

### Push to Docker Hub
```bash
export DOCKER_USERNAME=yourusername
./scripts/build-and-push.sh v1.0.0
```

### Start/Stop
```bash
# Start
docker-compose -f docker-compose.prod.yml up -d

# Stop
docker-compose -f docker-compose.prod.yml down

# Restart specific service
docker-compose -f docker-compose.prod.yml restart api
```

### Logs
```bash
# All logs
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f api

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Database
```bash
# Migrations
docker exec -it tahaqaq-api sh -c "cd apps/api && npx prisma migrate deploy --schema=src/prisma/schema.prisma"

# Seed
docker exec -it tahaqaq-api sh -c "cd apps/api && pnpm db:seed:ar"

# Backup
docker exec tahaqaq-db pg_dump -U tahaqaq tahaqaq_db > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i tahaqaq-db psql -U tahaqaq tahaqaq_db < backup.sql
```

### Health Checks
```bash
curl http://localhost:5000/api/v1/health  # API
curl http://localhost:3000/health         # Web
docker ps                                  # All containers
```

## URLs

| Service | Development | Production |
|---------|-------------|------------|
| Web | http://localhost:5173 | http://localhost:3000 |
| API | http://localhost:3000 | http://localhost:5000 |
| Docs | http://localhost:3000/api/docs | http://localhost:5000/api/docs |
| DB | localhost:5432 | localhost:5432 |

## Free Hosting

| Platform | Command | Notes |
|----------|---------|-------|
| Railway | `railway up` | $5 free credit/month |
| Render | Connect GitHub | Auto-deploy, spins down |
| Fly.io | `flyctl launch` | 3 VMs free |
| Oracle Cloud | Manual setup | Always free, 24GB RAM |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| API won't start | Check `.env.prod`, wait for DB, rebuild image |
| Web can't reach API | Check `CORS_ORIGIN`, verify `VITE_API_URL` |
| Rate limiting | Increase `THROTTLE_LIMIT` in `.env.prod` |
| DB connection failed | Check `DATABASE_URL`, restart postgres |
| Build too slow | Use BuildKit: `export DOCKER_BUILDKIT=1` |

## File Structure

```
tahaqaq-360/
├── apps/
│   ├── api/
│   │   ├── Dockerfile.prod      # API production image
│   │   └── src/prisma/          # Database schema
│   └── web/
│       ├── Dockerfile.prod      # Web production image
│       └── nginx.conf           # Nginx config
├── scripts/
│   ├── build-and-push.sh        # Build & push to Docker Hub
│   └── deploy.sh                # Deploy from Docker Hub
├── docker-compose.prod.yml      # Production orchestration
├── docker-compose.dev.yml       # Development orchestration
├── .env.prod.example            # Environment template
└── DOCKER_DEPLOYMENT.md         # Full guide
```

## Environment Setup

```bash
# 1. Copy template
cp .env.prod.example .env.prod

# 2. Generate secrets
openssl rand -base64 64  # JWT_ACCESS_SECRET
openssl rand -base64 64  # JWT_REFRESH_SECRET

# 3. Required variables
POSTGRES_PASSWORD=<strong-password>
JWT_ACCESS_SECRET=<generated-secret>
JWT_REFRESH_SECRET=<generated-secret>
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com/api/v1
```

## Image Sizes

- **API:** ~400MB (Alpine + Node + Prisma)
- **Web:** ~50MB (Alpine + Nginx)
- **PostgreSQL:** ~230MB (Alpine)
- **Total:** ~680MB

## Build Times

- **First build:** ~5 minutes
- **Cached build:** ~30 seconds
- **Rebuild one service:** ~1 minute

---

For more details, see **DOCKER_DEPLOYMENT.md**
