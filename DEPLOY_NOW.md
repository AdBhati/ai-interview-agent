# Deploy to Heroku - Quick Steps

## Files Created ✅
- ✅ `Procfile` - In root directory
- ✅ `requirements.txt` - In root directory  
- ✅ `runtime.txt` - In root directory
- ✅ `setup.py` - For buildpack detection

## Deploy Commands

```bash
# 1. Make sure you're in the project root
cd ai-interview-system

# 2. Login to Heroku (if not already)
heroku login

# 3. Create app (if not created)
heroku create ai-interview-backend

# 4. Add PostgreSQL & Redis
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini

# 5. Set environment variables
heroku config:set SECRET_KEY="$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS="ai-interview-backend.herokuapp.com"
heroku config:set OPENROUTER_API_KEY="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"
heroku config:set SPEECHMATICS_API_KEY="Ryl08sNvAl6RSnFGysmFrxvFKslANJW4"
heroku config:set LITELLM_MODEL="openrouter/anthropic/claude-3-haiku"

# 6. Set Python buildpack explicitly (if needed)
heroku buildpacks:set heroku/python

# 7. Deploy
git push heroku main

# 8. Run migrations
heroku run python manage.py migrate

# 9. Collect static files
heroku run python manage.py collectstatic --noinput

# 10. Test
heroku open
```

## If Buildpack Still Not Detected

If you still get the buildpack error, explicitly set it:

```bash
heroku buildpacks:set heroku/python
heroku buildpacks:add heroku/python
```

## Verify Files

Make sure these files exist in root:
- ✅ `Procfile`
- ✅ `requirements.txt`
- ✅ `runtime.txt`
- ✅ `setup.py`

## Test Locally First

```bash
# Test Procfile locally
cd backend
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

## Troubleshooting

If deployment fails:
1. Check logs: `heroku logs --tail`
2. Verify buildpack: `heroku buildpacks`
3. Check config: `heroku config`
4. Try manual buildpack: `heroku buildpacks:set heroku/python`

