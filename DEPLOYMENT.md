# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

1. **Neon Database Account**: Create a free Neon PostgreSQL database
2. **Vercel Account**: Create a free Vercel account
3. **GitHub Repository**: Push your code to GitHub

## 🔧 Environment Variables Setup

### 1. Get Neon Database URL
```bash
# In Neon Console:
# 1. Create new project
# 2. Copy the connection string
# Format: postgresql://username:password@host:port/database?sslmode=require
```

### 2. Required Environment Variables
Set these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# JWT Configuration (Generate secure random strings)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"

# Next.js Configuration
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret-key-min-32-characters"

# Optional: App URL
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

## 🛠️ Local Setup Before Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npm run postinstall
# or
npx prisma generate
```

### 3. Test Local Build
```bash
npm run build
```

### 4. Test Production Build Locally
```bash
npm start
```

## 🚀 Deployment Steps

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod

# Follow prompts to:
# 1. Link to existing project or create new
# 2. Set up environment variables
# 3. Deploy
```

### Option 2: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Trigger deployment by pushing to main branch

## 🗄️ Database Setup

### 1. Push Schema to Neon
```bash
# Push Prisma schema to Neon database
npx prisma db push --schema=./prisma/schema.prisma
```

### 2. Seed Database (Optional)
```bash
# Run seed script to populate with sample data
npm run db:seed
```

## 🔍 Troubleshooting

### Common Issues & Solutions

#### 1. Prisma Client Generation Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run postinstall
```

#### 2. Database Connection Error
```bash
# Verify DATABASE_URL format
# Should include: ?sslmode=require
# Test connection with:
npx prisma db pull
```

#### 3. useSearchParams Suspense Error
```bash
# This is already fixed with Suspense boundaries
# Ensure pages using useSearchParams are wrapped in <Suspense>
```

#### 4. Build Timeout
```bash
# Increase build timeout in vercel.json
# Already configured to 30 seconds for API routes
```

## 📊 Post-Deployment Verification

### 1. Check Application Health
```bash
# Visit your deployed URL
https://your-domain.vercel.app
```

### 2. Test Authentication
```bash
# Try logging in with seeded users:
# Admin: admin@taskmanager.com / admin123
# User: user@taskmanager.com / user123
```

### 3. Test API Endpoints
```bash
# Test API endpoints
curl https://your-domain.vercel.app/api/auth/me
```

### 4. Check Database Connection
```bash
# Verify database operations work
# Create a task, update status, etc.
```

## 🔄 Continuous Deployment

### Automatic Deployments
- Push to `main` branch → Automatic deployment
- Environment variables are preserved across deployments
- Database migrations run automatically with `prisma generate`

### Manual Deployments
```bash
# Deploy specific changes
vercel --prod

# Deploy with custom build command
vercel --prod --build-command "npm run build"
```

## 🛡️ Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use Vercel's environment variable management
- Rotate secrets regularly

### 2. Database Security
- Use SSL connections (Neon requires this)
- Limit database user permissions
- Regularly update database passwords

### 3. JWT Security
- Use strong, random secrets
- Set appropriate expiration times
- Implement refresh tokens if needed

## 📈 Performance Optimization

### 1. Build Optimization
- Images are optimized with Next.js Image component
- CSS is minified with Tailwind
- JavaScript is minified and split

### 2. Database Optimization
- Use connection pooling (Neon handles this)
- Implement database indexes
- Cache frequently accessed data

### 3. CDN Optimization
- Static assets are served from Vercel Edge Network
- API responses are cached when appropriate
- Images are optimized and served from CDN

## 🎯 Success Checklist

- [ ] Environment variables configured in Vercel
- [ ] Database connection working
- [ ] Prisma client generates successfully
- [ ] Application builds without errors
- [ ] Authentication working correctly
- [ ] All pages load without errors
- [ ] API endpoints responding correctly
- [ ] Database operations working
- [ ] Responsive design working on mobile
- [ ] Error handling working properly

## 🆘 Support

If you encounter issues:

1. **Check Vercel Logs**: Dashboard → Functions → Logs
2. **Check Build Logs**: Dashboard → Builds → Latest build
3. **Verify Environment Variables**: Dashboard → Settings → Environment Variables
4. **Test Database Connection**: Use Prisma Studio or direct database connection
5. **Review Code**: Check for any recent changes that might break deployment

---

**🎉 Your application should now be successfully deployed to Vercel!**
