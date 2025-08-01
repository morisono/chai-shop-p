import { defineConfig } from 'drizzle-kit';


if (!process.env.DATABASE_URL!) {
  throw new Error("databaseUrl is not defined. Make sure server.env is loaded.")
}

export default defineConfig({
  out: './db/migrations',
  schema: './db/models/**/*.ts',  // or ./db/orm/**/*.ts
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  verbose: true,
  strict: true,
});