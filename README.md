<div align="center">

[English](docs/en/README.md) | [한국어](docs/ko/README.md) | [日本語](docs/ja/README.md) | [简体中文](docs/zh/README.md)

### Taj Chai Web Shop | SaaS Boilerplate Precursors

[![GitHub stars](https://img.shields.io/github/stars/morisono/chai-shop-p?style=social)](https://github.com/morisono/chai-shop-p/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/morisono/chai-shop-p?style=social)](https://github.com/morisono/chai-shop-p/network/members)
[![Build Status](https://img.shields.io/github/actions/workflow/status/morisono/chai-shop-p/ci.yml?branch=main)](https://github.com/morisono/chai-shop-p/actions)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/morisono/chai-shop-p)](package.json)

[Documentation](https://github.com/morisono/chai-shop-p/wiki) | [Demo](https://vite-saas-demo.workers.dev) | [Report Bug](https://github.com/morisono/chai-shop-p/issues) | [Request Feature](https://github.com/morisono/chai-shop-p/issues)

</div>

---

**🚨 IMPORTANT: Environment Variables Migration (v0.2.0)**
If upgrading from v0.1.x, see [MIGRATION.md](MIGRATION.md) for complete migration guide, or run `./verify-env.sh` to check your configuration.

---

## Description

Taj Chai Web Shop is a modern, production-ready SaaS boilerplate built with Vite and React, designed for rapid development and scalability. This comprehensive starter kit includes authentication, payment processing, database integration, and deployment configurations for Cloudflare Workers.

## Motivation

This project enables AI-driven development with minimal overhead — not a boilerplate, just a few configs, instructions, prompts and ideas.

Why it be called "Precursors"? Because it does not provide any opinionated structure or components.

Designed for flexibility, it empowers users to build freely without constraints.

## Key Features

- **Modern Tech Stack** - Vite, React, TypeScript, TailwindCSS
- **Authentication** - Better Auth, Passkeys, WebAuthn support
- **Payment Integration** - Stripe SDK with subscription management
- **Database** - PostgreSQL with Drizzle ORM
- **Deployment Ready** - Cloudflare Workers, Pages, D1, KV
- **Testing Suite** - Vitest, Pactum for API testing
- **AI Integration** - OpenAI GPT-4 API, Agents SDK
- **Internationalization** - i18next for multi-language support
- **Data Visualization** - Chart.js, React Table
- **UI Components** - Radix UI, Framer Motion animations

You can check the full tech stack: [from here](.idea/tech_stack.yaml)

## Installation

<details><summary>Prerequisites</summary>

- Node.js 20+ or Bun
- pnpm (recommended) or npm
- PostgreSQL database
- Cloudflare account (for deployment)

</details>

<details><summary>Quick Start</summary>

1. **Clone the repository**
   ```bash
   git clone https://github.com/morisono/chai-shop-p.git
   cd chai-shop-p
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   **Frontend Configuration:**
   ```bash
   cd apps/frontend/
   cp .env.example .env.local
   ```

   **Backend Configuration:**
   ```bash
   cd apps/backend/
   cp .env.example .env.local
   ```

   **Database Configuration:**
   ```bash
   cp db/.env.example db/.env.local
   ```

   **Infrastructure Configuration:**
   ```bash
   cp infra/.env.example infra/.env.local
   ```

   Edit each `.env.local` file with your specific configuration.

4. **Configure Database Environment**

   In `db/.env.local`, set:
   ```bash
   # Database Configuration
   DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

   # Development Mock Auth Users
   # Use these credentials for development testing:
   # admin@dev:temp123 (admin role)
   # user@dev:temp123 (user role)
   # manager@dev:temp123 (manager role)

   # Audit Configuration
   AUDIT_BATCH_SIZE=100
   AUDIT_FLUSH_INTERVAL=5000
   AUDIT_RETENTION_DAYS=2555
   ```

5. **Configure Infrastructure Environment**

   In `infra/.env.local`, set:
   ```bash
   # Environment Configuration
   ENVIRONMENT=development

   # Cloudflare Configuration
   CF_ACCOUNT_ID=your-cloudflare-account-id
   CF_KV_NAMESPACE=your-kv-namespace-id
   CF_API_TOKEN=your-cloudflare-api-token
   CF_R2_ACCESS_KEY_ID=your-r2-access-key
   CF_R2_SECRET_ACCESS_KEY=your-r2-secret-key
   CF_R2_BUCKET=auth-storage
   CF_WORKERS_API_TOKEN=cf-workers-api-token

   # External Logging (for production)
   CF_LOGPUSH_ENDPOINT=https://logs.example.com/cloudflare
   CF_LOGPUSH_TOKEN=your-logpush-token
   SPLUNK_ENDPOINT=https://splunk.example.com/services/collector
   SPLUNK_TOKEN=your-splunk-token

   # Monitoring and Alerts
   ALERT_WEBHOOK=https://alerts.example.com/webhook

   # Supabase Configuration
   SUPABASE_URL=supabase-url
   SUPABASE_ANON_KEY=supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=supabase-service-role-key
   SUPABASE_FUNCTIONS_URL=https://saas-app.supabase.co/functions/v1
   ```

6. **Configure Frontend Environment**

   In `apps/frontend/.env.local`, set:
   ```bash
   # Better Auth Configuration
   VITE_BETTER_AUTH_URL=http://localhost:3001

   # Application Configuration
   VITE_APP_NAME=Your App Name
   VITE_NODE_ENV=development

   # Backend API URL
   VITE_API_URL=http://localhost:3001

   # Frontend Configuration
   VITE_FRONTEND_URL=http://localhost:5173

   # OAuth Redirect URLs (for client-side reference)
   VITE_GITHUB_REDIRECT_URL=http://localhost:3001/api/auth/callback/github
   VITE_GOOGLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/google
   VITE_APPLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/apple
   VITE_X-TWITTER_REDIRECT_URL=http://localhost:3001/api/auth/callback/x-twitter

   # Development Configuration
   VITE_DEV_MODE=true
   ```

7. **Configure Backend Environment**

   In `apps/backend/.env.local`, set:
   ```bash
   # Application Configuration
   APP_NAME=Your Saas Name
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Server Configuration
   PORT=3001
   HOST=0.0.0.0
   LOG_LEVEL=info
   APP_VERSION=1.0.0
   COOKIE_DOMAIN=localhost

   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name

   # Better Auth Configuration
   BETTER_AUTH_SECRET=your-secret-key-here-use-openssl-rand-base64-32
   BETTER_AUTH_BASE_URL=http://localhost:3001
   BETTER_AUTH_DOMAIN=better-auth-domain

   # OAuth Providers
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   X_TWITTER_CLIENT_ID=your-x-twitter-client-id
   X_TWITTER_CLIENT_SECRET=your-x-twitter-client-secret

   # Stripe Configuration (Development - Test Mode)
   STRIPE_SECRET_KEY=sk_***
   STRIPE_PUBLISHABLE_KEY=pk_***
   STRIPE_WEBHOOK_SECRET=whsec_***

   # Security Configuration
   SESSION_TIMEOUT=900
   REFRESH_TOKEN_LIFETIME=86400
   SECURITY_LEVEL=low
   DEBUG_AUTH=true
   MFA_REQUIRED=false

   # AI Configuration
   OPENAI_API_KEY=openai-api-key
   ANTHROPIC_API_KEY=anthropic-api-key
   GEMINI_API_KEY=gemini-api-key
   DEEPSEEK_API_KEY=deepseek-api-key

   # Rate Limiting Configuration
   RATE_LIMIT_GLOBAL_MAX=100
   RATE_LIMIT_GLOBAL_WINDOW=60
   RATE_LIMIT_SIGNIN_MAX=5
   RATE_LIMIT_SIGNUP_MAX=3
   ```

8. **Run database migrations**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

9. **Start development server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173`

</details>

## Environment Variables Migration Guide

### Recent Changes (v0.2.0)

**⚠️ BREAKING CHANGES**: Environment variables have been restructured for better component separation and security.

<details><summary>Migration from Previous Versions</summary>

**Old Structure (Deprecated - v0.1.x):**
```bash
# All variables in single .env file
DATABASE_URL=...
CF_ACCOUNT_ID=...
GOOGLE_CLIENT_ID=...
BETTER_AUTH_SECRET=...
# ... all other variables mixed together
```

**New Structure (Current - v0.2.0+):**

**Frontend Environment (`apps/frontend/.env.local`):**
```bash
# Better Auth Configuration
VITE_BETTER_AUTH_URL=http://localhost:3001

# Application Configuration
VITE_APP_NAME=Your App Name
VITE_NODE_ENV=development

# Backend API URL
VITE_API_URL=http://localhost:3001
VITE_FRONTEND_URL=http://localhost:5173

# OAuth Redirect URLs (for client-side reference)
VITE_GITHUB_REDIRECT_URL=http://localhost:3001/api/auth/callback/github
VITE_GOOGLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/google
VITE_APPLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/apple
VITE_X-TWITTER_REDIRECT_URL=http://localhost:3001/api/auth/callback/x-twitter

# Development Configuration
VITE_DEV_MODE=true
```

**Backend Environment (`apps/backend/.env.local`):**
```bash
# Application Configuration
APP_NAME=Your Saas Name
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Server Configuration
PORT=3001
HOST=0.0.0.0
LOG_LEVEL=info
APP_VERSION=1.0.0
COOKIE_DOMAIN=localhost

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-use-openssl-rand-base64-32
BETTER_AUTH_BASE_URL=http://localhost:3001
BETTER_AUTH_DOMAIN=better-auth-domain

# OAuth Providers
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
X_TWITTER_CLIENT_ID=your-x-twitter-client-id
X_TWITTER_CLIENT_SECRET=your-x-twitter-client-secret

# Stripe Configuration (Development - Test Mode)
STRIPE_SECRET_KEY=sk_***
STRIPE_PUBLISHABLE_KEY=pk_***
STRIPE_WEBHOOK_SECRET=whsec_***

# Security Configuration
SESSION_TIMEOUT=900
REFRESH_TOKEN_LIFETIME=86400
SECURITY_LEVEL=low
DEBUG_AUTH=true
MFA_REQUIRED=false

# AI Configuration
OPENAI_API_KEY=openai-api-key
ANTHROPIC_API_KEY=anthropic-api-key
GEMINI_API_KEY=gemini-api-key
DEEPSEEK_API_KEY=deepseek-api-key

# Rate Limiting Configuration
RATE_LIMIT_GLOBAL_MAX=100
RATE_LIMIT_GLOBAL_WINDOW=60
RATE_LIMIT_SIGNIN_MAX=5
RATE_LIMIT_SIGNUP_MAX=3
```

**Database Environment (`db/.env.local`):**
```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

# Development Mock Auth Users
# Use these credentials for development testing:
# admin@dev:temp123 (admin role)
# user@dev:temp123 (user role)
# manager@dev:temp123 (manager role)

# Audit Configuration
AUDIT_BATCH_SIZE=100
AUDIT_FLUSH_INTERVAL=5000
AUDIT_RETENTION_DAYS=2555
```

**Infrastructure Environment (`infra/.env.local`):**
```bash
# Environment Configuration
ENVIRONMENT=development

# Cloudflare Configuration
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_KV_NAMESPACE=your-kv-namespace-id
CF_API_TOKEN=your-cloudflare-api-token
CF_R2_ACCESS_KEY_ID=your-r2-access-key
CF_R2_SECRET_ACCESS_KEY=your-r2-secret-key
CF_R2_BUCKET=auth-storage
CF_WORKERS_API_TOKEN=cf-workers-api-token

# External Logging (for production)
CF_LOGPUSH_ENDPOINT=https://logs.example.com/cloudflare
CF_LOGPUSH_TOKEN=your-logpush-token
SPLUNK_ENDPOINT=https://splunk.example.com/services/collector
SPLUNK_TOKEN=your-splunk-token

# Monitoring and Alerts
ALERT_WEBHOOK=https://alerts.example.com/webhook

# Supabase Configuration
SUPABASE_URL=supabase-url
SUPABASE_ANON_KEY=supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=supabase-service-role-key
SUPABASE_FUNCTIONS_URL=https://saas-app.supabase.co/functions/v1
```

**Migration Steps:**

1. **Backup existing configuration:**
   ```bash
   # Backup old configuration
   cp .env .env.backup.v0.1.x
   cp .env.local .env.local.backup.v0.1.x
   ```

2. **Create new directory-specific structure:**
   ```bash
   # Frontend configuration
   cd apps/frontend/
   cp .env.example .env.local

   # Backend configuration
   cd ../backend/
   cp .env.example .env.local

   # Database configuration
   cd ../../db/
   cp .env.example .env.local

   # Infrastructure configuration
   cd ../infra/
   cp .env.example .env.local
   cd ..
   ```

3. **Migrate variables to appropriate files:**
   - **Frontend variables**: Move `VITE_*` variables to `apps/frontend/.env.local`
   - **Backend variables**: Move auth, server, and API variables to `apps/backend/.env.local`
   - **Database variables**: Move `DATABASE_URL` and audit configs to `db/.env.local`
   - **Infrastructure variables**: Move Cloudflare and Supabase variables to `infra/.env.local`

4. **Update scripts and configuration references:**
   - Database scripts now read from `db/.env.local`
   - Infrastructure scripts read from `infra/.env.local`
   - Frontend build processes read from `apps/frontend/.env.local`
   - Backend application reads from `apps/backend/.env.local`

5. **Verify configuration loading:**
   ```bash
   # Test frontend configuration
   cd apps/frontend && pnpm dev:client

   # Test backend configuration
   cd apps/backend && pnpm dev:server

   # Test database connection
   pnpm db:studio
   ```

**⚠️ Deprecated Variables (Remove from v0.1.x configurations):**

The following variables from v0.1.x are now deprecated and should be removed:
- `BETTER_AUTH_AUDIENCE` (replaced with `BETTER_AUTH_DOMAIN`)
- `SESSION_SECRET` (renamed to `BETTER_AUTH_SESSION_SECRET`)
- `PUBLIC_STRIPE_*` (renamed to remove `PUBLIC_` prefix)
- Root-level `DATABASE_URL` (moved to `db/.env.local`)

**Backward Compatibility:**

If you need to maintain compatibility with v0.1.x deployments during migration:

1. Keep old variables in deployment configurations temporarily
2. Use environment-specific overrides in CI/CD pipelines
3. Test thoroughly in staging before removing deprecated variables
4. Update deployment scripts to reference new file locations

**Environment-Specific Considerations:**

- **Development**: Use `.env.local` files (git-ignored)
- **Staging**: Set variables in CI/CD pipeline or hosting platform
- **Production**: Use secure secret management (Cloudflare secrets, etc.)

</details>

### Environment Variable Reference

<details><summary>Complete Variable Reference by Component</summary>

**Frontend Variables (`apps/frontend/.env.local`):**
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_BETTER_AUTH_URL` | Backend auth service URL | `http://localhost:3001` | ✅ |
| `VITE_APP_NAME` | Application display name | `Your App Name` | ❌ |
| `VITE_NODE_ENV` | Environment mode | `development` | ❌ |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001` | ✅ |
| `VITE_FRONTEND_URL` | Frontend base URL | `http://localhost:5173` | ✅ |
| `VITE_DEV_MODE` | Development mode flag | `true` | ❌ |

**Backend Variables (`apps/backend/.env.local`):**
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `APP_NAME` | Application name | `Your Saas Name` | ❌ |
| `NODE_ENV` | Node.js environment | `development` | ✅ |
| `PORT` | Server port | `3001` | ❌ |
| `HOST` | Server host | `0.0.0.0` | ❌ |
| `DATABASE_URL` | PostgreSQL connection string | - | ✅ |
| `BETTER_AUTH_SECRET` | Auth encryption secret | - | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | - | ✅ (for payments) |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | - | ❌ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - | ❌ |
| `OPENAI_API_KEY` | OpenAI API key | - | ❌ |

**Database Variables (`db/.env.local`):**
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | ✅ |
| `AUDIT_BATCH_SIZE` | Audit log batch size | `100` | ❌ |
| `AUDIT_FLUSH_INTERVAL` | Audit flush interval (ms) | `5000` | ❌ |
| `AUDIT_RETENTION_DAYS` | Audit retention period | `2555` | ❌ |

**Infrastructure Variables (`infra/.env.local`):**
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ENVIRONMENT` | Deployment environment | `development` | ✅ |
| `CF_ACCOUNT_ID` | Cloudflare account ID | - | ✅ (for CF deploy) |
| `CF_API_TOKEN` | Cloudflare API token | - | ✅ (for CF deploy) |
| `SUPABASE_URL` | Supabase project URL | - | ❌ |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | - | ❌ |

</details>

### Environment Variables Troubleshooting

<details><summary>Common Issues and Solutions</summary>

**Issue: `Environment variable not found` errors**
```bash
# Solution: Verify all .env.local files exist
ls -la apps/frontend/.env.local
ls -la apps/backend/.env.local
ls -la db/.env.local
ls -la infra/.env.local
```

**Issue: Database connection fails**
```bash
# Solution: Verify DATABASE_URL in both backend and db configs
# Check apps/backend/.env.local and db/.env.local have matching URLs
grep DATABASE_URL apps/backend/.env.local
grep DATABASE_URL db/.env.local
```

**Issue: Frontend can't connect to backend**
```bash
# Solution: Verify API URLs match between frontend and backend
grep VITE_API_URL apps/frontend/.env.local
grep PORT apps/backend/.env.local
# Ensure VITE_API_URL points to http://localhost:{PORT}
```

**Issue: OAuth authentication fails**
```bash
# Solution: Check OAuth provider configuration
grep -E "(GITHUB|GOOGLE|TWITTER|APPLE)_CLIENT" apps/backend/.env.local
# Verify redirect URLs match in OAuth provider settings
```

**Issue: Stripe payments don't work**
```bash
# Solution: Verify Stripe configuration
grep STRIPE_ apps/backend/.env.local
# Ensure using test keys (sk_test_...) for development
```

**Issue: `pnpm dev` fails to start**
```bash
# Solution: Check for missing required variables
pnpm check:env  # If available, or manually verify required vars

# Check logs for specific missing variables
pnpm dev 2>&1 | grep -i "env\|variable\|config"
```

**Issue: Changes not reflected after updating .env files**
```bash
# Solution: Restart development servers
pnpm dev:stop  # Stop all services
pnpm dev       # Restart with new environment
```

**Verification Script:**
Create this script to verify your environment setup:
```bash
#!/bin/bash
# verify-env.sh

echo "🔍 Verifying environment configuration..."

# Check required files exist
FILES=(
  "apps/frontend/.env.local"
  "apps/backend/.env.local"
  "db/.env.local"
  "infra/.env.local"
)

for file in "${FILES[@]}"; do
  if [[ -f "$file" ]]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

# Check for required variables
echo -e "\n📋 Checking required variables..."

# Frontend required vars
if grep -q "VITE_API_URL" apps/frontend/.env.local; then
  echo "✅ Frontend: VITE_API_URL configured"
else
  echo "❌ Frontend: VITE_API_URL missing"
fi

# Backend required vars
if grep -q "DATABASE_URL" apps/backend/.env.local; then
  echo "✅ Backend: DATABASE_URL configured"
else
  echo "❌ Backend: DATABASE_URL missing"
fi

if grep -q "BETTER_AUTH_SECRET" apps/backend/.env.local; then
  echo "✅ Backend: BETTER_AUTH_SECRET configured"
else
  echo "❌ Backend: BETTER_AUTH_SECRET missing"
fi

# Database required vars
if grep -q "DATABASE_URL" db/.env.local; then
  echo "✅ Database: DATABASE_URL configured"
else
  echo "❌ Database: DATABASE_URL missing"
fi

echo -e "\n🚀 Run 'pnpm dev' to start development servers"
```

Run with: `chmod +x verify-env.sh && ./verify-env.sh`

</details>

## Usage

<details><summary>Development Commands</summary>

```bash
# Start development server (both client and server)
pnpm dev

# Start individual services
pnpm dev:client    # Frontend only
pnpm dev:server    # Backend only

# Build for production
pnpm build

# Build individual components
pnpm build:client    # Frontend
pnpm build:server    # Backend
pnpm build:drizzle   # Database
pnpm build:zod       # Validation schemas

# Run tests
pnpm test

# Run linting and formatting
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check

# Type checking and dependency analysis
pnpm check-types
pnpm check:unused
pnpm check:deps
pnpm check:all

# Database operations
pnpm db:generate    # Generate migrations
pnpm db:migrate     # Run migrations
pnpm db:push        # Push schema changes
pnpm db:seed        # Seed database
pnpm db:studio      # Open Drizzle Studio

# Storybook development
pnpm storybook
pnpm storybook:build
```

</details>

<details><summary>Frontend Development</summary>

The frontend is built with Vite and React, providing:

```tsx
// Example component with authentication
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}
```

**Development Server:**
```bash
pnpm dev:client
# Runs on http://localhost:5173
```

</details>

<details><summary>API Development</summary>

The API is built with Cloudflare Workers:

```typescript
// Example API handler
import { createHandler } from '@/utils/handler'

export const getUserProfile = createHandler(async (request, env) => {
  const userId = await validateAuth(request)
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })
  return Response.json(user)
})
```

**Development Server:**
```bash
pnpm dev:server
# Runs on http://localhost:3001
```

</details>

<details><summary>Database Development</summary>

Database operations using Drizzle ORM:

```typescript
// Example database query
import { db } from '@/db'
import { users } from '@/db/orm/users'

// Create user
const newUser = await db.insert(users).values({
  email: 'user@example.com',
  name: 'John Doe'
}).returning()

// Query users
const allUsers = await db.select().from(users)
```

**Database Commands:**
```bash
# Generate new migration
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Open database studio
pnpm db:studio
```

</details>

<details><summary>Deployment</summary>

Deploy to Cloudflare:

```bash
# Deploy everything
pnpm deploy

# Deploy individual components
pnpm deploy:api        # Backend API
pnpm deploy:frontend   # Frontend app

# Environment-specific deployments
NODE_ENV=production pnpm deploy
NODE_ENV=staging pnpm deploy
```

**Environment Configuration for Deployment:**

Ensure your production environment variables are set in:
- Cloudflare Workers dashboard for API
- Cloudflare Pages dashboard for frontend
- Database provider for database connections

</details>

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

<details><summary>Development Workflow</summary>

1. **Fork/Clone the repository:**
   ```bash
   git clone https://github.com/morisono/chai-shop-p.git
   cd chai-shop-p
   ```

2. **Create worktree (recommended):**
   ```bash
   git worktree add -b feature/123 .worktrees/feature/123 origin/main
   ```

3. **Set up environment:**
   ```bash
   cd .worktrees/feature/123
   pnpm install

   # Set up all environment files
   cp apps/frontend/.env.example apps/frontend/.env.local
   cp apps/backend/.env.example apps/backend/.env.local
   cp db/.env.example db/.env.local
   cp infra/.env.example infra/.env.local
   ```

4. **Make changes following our coding standards:**
   ```bash
   $EDITOR .worktrees/feature/123
   ```

5. **Run tests and linting:**
   ```bash
   pnpm test
   pnpm lint
   pnpm check:all
   ```

6. **Commit and push:**
   ```bash
   git commit -m 'feat: add amazing feature'
   git push origin feature/123
   ```

7. **Open Pull Request:**
   ```bash
   gh pr create
   ```

**Common Development Tasks:**

```bash
# New Feature: create worktree, code, test, push
git worktree add -b feature/new-auth .worktrees/feature/new-auth origin/main

# Code Review: rebase onto main, run linters, open PR
git rebase origin/main
pnpm lint:fix
gh pr create

# Major Update: branch from release, update version, merge back to main
git checkout -b release/v1.1.0
npm version minor
git merge main
```

For more details, see our [Git Flow Rules](.github/instructions/git-flow-rules.instructions.md).

</details>

<details><summary>Code Standards</summary>

- **TypeScript** for type safety
- **Biome** for linting and formatting
- **Conventional Commits** for commit messages
- **Component Testing** with Vitest
- **End-to-End Testing** with Playwright

**Code Quality Checks:**
```bash
pnpm check:all          # Run all checks
pnpm check-types        # TypeScript type checking
pnpm check:unused       # Find unused code
pnpm check:deps         # Check circular dependencies
```

For more details, see our [Project Rules](.github/prompts/essential/project_rules.yaml).

</details>

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/) - Lightning fast build tool
- [React](https://reactjs.org/) - UI library
- [Cloudflare](https://cloudflare.com/) - Edge computing platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://radix-ui.com/) - Accessible component primitives
- [Stripe](https://stripe.com/) - Payment processing
- [Better Auth](https://better-auth.com/) - Authentication platform
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [PostgreSQL](https://postgresql.org/) - Database
- [Biome](https://biomejs.dev/) - Toolchain for web projects

---

<div align="center">
Made with ❤️ by the community
</div>
