#!/bin/bash
# verify-env.sh - Environment Configuration Verification Script
# This script verifies that all environment variables are properly configured

set -e

echo "🔍 Verifying environment configuration..."
echo "Environment Variables Migration Guide (v0.2.0)"
echo "=============================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check required files exist
echo -e "\n📂 Checking environment files..."
FILES=(
  "apps/frontend/.env.example"
  "apps/backend/.env.example"
  "db/.env.example"
  "infra/.env.example"
)

LOCAL_FILES=(
  "apps/frontend/.env.local"
  "apps/backend/.env.local"
  "db/.env.local"
  "infra/.env.local"
)

# Check example files
for file in "${FILES[@]}"; do
  if [[ -f "$file" ]]; then
    echo -e "${GREEN}✅ $file exists${NC}"
  else
    echo -e "${RED}❌ $file missing${NC}"
  fi
done

echo -e "\n📋 Checking local environment files..."
# Check local files
for file in "${LOCAL_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    echo -e "${GREEN}✅ $file exists${NC}"
  else
    echo -e "${YELLOW}⚠️  $file missing (copy from .env.example)${NC}"
  fi
done

# Check for required variables in each component
echo -e "\n🔑 Checking required variables..."

# Frontend required vars
if [[ -f "apps/frontend/.env.local" ]]; then
  if grep -q "VITE_API_URL" apps/frontend/.env.local; then
    echo -e "${GREEN}✅ Frontend: VITE_API_URL configured${NC}"
  else
    echo -e "${RED}❌ Frontend: VITE_API_URL missing${NC}"
  fi

  if grep -q "VITE_BETTER_AUTH_URL" apps/frontend/.env.local; then
    echo -e "${GREEN}✅ Frontend: VITE_BETTER_AUTH_URL configured${NC}"
  else
    echo -e "${RED}❌ Frontend: VITE_BETTER_AUTH_URL missing${NC}"
  fi
fi

# Backend required vars
if [[ -f "apps/backend/.env.local" ]]; then
  if grep -q "DATABASE_URL" apps/backend/.env.local; then
    echo -e "${GREEN}✅ Backend: DATABASE_URL configured${NC}"
  else
    echo -e "${RED}❌ Backend: DATABASE_URL missing${NC}"
  fi

  if grep -q "BETTER_AUTH_SECRET" apps/backend/.env.local; then
    echo -e "${GREEN}✅ Backend: BETTER_AUTH_SECRET configured${NC}"
  else
    echo -e "${RED}❌ Backend: BETTER_AUTH_SECRET missing${NC}"
  fi

  if grep -q "NODE_ENV" apps/backend/.env.local; then
    echo -e "${GREEN}✅ Backend: NODE_ENV configured${NC}"
  else
    echo -e "${RED}❌ Backend: NODE_ENV missing${NC}"
  fi
fi

# Database required vars
if [[ -f "db/.env.local" ]]; then
  if grep -q "DATABASE_URL" db/.env.local; then
    echo -e "${GREEN}✅ Database: DATABASE_URL configured${NC}"
  else
    echo -e "${RED}❌ Database: DATABASE_URL missing${NC}"
  fi
fi

# Infrastructure vars
if [[ -f "infra/.env.local" ]]; then
  if grep -q "ENVIRONMENT" infra/.env.local; then
    echo -e "${GREEN}✅ Infrastructure: ENVIRONMENT configured${NC}"
  else
    echo -e "${RED}❌ Infrastructure: ENVIRONMENT missing${NC}"
  fi
fi

# Check for deprecated variables that should be removed
echo -e "\n⚠️  Checking for deprecated variables..."

DEPRECATED_VARS=(
  "BETTER_AUTH_AUDIENCE"
  "SESSION_SECRET"
  "PUBLIC_STRIPE_"
)

found_deprecated=false
for var in "${DEPRECATED_VARS[@]}"; do
  if grep -r "$var" apps/ db/ infra/ 2>/dev/null | head -1; then
    echo -e "${YELLOW}⚠️  Found deprecated variable: $var${NC}"
    found_deprecated=true
  fi
done

if ! $found_deprecated; then
  echo -e "${GREEN}✅ No deprecated variables found${NC}"
fi

# Check environment consistency
echo -e "\n🔄 Checking environment consistency..."

# Check if DATABASE_URL is consistent between backend and db
if [[ -f "apps/backend/.env.local" && -f "db/.env.local" ]]; then
  backend_db=$(grep "DATABASE_URL" apps/backend/.env.local 2>/dev/null | cut -d'=' -f2-)
  db_db=$(grep "DATABASE_URL" db/.env.local 2>/dev/null | cut -d'=' -f2-)

  if [[ "$backend_db" == "$db_db" ]]; then
    echo -e "${GREEN}✅ DATABASE_URL consistent between backend and db${NC}"
  else
    echo -e "${RED}❌ DATABASE_URL mismatch between backend and db${NC}"
  fi
fi

# Check if API URLs match between frontend and backend
if [[ -f "apps/frontend/.env.local" && -f "apps/backend/.env.local" ]]; then
  frontend_api=$(grep "VITE_API_URL" apps/frontend/.env.local 2>/dev/null | cut -d'=' -f2-)
  backend_port=$(grep "PORT" apps/backend/.env.local 2>/dev/null | cut -d'=' -f2-)

  if [[ -n "$backend_port" ]]; then
    expected_url="http://localhost:$backend_port"
    if [[ "$frontend_api" == "$expected_url" ]]; then
      echo -e "${GREEN}✅ API URLs match between frontend and backend${NC}"
    else
      echo -e "${YELLOW}⚠️  API URL mismatch: frontend=$frontend_api, expected=$expected_url${NC}"
    fi
  fi
fi

# Migration guide
echo -e "\n📋 Environment Variables Migration Summary"
echo "=========================================="
echo -e "${BLUE}Current Structure (v0.2.0+):${NC}"
echo "├── apps/frontend/.env.local  - Frontend configuration (VITE_* variables)"
echo "├── apps/backend/.env.local   - Backend configuration (auth, server, APIs)"
echo "├── db/.env.local            - Database configuration"
echo "└── infra/.env.local         - Infrastructure configuration (Cloudflare, Supabase)"

echo -e "\n${BLUE}Migration from v0.1.x:${NC}"
echo "1. Backup existing configuration: cp .env .env.backup.v0.1.x"
echo "2. Create new structure: cp .env.example .env.local for each component"
echo "3. Migrate variables to appropriate files"
echo "4. Remove deprecated variables"
echo "5. Test configuration: pnpm dev"

echo -e "\n${BLUE}Quick Setup Commands:${NC}"
echo "cp apps/frontend/.env.example apps/frontend/.env.local"
echo "cp apps/backend/.env.example apps/backend/.env.local"
echo "cp db/.env.example db/.env.local"
echo "cp infra/.env.example infra/.env.local"

echo -e "\n🚀 Next Steps:"
echo "1. Edit each .env.local file with your specific configuration"
echo "2. Run 'pnpm db:generate && pnpm db:migrate && pnpm db:seed'"
echo "3. Run 'pnpm dev' to start development servers"

echo -e "\n✨ Verification complete!"
