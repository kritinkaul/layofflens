# LayoffLens Deployment Guide

This guide will help you deploy LayoffLens to production environments. We'll cover deployment to Vercel (frontend) and Railway (backend/database).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git repository set up
- Vercel account (free tier available)
- Railway account (free tier available)
- PostgreSQL database

## 📋 Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Database schema migrated
- [ ] API routes tested
- [ ] Build process working locally
- [ ] Domain/SSL configured (optional)

## 🗄️ Database Setup

### Option 1: Railway PostgreSQL (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Create a new project

2. **Add PostgreSQL Database**
   - Click "New Service" → "Database" → "PostgreSQL"
   - Wait for database to be created
   - Copy the connection URL

3. **Configure Environment Variables**
   ```bash
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

### Option 2: Supabase (Alternative)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string from Settings → Database

2. **Configure Environment Variables**
   ```bash
   DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
   ```

## 🏗️ Frontend Deployment (Vercel)

### Step 1: Prepare Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

### Step 2: Environment Variables

Add these environment variables in Vercel dashboard:

```bash
DATABASE_URL=your_database_connection_string
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_secret_key
NODE_ENV=production
```

### Step 3: Deploy

1. **Automatic Deployment**
   - Vercel will automatically deploy on every push to main branch
   - Monitor deployment in Vercel dashboard

2. **Manual Deployment**
   ```bash
   npm run build
   vercel --prod
   ```

## 🔧 Backend Deployment (Railway)

### Step 1: Deploy API

1. **Create Railway Service**
   - In your Railway project, click "New Service" → "GitHub Repo"
   - Connect your repository
   - Set build command: `npm run build`
   - Set start command: `npm start`

2. **Environment Variables**
   ```bash
   DATABASE_URL=your_database_connection_string
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your_secret_key
   NODE_ENV=production
   ```

### Step 2: Database Migration

1. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

2. **Seed Database** (if needed)
   ```bash
   npm run db:seed
   ```

## 🌐 Domain Configuration

### Custom Domain (Optional)

1. **Vercel Domain**
   - Go to Vercel project settings
   - Add custom domain
   - Configure DNS records

2. **SSL Certificate**
   - Vercel provides automatic SSL
   - No additional configuration needed

## 📊 Monitoring & Analytics

### Vercel Analytics

1. **Enable Analytics**
   - Go to Vercel project settings
   - Enable Web Analytics
   - Monitor performance metrics

### Error Tracking

1. **Sentry Integration** (Optional)
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   - Add Sentry DSN to environment variables
   - Monitor errors and performance

## 🔒 Security Considerations

### Environment Variables

1. **Never commit secrets**
   - Use `.env.local` for local development
   - Use platform environment variables for production

2. **Database Security**
   - Use connection pooling
   - Enable SSL for database connections
   - Regular security updates

### API Security

1. **Rate Limiting**
   ```typescript
   // Add to API routes
   import rateLimit from 'express-rate-limit'
   ```

2. **CORS Configuration**
   ```typescript
   // Configure CORS for production
   const corsOptions = {
     origin: process.env.NEXTAUTH_URL,
     credentials: true
   }
   ```

## 📈 Performance Optimization

### Build Optimization

1. **Enable Compression**
   ```javascript
   // next.config.js
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true'
   })
   ```

2. **Image Optimization**
   ```javascript
   // next.config.js
   images: {
     domains: ['your-domain.com'],
     formats: ['image/webp', 'image/avif']
   }
   ```

### Database Optimization

1. **Indexes**
   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_layoffs_date ON layoffs(date);
   CREATE INDEX idx_layoffs_company ON layoffs(company_id);
   ```

2. **Connection Pooling**
   ```javascript
   // lib/prisma.ts
   const globalForPrisma = globalThis as unknown as {
     prisma: PrismaClient | undefined
   }
   
   export const prisma = globalForPrisma.prisma ?? new PrismaClient()
   
   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   npm run build
   
   # Fix TypeScript errors
   npm run type-check
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   npx prisma db push
   
   # Check environment variables
   echo $DATABASE_URL
   ```

3. **API Route Errors**
   ```bash
   # Check API logs
   vercel logs
   
   # Test API locally
   npm run dev
   ```

### Performance Issues

1. **Slow Database Queries**
   - Add database indexes
   - Optimize Prisma queries
   - Use connection pooling

2. **Large Bundle Size**
   - Analyze bundle: `npm run analyze`
   - Code splitting
   - Tree shaking

## 📞 Support

For deployment issues:

1. **Check Documentation**
   - [Vercel Docs](https://vercel.com/docs)
   - [Railway Docs](https://docs.railway.app)
   - [Next.js Docs](https://nextjs.org/docs)

2. **Community Support**
   - GitHub Issues
   - Stack Overflow
   - Discord communities

## 🎯 Production Checklist

Before going live:

- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Documentation updated
- [ ] Team access configured
- [ ] SSL certificates active
- [ ] Error tracking enabled
- [ ] Analytics configured

---

**Happy Deploying! 🚀**

Your LayoffLens application is now ready to provide valuable insights to users worldwide. 