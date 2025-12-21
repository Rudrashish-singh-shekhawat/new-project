# Deployment Guide for EduMarket

This guide covers deploying your MERN stack e-learning platform to production.

## Table of Contents
1. [Backend Deployment (Heroku/Railway)](#backend-deployment)
2. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
3. [Database Setup (MongoDB Atlas)](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment](#post-deployment)

---

## Backend Deployment

### Option 1: Deploy to Heroku

**Prerequisites:**
- Heroku account (heroku.com)
- Heroku CLI installed

**Steps:**

1. Install Heroku CLI and login:
```bash
npm install -g heroku
heroku login
```

2. Create a new Heroku app:
```bash
cd server
heroku create your-app-name
```

3. Add environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set STRIPE_SECRET_KEY=your_stripe_key
heroku config:set STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-url.com
```

4. Deploy:
```bash
git push heroku main
```

### Option 2: Deploy to Railway

**Steps:**

1. Go to railway.app and connect GitHub
2. Create new project → GitHub repo
3. Select server folder
4. Add environment variables in Railway dashboard
5. Deploy!

---

## Frontend Deployment

### Option 1: Deploy to Vercel

**Prerequisites:**
- Vercel account (vercel.com)
- GitHub connected

**Steps:**

1. Push your code to GitHub
2. Go to vercel.com and click "New Project"
3. Import your GitHub repository
4. Set project root to `clinte`
5. Add environment variables:
   - `VITE_API_URL=https://your-backend-url.com/api`
   - `VITE_STRIPE_PUBLISHABLE_KEY=your_key`
6. Deploy!

### Option 2: Deploy to Netlify

**Steps:**

1. Build the frontend:
```bash
cd clinte
npm run build
```

2. Go to netlify.com → New site from Git
3. Connect GitHub and select repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables in site settings
7. Deploy!

---

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Go to mongodb.com/cloud/atlas
2. Create an account or login
3. Create a new cluster (free tier available)
4. Create database user with strong password
5. Add IP address to whitelist (or 0.0.0.0/0 for development)
6. Get connection string
7. Replace localhost in `MONGODB_URI` with your Atlas URI

**Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/elearning?retryWrites=true&w=majority
```

---

## Environment Variables

### Backend (.env on server)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/elearning
JWT_SECRET=your_very_long_secret_key_min_32_chars
STRIPE_SECRET_KEY=sk_live_your_production_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.local on client)
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
```

---

## Post-Deployment Checklist

- [ ] Test all authentication flows
- [ ] Test course browsing and filtering
- [ ] Test adding courses to cart
- [ ] Test checkout with real Stripe keys
- [ ] Test payment verification
- [ ] Verify enrolled courses show correctly
- [ ] Check email configuration (if implemented)
- [ ] Monitor error logs
- [ ] Set up analytics
- [ ] Enable HTTPS everywhere
- [ ] Set up backup strategy for database

---

## Domain and HTTPS

### Custom Domain
1. Buy domain from provider (Namecheap, GoDaddy, etc.)
2. Point domain to your hosting provider's nameservers
3. Configure SSL certificate (usually automatic)

### HTTPS
- Vercel: Automatic
- Netlify: Automatic
- Heroku: Automatic with custom domain
- Railway: Automatic with custom domain

---

## Monitoring and Maintenance

### Backend Monitoring
- Set up error logging (Sentry, LogRocket)
- Monitor server health and uptime
- Track API response times
- Monitor database performance

### Frontend Monitoring
- Set up Sentry for error tracking
- Monitor user analytics (Google Analytics)
- Track Core Web Vitals
- Monitor bundle size

---

## Performance Optimization

### Backend
- Enable caching headers
- Implement rate limiting
- Compress responses with gzip
- Optimize database queries
- Use CDN for static assets

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Minify and compress assets
- Use CDN for static files
- Implement service workers

---

## Security Considerations

### Backend
- Never commit .env files
- Use strong JWT secrets
- Implement CORS properly
- Validate all inputs
- Use HTTPS only
- Implement rate limiting
- Keep dependencies updated

### Frontend
- Never expose sensitive keys (use env vars)
- Implement CSRF protection
- Sanitize user input
- Keep dependencies updated
- Use Content Security Policy headers

### Database
- Enable authentication
- Use strong passwords
- Restrict IP whitelist
- Enable backups
- Encrypt sensitive data
- Monitor access logs

---

## Scaling

### As User Base Grows
1. Implement caching (Redis)
2. Use database indexing
3. Implement pagination
4. Use CDN for assets
5. Consider microservices
6. Implement API rate limiting
7. Use load balancing

---

## Cost Optimization

- MongoDB Atlas free tier or shared cluster
- Vercel free tier for frontend
- Heroku paid tiers ($7+/month minimum)
- Use free tier services where possible
- Monitor and optimize database usage
- Compress images and optimize assets

---

## Troubleshooting Deployment

### Backend won't deploy
- Check buildpack (Node.js)
- Check Procfile exists
- Verify environment variables
- Check logs with `heroku logs --tail`

### Frontend won't deploy
- Check build command
- Check publish directory
- Verify environment variables
- Check node version compatibility

### Payment not working
- Verify Stripe keys are production keys
- Check webhook configuration
- Verify CORS settings
- Check logs for errors

---

## Getting Help

- Check platform documentation
- Review error logs
- Search Stack Overflow
- Check GitHub issues
- Contact platform support

---

## Next Steps After Deployment

1. Monitor analytics and user behavior
2. Gather user feedback
3. Plan feature improvements
4. Implement instructor dashboard
5. Add email notifications
6. Implement course recommendations
7. Add discussion forums
8. Create mobile app

---

Good luck with your deployment! 🚀
