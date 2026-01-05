#!/bin/bash

# Script to set all required environment variables on Heroku
# Usage: ./set-heroku-env.sh <app-name>

APP_NAME=${1:-ai-interview-agent-4b4b22e44ca7}

echo "🔧 Setting environment variables for Heroku app: $APP_NAME"
echo ""

# Generate a secure Django secret key
SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" 2>/dev/null || echo "django-insecure-change-this-in-production-$(date +%s)")

echo "📝 Setting configuration variables..."
heroku config:set --app $APP_NAME \
  SECRET_KEY="$SECRET_KEY" \
  DEBUG=False \
  OPENROUTER_API_KEY="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" \
  SPEECHMATICS_API_KEY="Ryl08sNvAl6RSnFGysmFrxvFKslANJW4" \
  LITELLM_MODEL="openrouter/anthropic/claude-3-haiku"

echo ""
echo "✅ Environment variables set!"
echo ""
echo "📋 Current configuration:"
heroku config --app $APP_NAME

echo ""
echo "💡 Note: DATABASE_URL and REDIS_URL are automatically set by Heroku addons."
echo "   Make sure you have:"
echo "   - heroku-postgresql addon (sets DATABASE_URL)"
echo "   - heroku-redis addon (sets REDIS_URL)"

