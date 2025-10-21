# Quick Deployment Guide - Tahaqaq-360

## 🚀 Quick Start (5 Steps)

### 1. Build Docker Images

```bash
# Set your Docker Hub username
export DOCKER_USERNAME="your-dockerhub-username"
export VITE_API_URL="https://your-future-api-domain.onrender.com/api/v1"

# Login to Docker Hub
docker login

# Build and push all images
chmod +x scripts/build-and-push.sh
./scripts/build-and-push.sh
```

### 2. Deploy Database (Supabase - Free)

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Name: `tahaqaq-360`
   - Database Password: (generate strong password)
   - Region: (closest to your users)
4. Wait for project creation
5. Go to Project Settings → Database
6. Copy both connection strings:
   - **Transaction Pooler** (for DATABASE_URL)
   - **Direct Connection** (for DATABASE_DIRECT_URL)

### 3. Deploy API Backend (Render - Free)

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Select "Deploy an existing image from a registry"
4. Enter image: `your-dockerhub-username/tahaqaq-360-api:latest`
5. Configure:
   - **Name**: `tahaqaq-360-api`
   - **Region**: Frankfurt (or closest)
   - **Instance Type**: Free
   - **Port**: `5000`

6. Add Environment Variables (click "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<from-supabase-transaction-pooler>
   DATABASE_DIRECT_URL=<from-supabase-direct-connection>
   JWT_ACCESS_SECRET=<generate-random-64-char-string>
   JWT_REFRESH_SECRET=<generate-random-64-char-string>
   JWT_ACCESS_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRATION=7d
   CORS_ORIGIN=https://your-web-domain.vercel.app,https://your-admin-domain.onrender.com
   THROTTLE_TTL=60000
   THROTTLE_LIMIT=1000
   GOOGLE_CLIENT_ID=<your-google-oauth-id>
   GOOGLE_CLIENT_SECRET=<your-google-oauth-secret>
   GOOGLE_CALLBACK_URL=https://tahaqaq-360-api.onrender.com/api/v1/auth/google/callback
   SUPABASE_URL=<your-supabase-project-url>
   SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_BUCKET=uploads
   ```

7. Click "Create Web Service"
8. Wait for deployment (~5 minutes)
9. Your API URL: `https://tahaqaq-360-api.onrender.com`

### 4. Run Database Migrations

After API is deployed, use Render Shell:

1. In Render dashboard, click on your API service
2. Click "Shell" tab
3. Run:
   ```bash
   cd /app
   pnpm prisma migrate deploy --schema=src/prisma/schema.prisma
   pnpm prisma db seed --schema=src/prisma/schema.prisma
   ```

### 5. Deploy Frontend Apps

#### 5A. Deploy Web (Main Website) - Vercel

```bash
cd apps/web
npm install -g vercel
vercel login
vercel --prod
```

When prompted:
- Set up and deploy: Yes
- Which scope: (your account)
- Link to existing project: No
- Project name: tahaqaq-360-web
- Directory: ./
- Override settings: No

Then add environment variable:
```bash
vercel env add VITE_API_URL production
# Enter: https://tahaqaq-360-api.onrender.com/api/v1
```

#### 5B. Deploy Admin Panel - Render

1. Go to Render → New + → Web Service
2. Deploy existing image: `your-dockerhub-username/tahaqaq-360-admin:latest`
3. Configure:
   - Name: `tahaqaq-360-admin`
   - Port: `3001`
   - Instance Type: Free
4. Environment Variables:
   ```
   VITE_API_URL=https://tahaqaq-360-api.onrender.com/api/v1
   ```
5. Create Web Service

## ✅ Verify Deployment

1. **API**: https://tahaqaq-360-api.onrender.com/api/v1/health
2. **API Docs**: https://tahaqaq-360-api.onrender.com/api/docs
3. **Web App**: https://your-project.vercel.app
4. **Admin**: https://tahaqaq-360-admin.onrender.com

## 🔧 Update CORS and OAuth

After deployment, update:

1. **API CORS_ORIGIN** in Render:
   ```
   https://your-project.vercel.app,https://tahaqaq-360-admin.onrender.com
   ```

2. **Google OAuth Console**:
   - Authorized redirect URIs: `https://tahaqaq-360-api.onrender.com/api/v1/auth/google/callback`
   - Authorized JavaScript origins: 
     - `https://your-project.vercel.app`
     - `https://tahaqaq-360-api.onrender.com`

## 📝 Admin Login Credentials

After seeding database:
- Email: `admin@tahaqaq360.com`
- Password: `Password123!`

**⚠️ Change these credentials immediately in production!**

## 💰 Cost Summary

**Free Tier** (with limitations):
- Render API (Free): Sleeps after 15min inactivity
- Render Admin (Free): Sleeps after 15min inactivity  
- Vercel Web (Free): 100GB bandwidth/month
- Supabase DB (Free): 500MB database
- **Total: $0/month**

**Keep-alive**: Free tier services sleep. Add a cron job to ping every 10 minutes:
```bash
# Use cron-job.org or similar
curl https://tahaqaq-360-api.onrender.com/api/v1/health
```

## 🐛 Troubleshooting

### API returns 502/503
- Check Render logs
- Verify database connection
- Restart service

### Frontend can't reach API
- Check CORS_ORIGIN includes frontend domain
- Verify VITE_API_URL is correct
- Check API is running

### Database migrations fail
- Verify DATABASE_URL is correct
- Check database connection in Supabase
- Run migrations manually via Render Shell

## 📚 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide.
