# Tahaqaq-360 Deployment Guide

## Prerequisites

1. **Docker Hub Account**: Create account at https://hub.docker.com
2. **Docker installed locally**
3. **Git bash or WSL** (for Windows)

## Step 1: Configure Environment Variables

### For API (Backend)
Create `.env.production` in `apps/api/`:
```env
# Database
DATABASE_URL="your-production-postgres-url"
DATABASE_DIRECT_URL="your-production-postgres-direct-url"

# JWT
JWT_ACCESS_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_EXPIRATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-api-domain.com/api/v1/auth/google/callback

# Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_BUCKET=your-bucket-name

# Application
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-web-domain.com,https://your-admin-domain.com
APP_URL=https://your-api-domain.com
FRONTEND_URL=https://your-web-domain.com

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=1000
```

## Step 2: Build and Push Docker Images

### Option A: Using the script (Recommended)

```bash
# Set your Docker Hub username
export DOCKER_USERNAME="your-dockerhub-username"

# Set API URL for frontend builds
export VITE_API_URL="https://your-api-domain.com/api/v1"

# Run the build script
chmod +x scripts/build-and-push.sh
./scripts/build-and-push.sh
```

### Option B: Manual build commands

```bash
# Build API
docker build -f apps/api/Dockerfile -t your-dockerhub-username/tahaqaq-360-api:latest .

# Build Web (with API URL)
docker build -f apps/web/Dockerfile \
  --build-arg VITE_API_URL=https://your-api-domain.com/api/v1 \
  -t your-dockerhub-username/tahaqaq-360-web:latest .

# Build Admin (with API URL)
docker build -f apps/admin/Dockerfile.prod \
  --build-arg VITE_API_URL=https://your-api-domain.com/api/v1 \
  -t your-dockerhub-username/tahaqaq-360-admin:latest .

# Push to Docker Hub
docker login
docker push your-dockerhub-username/tahaqaq-360-api:latest
docker push your-dockerhub-username/tahaqaq-360-web:latest
docker push your-dockerhub-username/tahaqaq-360-admin:latest
```

## Step 3: Deploy to Hosting Platforms

### 3.1 Deploy API (Backend) to Render

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Choose "Deploy an existing image from a registry"
4. Enter your Docker image: `your-dockerhub-username/tahaqaq-360-api:latest`
5. Configure:
   - **Name**: `tahaqaq-360-api`
   - **Region**: Choose closest to your users
   - **Instance Type**: Free or Starter
   - **Port**: `5000`
6. Add all environment variables from `.env.production`
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Your API will be available at: `https://tahaqaq-360-api.onrender.com`

### 3.2 Deploy Web (Main Website) to Vercel

**Option A: Using Vercel CLI**
```bash
cd apps/web
npm install -g vercel
vercel login
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
5. Add environment variable:
   - `VITE_API_URL` = `https://tahaqaq-360-api.onrender.com/api/v1`
6. Click "Deploy"

**Option C: Using Docker on Render**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Choose "Deploy an existing image from a registry"
4. Enter: `your-dockerhub-username/tahaqaq-360-web:latest`
5. Configure:
   - **Name**: `tahaqaq-360-web`
   - **Port**: `80` (nginx default)
   - **Instance Type**: Free or Starter
6. Click "Create Web Service"

### 3.3 Deploy Admin Panel to Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Choose "Deploy an existing image from a registry"
4. Enter: `your-dockerhub-username/tahaqaq-360-admin:latest`
5. Configure:
   - **Name**: `tahaqaq-360-admin`
   - **Port**: `3001`
   - **Instance Type**: Free or Starter
6. Click "Create Web Service"

## Step 4: Database Setup

### Using Supabase (Recommended)
1. Go to https://supabase.com
2. Create new project
3. Copy database connection strings:
   - **Transaction Pooler** → `DATABASE_URL`
   - **Direct Connection** → `DATABASE_DIRECT_URL`
4. Update Render environment variables

### Using Render PostgreSQL
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Copy connection strings
3. Update API environment variables

## Step 5: Run Database Migrations

After deploying the API:

```bash
# SSH into Render (use Render Shell)
# Or run locally pointing to production DB

export DATABASE_URL="your-production-db-url"
cd apps/api
pnpm prisma migrate deploy --schema=src/prisma/schema.prisma
pnpm prisma db seed --schema=src/prisma/schema.prisma
```

## Step 6: Verify Deployment

1. **API Health Check**: Visit `https://your-api-domain.com/api/v1/health`
2. **Web App**: Visit `https://your-web-domain.com`
3. **Admin Panel**: Visit `https://your-admin-domain.com`
4. **API Docs**: Visit `https://your-api-domain.com/api/docs`

## Troubleshooting

### API won't start
- Check Render logs for errors
- Verify database connection strings
- Ensure Prisma migrations ran successfully

### Frontend can't connect to API
- Verify CORS_ORIGIN includes frontend domains
- Check VITE_API_URL is correct
- Ensure API is running and accessible

### Docker build fails
- Clear Docker cache: `docker system prune -a`
- Ensure you're building from repository root
- Check Docker has enough memory (4GB+)

## Updating Deployments

1. Make code changes
2. Rebuild and push Docker images:
   ```bash
   ./scripts/build-and-push.sh
   ```
3. In Render dashboard, click "Manual Deploy" → "Clear build cache & deploy"

## Production Checklist

- [ ] Set strong JWT secrets
- [ ] Configure CORS for production domains only
- [ ] Enable HTTPS (Render/Vercel do this automatically)
- [ ] Set up database backups
- [ ] Configure error monitoring (Sentry)
- [ ] Set up uptime monitoring
- [ ] Review and limit API rate limiting
- [ ] Update Google OAuth callback URLs
- [ ] Test all authentication flows
- [ ] Test file uploads to Supabase
- [ ] Review security headers in nginx config

## Cost Estimates

### Free Tier Option
- **Render**: Free (API + Admin) - Spins down after 15min inactivity
- **Vercel**: Free (Web) - 100GB bandwidth/month
- **Supabase**: Free - 500MB database, 1GB storage
- **Total**: $0/month

### Production Option
- **Render**: $7/month per service (API + Admin = $14)
- **Vercel**: $20/month (Pro plan)
- **Supabase**: $25/month (Pro plan)
- **Total**: ~$59/month

## Support

For issues, check:
1. Render/Vercel logs
2. Browser console for frontend errors
3. Database connection status
4. Environment variables are set correctly
