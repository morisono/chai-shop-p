# Environment Variables Migration Guide

## Overview

This document provides comprehensive migration instructions for the recent environment variable restructuring in Taj Chai Web Shop (v0.1.0). The changes improve component separation and maintainability.

## Breaking Changes Summary

**⚠️ CRITICAL**: Environment variables have been reorganized from a single `.env` file to component-specific configuration files.

### Migration Required For:
- Database configuration (`db/.env.local`)
- Infrastructure configuration (`infra/.env.local`)
- Application configuration (root `.env.local`)

## Directory Structure Changes

### Before (Deprecated)
```
project-root/
├── .env.local                 # All variables
├── .env.example              # All example variables
└── ...
```

### After (Current)
```
project-root/
├── .env.local                 # App-specific variables
├── .env.example              # App-specific examples
├── db/
│   ├── .env.local            # Database variables
│   └── .env.example          # Database examples
├── infra/
│   ├── .env.local            # Infrastructure variables
│   └── .env.example          # Infrastructure examples
└── ...
```

## Variable Mapping

### Root Application Variables (`.env.local`)
```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_DOMAIN=localhost
BETTER_AUTH_AUDIENCE=http://localhost:5173

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
X_TWITTER_CLIENT_ID=your-twitter-client-id
X_TWITTER_CLIENT_SECRET=your-twitter-client-secret

# Security Configuration
SESSION_TIMEOUT=900
REFRESH_TOKEN_LIFETIME=86400
SECURITY_LEVEL=low
DEBUG_AUTH=true
MFA_REQUIRED=false

# Rate Limiting
# Note: Moved audit configuration to db/.env.local

# Server Configuration
PORT=3001
HOST=0.0.0.0
LOG_LEVEL=info
APP_VERSION=1.0.0

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

### Database Variables (`db/.env.local`)
```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

# Audit Configuration (moved from root)
AUDIT_BATCH_SIZE=100
AUDIT_FLUSH_INTERVAL=5000
AUDIT_RETENTION_DAYS=2555

# Development Mock Auth Users
# Use these credentials for development testing:
# admin@dev:temp123 (admin role)
# user@dev:temp123 (user role)
# manager@dev:temp123 (manager role)
```

### Infrastructure Variables (`infra/.env.local`)
```bash
# Environment Configuration
ENVIRONMENT=development

# Cloudflare Configuration (moved from root)
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_KV_NAMESPACE=your-kv-namespace-id
CF_API_TOKEN=your-cloudflare-api-token
CF_R2_ACCESS_KEY_ID=your-r2-access-key
CF_R2_SECRET_ACCESS_KEY=your-r2-secret-key
CF_R2_BUCKET=auth-storage

# Cloudflare Workers (new addition)
CF_WORKERS_API_TOKEN=your-workers-api-token

# External Logging (for production)
CF_LOGPUSH_ENDPOINT=https://logs.example.com/cloudflare
CF_LOGPUSH_TOKEN=your-logpush-token
SPLUNK_ENDPOINT=https://splunk.example.com/services/collector
SPLUNK_TOKEN=your-splunk-token

# Monitoring and Alerts
ALERT_WEBHOOK=https://alerts.example.com/webhook

# Supabase Configuration (moved from root)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_FUNCTIONS_URL=https://supabase-project.supabase.co/functions/v1
```

## Step-by-Step Migration

### Step 1: Backup Current Configuration
```bash
# Backup your current environment file
cp .env.local .env.backup.$(date +%Y%m%d)

# List all current variables for reference
cat .env.local > migration-reference.txt
```

### Step 2: Create New Structure
```bash
# Copy template files
cp .env.example .env.local
cp db/.env.example db/.env.local
cp infra/.env.example infra/.env.local
```

### Step 3: Migrate Variables by Category

**Authentication & Server Variables** → Root `.env.local`:
- `BETTER_AUTH_*`
- `GOOGLE_CLIENT_*`
- `X_TWITTER_CLIENT_*`
- `SESSION_*`
- `REFRESH_TOKEN_*`
- `SECURITY_*`
- `DEBUG_*`
- `MFA_*`
- `PORT`
- `HOST`
- `LOG_LEVEL`
- `APP_VERSION`
- `FRONTEND_URL`

**Database Variables** → `db/.env.local`:
- `DATABASE_URL`
- `AUDIT_*`

**Infrastructure Variables** → `infra/.env.local`:
- `ENVIRONMENT`
- `CF_*`
- `SUPABASE_*`
- `*_ENDPOINT`
- `*_TOKEN` (logging/monitoring)
- `ALERT_*`

### Step 4: Update Application Configuration

**Database Scripts** now read from `db/.env.local`:
```bash
# These commands now automatically use db/.env.local
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:seed
pnpm db:studio
```

**Infrastructure Scripts** read from `infra/.env.local`:
```bash
# Cloudflare deployments use infra/.env.local
pnpm deploy:api
pnpm deploy:frontend
```

### Step 5: Verify Migration
```bash
# Test database connection
pnpm db:generate

# Test application startup
pnpm dev

# Verify all services start correctly
pnpm dev:client
pnpm dev:server
```

## Deprecated Variables

### Removed Variables
These variables are no longer used:

```bash
# Old variable names (no longer supported)
OLD_DATABASE_URL          # Use DATABASE_URL in db/.env.local
LEGACY_AUTH_KEY          # Use BETTER_AUTH_SECRET
VITE_API_URL             # Use FRONTEND_URL
```

### Changed Variable Names
```bash
# Old → New
CLOUDFLARE_ACCOUNT_ID    → CF_ACCOUNT_ID
CLOUDFLARE_API_TOKEN     → CF_API_TOKEN
SUPABASE_PROJECT_URL     → SUPABASE_URL
```

## Backward Compatibility

### Supported Until v0.2.0
- Root `.env.local` with all variables (with deprecation warnings)
- Legacy variable names will show console warnings

### Removed in v0.2.0
- Support for single `.env.local` file
- Legacy variable name support
- Automatic variable migration

## Environment Loading Order

1. **Component-specific** files (highest priority)
   - `db/.env.local`
   - `infra/.env.local`

2. **Application-level** files
   - Root `.env.local`

3. **Default/Example** files (lowest priority)
   - `.env.example` files

## Development vs Production

### Development Setup
```bash
# Local development
cp .env.example .env.local
cp db/.env.example db/.env.local
cp infra/.env.example infra/.env.local

# Edit with local values
DATABASE_URL=postgresql://localhost:5432/auth_db_dev
ENVIRONMENT=development
```

### Production Setup
```bash
# Production deployment
# Set in Cloudflare Workers dashboard:
CF_ACCOUNT_ID=prod-account-id
CF_R2_BUCKET=prod-auth-storage

# Set in database provider:
DATABASE_URL=postgresql://prod-server:5432/auth_db_prod

# Set in application environment:
BETTER_AUTH_SECRET=prod-secret-key
ENVIRONMENT=production
```

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check db/.env.local exists and has DATABASE_URL
ls -la db/.env.local
grep DATABASE_URL db/.env.local
```

**2. Cloudflare Deploy Failed**
```bash
# Verify infra/.env.local has CF_* variables
grep "CF_" infra/.env.local
```

**3. Authentication Not Working**
```bash
# Check root .env.local has BETTER_AUTH_SECRET
grep "BETTER_AUTH_SECRET" .env.local
```

### Validation Commands
```bash
# Validate all environment files exist
test -f .env.local && echo "✓ Root config exists"
test -f db/.env.local && echo "✓ DB config exists"
test -f infra/.env.local && echo "✓ Infra config exists"

# Check critical variables
grep -q "DATABASE_URL" db/.env.local && echo "✓ DB URL configured"
grep -q "CF_ACCOUNT_ID" infra/.env.local && echo "✓ CF configured"
grep -q "BETTER_AUTH_SECRET" .env.local && echo "✓ Auth configured"
```

## Support

For migration assistance:
- Review [project documentation](../README.md)
- Check [GitHub issues](https://github.com/morisono/chai-shop-p/issues)
- Refer to component-specific `.env.example` files

## Rollback Procedure

If migration fails:
```bash
# Restore backup
cp .env.backup.YYYYMMDD .env.local

# Remove new structure (optional)
rm db/.env.local infra/.env.local

# Use git to revert if needed
git checkout HEAD -- .env.example db/.env.example infra/.env.example
```

---

**Last Updated**: August 1, 2025
**Version**: 0.1.0
**Status**: Current
