# Quick Heroku Deployment Guide

## Prerequisites
- Heroku account: https://www.heroku.com/
- Heroku CLI installed: `brew install heroku` (macOS)

## Quick Deploy (5 minutes)

### Step 1: Login to Heroku
```bash
heroku login
```

### Step 2: Navigate to Backend
```bash
cd ai-interview-system/backend
```

### Step 3: Create Heroku App
```bash
heroku create ai-interview-backend
# Or use your preferred name
```

### Step 4: Add Database & Redis
```bash
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini
```

### Step 5: Set Environment Variables
```bash
# Generate secret key
SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")

# Set config vars
heroku config:set SECRET_KEY="$SECRET_KEY"
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS="ai-interview-backend.herokuapp.com"
heroku config:set OPENROUTER_API_KEY="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"
heroku config:set SPEECHMATICS_API_KEY="Ryl08sNvAl6RSnFGysmFrxvFKslANJW4"
heroku config:set LITELLM_MODEL="openrouter/anthropic/claude-3-haiku"
```

### Step 6: Deploy
```bash
git push heroku main
```

### Step 7: Setup Database
```bash
heroku run python manage.py migrate
heroku run python manage.py collectstatic --noinput
```

### Step 8: Test
```bash
heroku open
# Or visit: https://ai-interview-backend.herokuapp.com/api/health/
```

## Or Use the Script

```bash
cd ai-interview-system/backend
./deploy-heroku.sh
```

## Your App URL
After deployment, your app will be at:
```
https://ai-interview-backend.herokuapp.com
```

## Update Frontend

Update `frontend/next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ai-interview-backend.herokuapp.com/api/:path*",
      },
    ];
  },
};
```

## View Logs
```bash
heroku logs --tail
```

## Restart App
```bash
heroku restart
```

Done! 🎉

