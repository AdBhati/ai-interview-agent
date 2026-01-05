# Heroku Environment Variables Setup

## ✅ Environment Variables Set

All required environment variables have been set for the Heroku app: **ai-interview-agent**

### Required Variables:

1. **SECRET_KEY** - Django secret key (auto-generated)
2. **DEBUG** - Set to `False` for production
3. **OPENROUTER_API_KEY** - Your OpenRouter API key
4. **SPEECHMATICS_API_KEY** - Your Speechmatics API key
5. **LITELLM_MODEL** - Model to use: `openrouter/anthropic/claude-3-haiku`

### Auto-Set by Heroku Addons:

- **DATABASE_URL** - Automatically set by `heroku-postgresql` addon
- **REDIS_URL** - Automatically set by `heroku-redis` addon

## 📋 View Current Configuration

```bash
heroku config --app ai-interview-agent
```

## 🔧 Update Environment Variables

If you need to update any variable:

```bash
# Update a single variable
heroku config:set VARIABLE_NAME="value" --app ai-interview-agent

# Update multiple variables
heroku config:set VAR1="value1" VAR2="value2" --app ai-interview-agent
```

## 📝 All Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Django secret key | ✅ Yes |
| `DEBUG` | Debug mode (False for production) | ✅ Yes |
| `DATABASE_URL` | PostgreSQL connection (auto-set) | ✅ Yes |
| `REDIS_URL` | Redis connection (auto-set) | ✅ Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI | ✅ Yes |
| `SPEECHMATICS_API_KEY` | Speechmatics API key for STT | ✅ Yes |
| `LITELLM_MODEL` | LLM model to use | ✅ Yes |
| `FRONTEND_URL` | Frontend URL for CORS (optional) | ⚪ Optional |
| `CELERY_BROKER_URL` | Celery broker (uses REDIS_URL) | ⚪ Optional |
| `CELERY_RESULT_BACKEND` | Celery backend (uses REDIS_URL) | ⚪ Optional |

## 🚀 Next Steps

1. **Verify addons are installed:**
   ```bash
   heroku addons --app ai-interview-agent
   ```

2. **If PostgreSQL is missing:**
   ```bash
   heroku addons:create heroku-postgresql:mini --app ai-interview-agent
   ```

3. **If Redis is missing:**
   ```bash
   heroku addons:create heroku-redis:mini --app ai-interview-agent
   ```

4. **Run migrations:**
   ```bash
   heroku run python manage.py migrate --app ai-interview-agent
   ```

5. **Check logs:**
   ```bash
   heroku logs --tail --app ai-interview-agent
   ```

## ✅ Verification

Test the API:

```bash
# Check root endpoint
curl https://ai-interview-agent-4b4b22e44ca7.herokuapp.com/

# Check health endpoint
curl https://ai-interview-agent-4b4b22e44ca7.herokuapp.com/api/health/
```

All environment variables are now configured! 🎉

