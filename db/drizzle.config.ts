import { defineConfig } from 'drizzle-kit';
import { getEnv, getEnvBoolean, validate } from './lib/environment';

// Validate required environment variables
validate.required(['DATABASE_URL']);

export default defineConfig({
  out: './migrations',
  schema: './orm/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: getEnv('DATABASE_URL'),
  },
  verbose: getEnvBoolean('DRIZZLE_VERBOSE', true),
  strict: getEnvBoolean('DRIZZLE_STRICT', true),
});