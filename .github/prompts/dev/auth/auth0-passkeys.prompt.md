---
mode: 'agent'
tools: ['githubRepo', 'codebase']
description: 'Refactor authentication to use Auth0.js, SimpleWebAuthn, Drizzle ORM, Vite.js, and deploy on Cloudflare Workers/Pages'
---

Refactor the existing authentication to use Auth0.js (OAuth), SimpleWebAuthn (Passkeys), Drizzle ORM, Vite.js and deploy on Cloudflare Workers/Pages, ensuring compatibility with your current User model and database schema.

Implement environment-specific security posture and automated compliance for auth flows.
- Dev: mock auth accepting (e.g. “admin@dev:temp123”, `DEBUG_TOKEN_*`, `SESSION_DEV_*`), simulating RBAC roles & expiry. Redact secrets in logs.
- Staging: toggleable “shadow prod” rules via ENV flag; accept `X-Env-Override` (RSA-signed by CI vault) for pen-test. Mirror prod RBAC & ABAC with test cohorts.
- Prod: cookie-session (`__Host-`, `SameSite=Strict`, 15m timeout) + HMAC JWT access (15m) + ECDSA refresh (7d), context-aware MFA (device fingerprint, geo-velocity), CIDR allowlist updated via TAXII feeds.

Apply cross-cutting security controls and observability.
- RBAC/ABAC engine (tenant > team > user) using Prisma policies.
- FIDO2 WebAuthn enforced on critical routes; adaptive rate-limiting (sliding window + token bucket) on login & API.
- OWASP Top 10 pen-test suite in CI; block reused passwords (`similar_to_prev_5`), session concurrency limits, BREACH-resistant headers.
- Inject cryptographic env-fingerprint into all tokens/headers; automated canary analysis for auth subsystems with rollback on health-check failure.
- Real-time audit logs (Kappa streaming → immutable cold store); surface alerts to Cloudflare Logpush & Splunk.

Configure with these optimized parameters:

```yaml
authentication:
  auth0:
    sdk: "auth0.js@2.x"
    domain: "${AUTH0_DOMAIN}"
    client_id: "${AUTH0_CLIENT_ID}"
    client_secret: "${AUTH0_CLIENT_SECRET}"
    audience: "${AUTH0_AUDIENCE}"
    scope: "openid profile email"
    redirect_uri: "https://app.domain.com/callback"
    session:
      storage: "cookie"
      secret: "${AUTH0_SESSION_SECRET}"
      lifespan: 30d
      rolling: true
  webauthn:
    server:
      module: "@simplewebauthn/server"
      rpName: "My App"
      rpID: "app.domain.com"
      origin: "https://app.domain.com"
      requireResidentKey: false
      userVerification: "preferred"
      timeout: 60000
    client:
      module: "@simplewebauthn/browser"
      timeout: 60000
  connections:
    google-oauth2:
      enabled: true
      client_id: "${GOOGLE_CLIENT_ID}"
      client_secret: "${GOOGLE_CLIENT_SECRET}"
      tenant_domain: null
      allow_domains:
        - "company.com"
    twitter:
      enabled: true
      client_id: "${TWITTER_CLIENT_ID}"
      client_secret: "${TWITTER_CLIENT_SECRET}"
      scope:
        - "tweet.read"
        - "users.read"
        - "email"
    github:
      enabled: false
    facebook:
      enabled: false
  passkeys:
    enable: true
    attestation: "direct"
    challengeLength: 32
database:
  drizzle:
    client: "pg"
    connectionString: "${DATABASE_URL}"
    schemaFile: "db/schema.ts"
    migrations: "db/migrations"
    pool:
      min: 2
      max: 10
      idleTimeout: 30000
build:
  vite:
    framework: "vite@4.x"
    plugins:
      - "@auth0/auth0-spa-js"
      - "vite-plugin-simplewebauthn-client"
    define:
      __APP_ORIGIN__: '"https://app.domain.com"'
    server:
      fs:
        strict: false
deploy:
  cloudflare:
    workers:
      script: "dist/worker.mjs"
      route: "https://api.domain.com/*"
      compatibilityDate: "2025-07-05"
      bindings:
        - name: "KV"
          type: "env"
          namespace: "${CF_KV_NAMESPACE}"
        - name: "AUTH0_SECRET"
          type: "secret"
    pages:
      projectName: "my-app"
      branch: "main"
      accountId: "${CF_ACCOUNT_ID}"
      accountToken: "${CF_API_TOKEN}"
security:
  cors:
    origin: ["https://*.domain.com"]
    methods: ["GET","POST","PUT","DELETE"]
    credentials: true
  csrf:
    enabled: true
    doubleSubmit: false
  headers:
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data:; script-src 'self'"
  dataProtection:
    inTransit: "TLS1.3"
    atRest: "AES-256-GCM"
  cookies:
    secure: true
    sameSite: "Lax"
  multi_factor: false
  csp:
    default-src: "default-src 'self'; script-src 'self' https://cdn.auth0.com"
  tls:
    minVersion: "TLSv1.3"

hooks:
  preAuth: "src/hooks/preAuth.ts"
  postAuth: "src/hooks/postAuth.ts"
routes:
  auth:
    login: "/api/auth/login"
    callback: "/api/auth/callback"
    logout: "/api/auth/logout"
extensions:
  auditLog: "src/libs/auditLogger.ts"
  rateLimiter: "src/libs/rateLimiter.ts"
experimental:
  edge: true
  streaming: true
```
