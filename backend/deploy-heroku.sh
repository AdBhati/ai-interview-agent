#!/bin/bash

# Heroku Deployment Script
# Run this script to deploy the backend to Heroku

echo "🚀 Starting Heroku Deployment..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first:"
    echo "   brew tap heroku/brew && brew install heroku"
    exit 1
fi

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku:"
    heroku login
fi

# Get app name from user or use default
read -p "Enter Heroku app name (or press Enter for 'ai-interview-backend'): " APP_NAME
APP_NAME=${APP_NAME:-ai-interview-backend}

echo "📦 Creating Heroku app: $APP_NAME"
heroku create $APP_NAME 2>/dev/null || echo "App $APP_NAME already exists or name taken"

echo "🗄️  Adding PostgreSQL database..."
heroku addons:create heroku-postgresql:mini -a $APP_NAME 2>/dev/null || echo "PostgreSQL already added"

echo "📮 Adding Redis..."
heroku addons:create heroku-redis:mini -a $APP_NAME 2>/dev/null || echo "Redis already added"

echo "🔑 Setting environment variables..."

# Generate secret key
SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" 2>/dev/null || echo "django-insecure-change-this-in-production")

heroku config:set SECRET_KEY="$SECRET_KEY" -a $APP_NAME
heroku config:set DEBUG=False -a $APP_NAME
heroku config:set ALLOWED_HOSTS="$APP_NAME.herokuapp.com" -a $APP_NAME

# Set API keys (you'll need to update these)
echo "⚠️  Please set your API keys:"
echo "   heroku config:set OPENROUTER_API_KEY='your-key' -a $APP_NAME"
echo "   heroku config:set SPEECHMATICS_API_KEY='your-key' -a $APP_NAME"
echo "   heroku config:set LITELLM_MODEL='openrouter/anthropic/claude-3-haiku' -a $APP_NAME"

read -p "Do you want to set API keys now? (y/n): " SET_KEYS
if [ "$SET_KEYS" = "y" ]; then
    read -p "Enter OpenRouter API Key: " OPENROUTER_KEY
    read -p "Enter Speechmatics API Key: " SPEECHMATICS_KEY
    heroku config:set OPENROUTER_API_KEY="$OPENROUTER_KEY" -a $APP_NAME
    heroku config:set SPEECHMATICS_API_KEY="$SPEECHMATICS_KEY" -a $APP_NAME
    heroku config:set LITELLM_MODEL="openrouter/anthropic/claude-3-haiku" -a $APP_NAME
fi

echo "📤 Deploying to Heroku..."
git push heroku main || git push heroku master

echo "🔄 Running migrations..."
heroku run python manage.py migrate -a $APP_NAME

echo "📁 Collecting static files..."
heroku run python manage.py collectstatic --noinput -a $APP_NAME

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is live at: https://$APP_NAME.herokuapp.com"
echo "📊 View logs: heroku logs --tail -a $APP_NAME"
echo "🔧 Open dashboard: heroku open -a $APP_NAME"

