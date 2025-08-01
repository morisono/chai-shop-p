# Native Environment Variable Management

⚠️ **UPDATED FOR v0.1.0**: This document reflects the new component-separated environment variable structure. See [Environment Variables Migration Guide](./environment-variables-migration.md) for upgrade instructions.

This project implements a zero-dependency, platform-agnostic environment variable management system that automatically detects deployment platforms and loads variables from appropriate sources across multiple component directories.

## Features

- ✅ **Zero Dependencies**: No need for `dotenv` or other external packages
- ✅ **Component Separation**: Separate environment files for database, infrastructure, and app
- ✅ **Platform Agnostic**: Works with Cloudflare, Vercel, Netlify, Railway, and local development
- ✅ **Type Safe**: Full TypeScript support with type validation
- ✅ **Secure Defaults**: Development-only fallbacks with production safeguards
- ✅ **Automatic Detection**: Automatically detects deployment platform
- ✅ **Modern Deployment Ready**: Compatible with containers, serverless, and edge computing

## Environment File Structure

### New Structure (v0.1.0+)
```
project-root/
├── .env.local                 # App-level variables (auth, server config)
├── db/
│   └── .env.local            # Database variables
├── infra/
│   └── .env.local            # Infrastructure variables (Cloudflare, Supabase)
└── ...
```

### Component-Specific Variables

**Root Application** (`.env.local`):
- Authentication (Better Auth, OAuth)
- Server configuration (PORT, HOST, LOG_LEVEL)
- Security settings
- Frontend URLs

**Database** (`db/.env.local`):
- Database connection URLs
- Audit configuration
- Development mock data

**Infrastructure** (`infra/.env.local`):
- Cloudflare settings
- Supabase configuration
- External logging and monitoring

## Platform Support

### Supported Platforms
- **Cloudflare Workers/Pages**: Access to environment variables and bindings
- **Vercel**: Serverless functions and edge runtime
- **Netlify**: Functions and edge functions
- **Railway**: Container deployments
- **Local Development**: Node.js environment with secure defaults

## Usage

### Basic Environment Variable Access

```typescript
import { getEnv, getEnvNumber, getEnvBoolean } from '@/db/lib/environment';

// String variables
const databaseUrl = getEnv('DATABASE_URL');

// Numeric variables with defaults
const port = getEnvNumber('PORT', 3000);

// Boolean variables
const debugMode = getEnvBoolean('DEBUG', false);
```

### Complete Configuration

```typescript
import { getEnvironmentConfig, validate } from '@/db/lib/environment';

// Validate required variables
validate.required(['DATABASE_URL', 'API_KEY']);

// Get type-safe configuration
const config = getEnvironmentConfig();
// config.DATABASE_URL, config.AUDIT_BATCH_SIZE, etc.
```

### Platform Detection

```typescript
import { Platform } from '@/db/lib/environment';

if (Platform.isCloudflare()) {
  // Cloudflare-specific configuration
  const workerConfig = {
    environment: getEnv('ENVIRONMENT'),
    kv: getEnv('KV_NAMESPACE'),
  };
}

if (Platform.isDevelopment()) {
  // Development-only features
  debugEnvironment();
}
```

## Environment Variable Hierarchy

The system loads variables in this priority order:

1. **Runtime Environment** (`process.env`)
2. **Platform-Specific Sources** (Cloudflare bindings, etc.)
3. **Development Defaults** (development only)
4. **Explicit Fallbacks** (if provided)

## Development Setup

### No Setup Required

The system automatically provides secure development defaults:

```typescript
// These are automatically available in development
DATABASE_URL: 'postgresql://user:password@localhost:5432/auth_db'
AUDIT_BATCH_SIZE: 100
AUDIT_FLUSH_INTERVAL: 5000
AUDIT_RETENTION_DAYS: 2555
DEBUG: true
```

### Optional: Environment File

You can still use `.env` files for development if you prefer:

```bash
# db/.env (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
AUDIT_BATCH_SIZE=100
```

## Production Deployment

### Cloudflare

Set variables in `wrangler.toml`:

```toml
[env.production.vars]
DATABASE_URL = "your-production-database-url"
AUDIT_BATCH_SIZE = "500"
ENVIRONMENT = "production"
```

### Vercel

Set in dashboard or use `.env.production`:

```bash
DATABASE_URL=your-production-database-url
AUDIT_BATCH_SIZE=500
```

### Other Platforms

Set standard environment variables in your deployment platform.

## API Reference

### Core Functions

#### `getEnv(key: string, fallback?: string): string`
Get environment variable with optional fallback.

#### `getEnvNumber(key: string, fallback?: number): number`
Get numeric environment variable with validation.

#### `getEnvBoolean(key: string, fallback?: boolean): boolean`
Get boolean environment variable (supports 'true', '1', 'yes', 'on').

#### `getEnvironmentConfig(): EnvironmentConfig`
Get complete, validated environment configuration.

### Platform Detection

#### `Platform.current(): string`
Returns current platform: 'cloudflare', 'vercel', 'netlify', 'railway', or 'local'.

#### `Platform.isDevelopment(): boolean`
Check if running in development environment.

#### `Platform.isProduction(): boolean`
Check if running in production environment.

### Validation

#### `validate.required(keys: string[]): void`
Ensure required environment variables are present.

#### `validate.environment(): EnvironmentConfig`
Validate complete environment configuration.

#### `validate.databaseUrl(url: string): boolean`
Validate database URL format.

### Development Utilities

#### `debugEnvironment(): void`
Log current environment configuration (development only).

## Examples

### Database Connection

```typescript
import { getEnv, validate } from '@/db/lib/environment';

export async function connectDatabase() {
  // Validate required variables
  validate.required(['DATABASE_URL']);

  const url = getEnv('DATABASE_URL');
  // Connect to database...
}
```

### Drizzle Configuration

```typescript
import { defineConfig } from 'drizzle-kit';
import { getEnv, getEnvBoolean, validate } from './lib/environment';

validate.required(['DATABASE_URL']);

export default defineConfig({
  schema: './orm/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: getEnv('DATABASE_URL'),
  },
  verbose: getEnvBoolean('DRIZZLE_VERBOSE', true),
});
```

### Application Initialization

```typescript
import { initializeApp } from '@/db/examples/environment-usage';

// This handles all environment setup automatically
const app = initializeApp();
console.log('Database:', app.database.connected);
console.log('Platform:', app.platform.runtime);
```

## Best Practices

1. **Always Validate**: Use `validate.required()` for critical variables
2. **Use Type Helpers**: Use `getEnvNumber()`, `getEnvBoolean()` for type safety
3. **Platform Awareness**: Check platform capabilities with `Platform` utilities
4. **Secure Defaults**: Development defaults are secure and isolated
5. **Error Handling**: Handle missing variables gracefully in production

## Migration from dotenv

To migrate from `dotenv`:

1. Remove `dotenv` dependency and imports
2. Replace `process.env.VAR` with `getEnv('VAR')`
3. Add validation with `validate.required()`
4. Use type helpers for non-string variables

```typescript
// Before
import 'dotenv/config';
const port = Number(process.env.PORT) || 3000;

// After
import { getEnvNumber } from '@/db/lib/environment';
const port = getEnvNumber('PORT', 3000);
```

## Security Considerations

- Development defaults are only active in development environments
- Production requires explicit environment variable configuration
- Database URLs are masked in debug output
- Validation prevents common configuration errors

## Troubleshooting

### "Environment variable not found"

1. Check variable name spelling
2. Verify platform-specific configuration
3. Use `debugEnvironment()` in development to inspect variables
4. Ensure variable is set in your deployment platform

### "Invalid DATABASE_URL format"

Use the format: `postgresql://user:password@host:port/database`

### Platform not detected correctly

Environment detection uses these checks:
- Cloudflare: `globalThis.ENVIRONMENT`
- Vercel: `process.env.VERCEL`
- Netlify: `process.env.NETLIFY`
- Railway: `process.env.RAILWAY_ENVIRONMENT`
