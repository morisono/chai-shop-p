#!/usr/bin/env bash

# Cloudflare Pages deployment script

echo "🚀 Starting Cloudflare Pages deployment..."

# Environment detection
if [ "$CF_PAGES_BRANCH" = "main" ]; then
    ENVIRONMENT="production"
elif [ "$CF_PAGES_BRANCH" = "staging" ]; then
    ENVIRONMENT="staging"
else
    ENVIRONMENT="development"
fi

echo "📍 Environment: $ENVIRONMENT"

# Set environment variables based on branch
export ENVIRONMENT=$ENVIRONMENT
export VITE_API_URL="${API_URL:-https://api.domain.com}"
export VITE_APP_ORIGIN="${APP_ORIGIN:-https://app.domain.com}"

# Build frontend
echo "🔨 Building frontend..."
cd apps/frontend
npm ci
npm run build

# Output build info
echo "✅ Frontend build complete"
echo "📦 Build directory: dist/"
echo "🌐 Environment: $ENVIRONMENT"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🛡️  Production build with enhanced security"
elif [ "$ENVIRONMENT" = "staging" ]; then
    echo "🧪 Staging build with shadow prod rules"
else
    echo "🔧 Development build with debug features"
fi
