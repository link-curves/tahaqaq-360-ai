# Docker Build Troubleshooting

## Error: "Cannot install with frozen-lockfile"

### Problem
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date
```

### Quick Fix

**Option 1: Run pre-build script (Recommended)**
```bash
# This will update lockfile and prepare everything
chmod +x scripts/pre-build.sh
./scripts/pre-build.sh

# Then build
docker-compose build
```

**Option 2: Update lockfile manually**
```bash
# Update lockfile
pnpm install

# Then build
docker-compose build
```

**Option 3: Force rebuild without cache**
```bash
# This will rebuild everything from scratch
docker-compose build --no-cache
```

### Permanent Fix

The Dockerfiles have been updated to use `--no-frozen-lockfile` which allows pnpm to update the lockfile during build. This is less strict but more flexible for development.

If you want stricter builds (for production), make sure to:
1. Always run `pnpm install` before building Docker images
2. Commit the updated `pnpm-lock.yaml` to git

## Other Common Docker Issues

### Issue: "failed to solve with frontend dockerfile.v0"

**Fix**: Update Docker to latest version
```bash
docker version
# Update Docker Desktop if < 20.10
```

### Issue: "Cannot connect to the Docker daemon"

**Fix**: Start Docker Desktop
- Windows: Start Docker Desktop application
- Mac: Start Docker Desktop application  
- Linux: `sudo systemctl start docker`

### Issue: Build is very slow

**Fix**: Increase Docker resources
1. Open Docker Desktop
2. Settings → Resources
3. Increase:
   - CPUs: 4+
   - Memory: 8GB+
   - Disk: 60GB+

### Issue: "no space left on device"

**Fix**: Clean Docker
```bash
# Remove unused data
docker system prune -a

# Remove all volumes (⚠️ deletes data)
docker volume prune
```

### Issue: Port already in use

**Fix**: Stop conflicting services
```bash
# Check what's using the port
# Windows (PowerShell):
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000

# Stop the process or change port in docker-compose.yml
```

## Docker Compose Commands

### Build all services
```bash
docker-compose build
```

### Build specific service
```bash
docker-compose build api
docker-compose build web
docker-compose build admin
```

### Start services
```bash
# Start in background
docker-compose up -d

# Start with logs
docker-compose up

# Start specific service
docker-compose up api
```

### Stop services
```bash
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs api

# Follow logs
docker-compose logs -f api
```

### Restart service
```bash
docker-compose restart api
```

### Run command in container
```bash
# Run migrations
docker-compose exec api pnpm prisma migrate deploy

# Open shell
docker-compose exec api sh

# Seed database
docker-compose exec api pnpm prisma db seed
```

## Development Workflow

```bash
# 1. Make code changes
# ... edit files ...

# 2. Rebuild specific service
docker-compose build api

# 3. Restart service
docker-compose restart api

# 4. View logs
docker-compose logs -f api
```

## Production Build Workflow

```bash
# 1. Update lockfile
pnpm install

# 2. Run pre-build checks
./scripts/pre-build.sh

# 3. Build and push images
./scripts/build-and-push.sh v1.0.0

# 4. Deploy to production
# (See DEPLOYMENT.md)
```

## Need Help?

- Check Docker logs: `docker-compose logs`
- Check service status: `docker-compose ps`
- Check Docker disk usage: `docker system df`
- Full cleanup: `docker system prune -a --volumes` (⚠️ deletes everything)
