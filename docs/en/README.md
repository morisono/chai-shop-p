<div align="center">

[English](README.md) | [한국어](../ko/README.md) | [日本語](../ja/README.md) | [简体中文](../zh/README.md)

### Taj Chai Web Shop | SaaS Boilerplate Precursors

[![GitHub stars](https://img.shields.io/github/stars/morisono/chai-shop-p?style=social)](https://github.com/morisono/chai-shop-p/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/morisono/chai-shop-p?style=social)](https://github.com/morisono/chai-shop-p/network/members)
[![Build Status](https://img.shields.io/github/actions/workflow/status/morisono/chai-shop-p/ci.yml?branch=main)](https://github.com/morisono/chai-shop-p/actions)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/morisono/chai-shop-p)](package.json)

[Documentation](https://github.com/morisono/chai-shop-p/wiki) | [Demo](https://vite-saas-demo.workers.dev) | [Report Bug](https://github.com/morisono/chai-shop-p/issues) | [Request Feature](https://github.com/morisono/chai-shop-p/issues)

</div>


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

You can check the full tech stack: [from here](../../.idea/tech_stack.yaml)

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

   **Application Level Configuration:**
   ```bash
   pushd apps/frontend/
   cp .env.example .env
   popd

   pushd apps/backend/
   cp .env.example .env
   popd
   ```

   **Database Configuration:**
   ```bash
   cp db/.env.example db/.env
   ```

   **Infrastructure Configuration:**
   ```bash
   cp infra/.env.example infra/.env
   ```

   Edit each `.env` file with your specific configuration.

4. **Configure Database Environment**


   1. In `db/.env`, set:
      ```bash
      # Database Configuration
      DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

      # Audit Configuration
      AUDIT_BATCH_SIZE=100
      AUDIT_FLUSH_INTERVAL=5000
      AUDIT_RETENTION_DAYS=2555
      ```

   1. Configure `wrangler.jsonc`

   1. Create a Hyperdrive

      ```bash
      DATABASE_URL=postgresql://user:password@localhost:5432/auth_db # Your Database URL
      npx wrangler hyperdrive create my-first-hyperdrive --connection-string=$DATABASE_URL
      ```

      For more information, see [Hyperdrive documentation](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/).


5. **Configure Infrastructure Environment**

   In `infra/.env`, set:
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

   # Supabase Configuration
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

6. **Run database migrations**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:push # Push the database schema
   pnpm db:seed # Seed the database with initial data
   ```

7. **Start development server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173`

### Alternative: Local Postgre SQL Database

1. **Install PostgreSQL**: Follow the [official installation guide](https://www.postgresql.org/download/) for your operating system.

2. **Start PostgreSQL**: Ensure the PostgreSQL service is running.

3. **Create a Database**: Use the following command to create a new database:
   ```bash
   createdb auth_db
   ```

4. **Configure Environment Variables**: Update your `.env` file with the local database connection details:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
   ```

5. **Run Database Migrations**: Execute the following commands to set up the database schema:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:push # Push the database schema
   pnpm db:seed # Seed the database with initial data
   ```

6. **Start Development Server**: Launch the development server with:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173`

</details>

## Environment Variables Migration Guide

### Recent Changes (v0.1.0)

**⚠️ BREAKING CHANGES**: Environment variables have been restructured for better component separation.

<details><summary>Migration from Previous Versions</summary>

**Old Structure (Deprecated):**
```bash
# All variables in single .env file
DATABASE_URL=...
CF_ACCOUNT_ID=...
GOOGLE_CLIENT_ID=...
# ... all other variables
```

**New Structure (Current):**

**Root `.env`:**
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

# Server Configuration
PORT=3001
HOST=0.0.0.0
LOG_LEVEL=info
APP_VERSION=1.0.0

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

**Database `db/.env`:**
```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

# Audit Configuration
AUDIT_BATCH_SIZE=100
AUDIT_FLUSH_INTERVAL=5000
AUDIT_RETENTION_DAYS=2555

# Development Mock Auth Users
# admin@dev:temp123 (admin role)
# user@dev:temp123 (user role)
# manager@dev:temp123 (manager role)
```

**Infrastructure `infra/.env`:**
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

# External Logging (for production)
CF_LOGPUSH_ENDPOINT=https://logs.example.com/cloudflare
CF_LOGPUSH_TOKEN=your-logpush-token
SPLUNK_ENDPOINT=https://splunk.example.com/services/collector
SPLUNK_TOKEN=your-splunk-token

# Monitoring and Alerts
ALERT_WEBHOOK=https://alerts.example.com/webhook

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_FUNCTIONS_URL=https://supabase-project.supabase.co/functions/v1
```

**Migration Steps:**

1. **Backup existing configuration:**
   ```bash
   cp .env .env.backup
   ```

2. **Create new structure:**
   ```bash
   cp .env.example .env
   cp db/.env.example db/.env
   cp infra/.env.example infra/.env
   ```

3. **Migrate variables to appropriate files:**
   - Move database-related variables to `db/.env`
   - Move Cloudflare/Supabase variables to `infra/.env`
   - Keep auth and server variables in root `.env`

4. **Update scripts and imports:**
   - Database scripts now read from `db/.env`
   - Infrastructure scripts read from `infra/.env`
   - Main application reads from root `.env`

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
   cp .env.example .env
   cp db/.env.example db/.env
   cp infra/.env.example infra/.env
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

For more details, see our [Git Flow Rules](../../.github/instructions/git-flow-rules.instructions.md).

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

For more details, see our [Project Rules](../../.github/prompts/essential/project_rules.yaml).

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
