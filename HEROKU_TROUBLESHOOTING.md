# Heroku Troubleshooting - Database Connection Error

## Error
```
psycopg2.OperationalError: connection to server at "localhost" (127.0.0.1), port 5432 failed
```

## Cause
Django is trying to connect to localhost PostgreSQL instead of using Heroku's `DATABASE_URL`.

## Solution

### Step 1: Verify PostgreSQL Addon is Added
```bash
heroku addons
```

If you don't see `heroku-postgresql`, add it:
```bash
heroku addons:create heroku-postgresql:mini
```

### Step 2: Verify DATABASE_URL is Set
```bash
heroku config:get DATABASE_URL
```

Should show something like:
```
postgres://user:pass@host:port/dbname
```

If it's empty, the PostgreSQL addon wasn't added correctly.

### Step 3: Redeploy After Fix
```bash
git push heroku main
```

### Step 4: Run Migrations
```bash
heroku run python manage.py migrate
```

## Quick Fix Commands

```bash
# 1. Add PostgreSQL (if not added)
heroku addons:create heroku-postgresql:mini

# 2. Verify DATABASE_URL
heroku config:get DATABASE_URL

# 3. Redeploy
git push heroku main

# 4. Run migrations
heroku run python manage.py migrate
```

## Verify It's Working

```bash
# Check database connection
heroku run python manage.py check --database default

# Or test with dbshell
heroku run python manage.py dbshell
```

## If Still Not Working

1. **Check logs:**
   ```bash
   heroku logs --tail
   ```

2. **Verify settings.py is using DATABASE_URL:**
   The code should check `DATABASE_URL` first before falling back to localhost.

3. **Manually set DATABASE_URL (if needed):**
   ```bash
   # Get the DATABASE_URL from addon
   heroku config:get DATABASE_URL
   # Copy the value and set it explicitly (shouldn't be needed, but just in case)
   ```

The fix has been applied in the latest commit. Redeploy and it should work! ✅

