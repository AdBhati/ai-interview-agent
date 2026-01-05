# Heroku Deployment Guide

Complete guide to deploy the AI Interview System backend on Heroku.

## Prerequisites

1. **Heroku Account**
   - Sign up at: https://www.heroku.com/
   - Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

2. **Git Repository**
   - Code should be on GitHub (already done ✅)

3. **Heroku CLI Installed**
   ```bash
   heroku --version
   ```

## Step 1: Install Heroku CLI

### macOS
```bash
brew tap heroku/brew && brew install heroku
```

### Verify Installation
```bash
heroku --version
heroku login
```

## Step 2: Create Heroku App

```bash
cd ai-interview-system/backend
heroku create ai-interview-backend
# Or use your preferred name
# heroku create your-app-name
```

**Note:** App names must be unique across Heroku. If the name is taken, try a different one.

## Step 3: Add PostgreSQL Database

```bash
heroku addons:create heroku-postgresql:mini
# For production, use: heroku-postgresql:standard-0 or higher
```

This automatically sets `DATABASE_URL` environment variable.

## Step 4: Add Redis (for Channels/Celery)

```bash
heroku addons:create heroku-redis:mini
# For production, use: heroku-redis:premium-0 or higher
```

This automatically sets `REDIS_URL` environment variable.

## Step 5: Set Environment Variables

Set all required environment variables:

```bash
# Django Settings
heroku config:set SECRET_KEY="your-secret-key-here"
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS="your-app-name.herokuapp.com"

# API Keys
heroku config:set OPENROUTER_API_KEY="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"
heroku config:set SPEECHMATICS_API_KEY="Ryl08sNvAl6RSnFGysmFrxvFKslANJW4"
heroku config:set LITELLM_MODEL="openrouter/anthropic/claude-3-haiku"

# Frontend URL (for CORS)
heroku config:set FRONTEND_URL="https://your-frontend-domain.com"

# Optional: Celery settings (if using separate Redis)
# heroku config:set CELERY_BROKER_URL=$REDIS_URL
# heroku config:set CELERY_RESULT_BACKEND=$REDIS_URL
```

### Generate Secret Key

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Use the output as your `SECRET_KEY`.

## Step 6: Configure Buildpacks

```bash
heroku buildpacks:add heroku/python
```

## Step 7: Deploy to Heroku

### Option A: Deploy from Git (Recommended)

```bash
# Make sure you're in the backend directory
cd ai-interview-system/backend

# Add Heroku remote (if not already added)
heroku git:remote -a ai-interview-backend

# Deploy
git push heroku main
```

### Option B: Deploy from GitHub

1. Go to Heroku Dashboard: https://dashboard.heroku.com/
2. Select your app
3. Go to "Deploy" tab
4. Connect to GitHub
5. Select repository: `AdBhati/ai-interview-agent`
6. Select branch: `main`
7. Enable "Wait for CI to pass" (optional)
8. Click "Deploy Branch"

## Step 8: Run Migrations

```bash
heroku run python manage.py migrate
```

## Step 9: Create Superuser (Optional)

```bash
heroku run python manage.py createsuperuser
```

## Step 10: Collect Static Files

```bash
heroku run python manage.py collectstatic --noinput
```

## Step 11: Verify Deployment

```bash
# Check app status
heroku ps

# View logs
heroku logs --tail

# Test the API
curl https://your-app-name.herokuapp.com/api/health/
```

## Step 12: Update Frontend API URL

Update your frontend `.env` or `next.config.ts`:

```typescript
// frontend/.env.local
NEXT_PUBLIC_API_URL=https://your-app-name.herokuapp.com
```

Or in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://your-app-name.herokuapp.com/api/:path*",
      },
    ];
  },
};
```

## Configuration Files Created

✅ `Procfile` - Defines how to run the app
✅ `runtime.txt` - Python version
✅ `requirements.txt` - Updated with Heroku dependencies
✅ `settings.py` - Updated for Heroku

## Important Notes

### Static Files
- Static files are served via WhiteNoise
- Run `collectstatic` after each deployment
- For production, consider using S3 for media files

### Media Files
- Currently stored locally (not persistent on Heroku)
- **Important:** Heroku filesystem is ephemeral
- **Solution:** Use AWS S3 or similar for media storage
- See: https://devcenter.heroku.com/articles/s3

### Database
- PostgreSQL is automatically configured via `DATABASE_URL`
- Migrations run automatically via `release` command in Procfile

### Redis
- Redis is automatically configured via `REDIS_URL`
- Used for Channels (WebSocket) and Celery

### WebSocket (Channels)
- Daphne is configured in Procfile
- Redis is required for Channels
- WebSocket URL: `wss://your-app-name.herokuapp.com/ws/interview/{id}/`

## Troubleshooting

### Issue: "No module named 'dj_database_url'"
**Solution:**
```bash
pip install dj-database-url
# Add to requirements.txt
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Add dj-database-url"
git push heroku main
```

### Issue: "Application Error"
**Solution:**
```bash
# Check logs
heroku logs --tail

# Common issues:
# - Missing environment variables
# - Database not migrated
# - Static files not collected
```

### Issue: "Database connection failed"
**Solution:**
```bash
# Check DATABASE_URL
heroku config:get DATABASE_URL

# Run migrations
heroku run python manage.py migrate
```

### Issue: "Static files not found"
**Solution:**
```bash
# Collect static files
heroku run python manage.py collectstatic --noinput

# Check WhiteNoise is in MIDDLEWARE
```

### Issue: "CORS errors"
**Solution:**
```bash
# Add frontend URL to CORS
heroku config:set FRONTEND_URL="https://your-frontend.com"

# Or allow all origins (not recommended for production)
heroku config:set CORS_ALLOW_ALL_ORIGINS=True
```

## Scaling

### Scale Web Dynos
```bash
heroku ps:scale web=1
# For production, use 2+ dynos
heroku ps:scale web=2
```

### Scale Worker Dynos (for Celery)
```bash
heroku ps:scale worker=1
```

## Monitoring

### View Logs
```bash
heroku logs --tail
heroku logs --tail --dyno web
heroku logs --tail --dyno worker
```

### Check App Status
```bash
heroku ps
heroku ps:restart
```

### View Config Vars
```bash
heroku config
heroku config:get SECRET_KEY
```

## Cost Estimation

### Free Tier (Hobby)
- **PostgreSQL Mini**: Free (limited to 10K rows)
- **Redis Mini**: Free (25MB)
- **Web Dyno**: Free (sleeps after 30 min inactivity)
- **Total**: Free

### Production (Paid)
- **PostgreSQL Standard-0**: ~$50/month
- **Redis Premium-0**: ~$15/month
- **Web Dyno Standard-1X**: ~$25/month (per dyno)
- **Worker Dyno**: ~$25/month (if using Celery)
- **Total**: ~$90-115/month

## Next Steps

1. ✅ Deploy backend to Heroku
2. ⏭️ Deploy frontend to Vercel/Netlify
3. ⏭️ Set up custom domain
4. ⏭️ Configure S3 for media files
5. ⏭️ Set up monitoring

## Quick Deploy Commands

```bash
# One-time setup
cd ai-interview-system/backend
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini
heroku config:set SECRET_KEY="$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"
heroku config:set DEBUG=False
heroku config:set OPENROUTER_API_KEY="your-key"
heroku config:set SPEECHMATICS_API_KEY="your-key"

# Deploy
git push heroku main

# Setup
heroku run python manage.py migrate
heroku run python manage.py collectstatic --noinput
heroku run python manage.py createsuperuser

# Done!
heroku open
```

## Support

For issues:
- Check Heroku logs: `heroku logs --tail`
- Check Heroku status: https://status.heroku.com/
- Heroku docs: https://devcenter.heroku.com/

---

**Happy Deploying! 🚀**

