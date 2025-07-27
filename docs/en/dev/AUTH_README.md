# Better Auth Implementation

A comprehensive, secure authentication system built with Better Auth for the backend and frontend applications.

## Features Implemented

### 🔐 Core Authentication
- **Email/Password Authentication** - Secure sign up and sign in
- **OAuth Integration** - GitHub and Google social sign-in
- **Session Management** - Secure, persistent sessions with configurable expiry
- **Password Reset** - Secure password reset flow with email verification

### 🛡️ Advanced Security
- **JWT Support** - Token-based authentication with configurable algorithms
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - Protect against brute force attacks
- **Secure Cookies** - HTTP-only, secure, same-site cookies
- **Session Security** - Automatic session rotation and expiry

### 🔑 Modern Authentication Methods
- **Passkey Support** - WebAuthn/FIDO2 passwordless authentication
- **Two-Factor Authentication** - TOTP-based 2FA with backup codes
- **Multiple Sessions** - Support for concurrent sessions across devices

## File Structure

```
apps/backend/
├── lib/
│   ├── auth.server.ts       # Server-side auth configuration
│   ├── auth-client.ts       # Client-side auth instance
│   ├── auth-utils.ts        # Server-side auth utilities
│   ├── use-auth.ts          # React hooks for authentication
│   └── db.ts               # Database connection
├── routes/
│   └── api.auth.$.ts       # Remix auth API routes
db/
└── models/
    └── Schema.ts           # Database schema with Better Auth tables
```

## Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure the required variables:

```bash
cp .env.example .env
```

Key variables to configure:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - For GitHub OAuth
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - For Google OAuth

### 2. Database Setup

Generate and run migrations for Better Auth tables:

```bash
# Generate migration
npx drizzle-kit generate

# Apply migration
npx drizzle-kit migrate
```

### 3. Install Dependencies

The following dependencies are required and already included:

```json
{
  "better-auth": "^1.3.4",
  "drizzle-orm": "^0.44.2",
  "postgres": "^3.4.5"
}
```

## Usage Examples

### Server-Side (Remix Loaders/Actions)

```typescript
import { getSession, requireAuth } from "~/lib/auth-utils";

// Get session (optional auth)
export async function loader({ request }: LoaderFunctionArgs) {
  const { user, session } = await getSession(request);
  return json({ user, session });
}

// Require authentication
export async function loader({ request }: LoaderFunctionArgs) {
  const { user, session } = await requireAuth(request);
  return json({ user });
}
```

### Client-Side (React Components)

```typescript
import { useAuth } from "~/lib/use-auth";
import { authClient } from "~/lib/auth-client";

function LoginForm() {
  const { signIn, signInWithProvider } = useAuth();

  const handleEmailSignIn = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    if (error) console.error(error);
  };

  const handleGitHubSignIn = async () => {
    const { error } = await signInWithProvider("github");
    if (error) console.error(error);
  };

  return (
    <div>
      {/* Email/password form */}
      <button onClick={handleGitHubSignIn}>
        Sign in with GitHub
      </button>
    </div>
  );
}
```

### Session Hook

```typescript
import { useSession } from "better-auth/react";

function UserProfile() {
  const { data: session, isLoading } = useSession();

  if (isLoading) return <div>Loading...</div>;
  if (!session) return <div>Please sign in</div>;

  return <div>Welcome, {session.user.name}!</div>;
}
```

## Authentication Flows

### 1. Email/Password Registration
```typescript
const { data, error } = await authClient.signUp.email({
  email: "user@example.com",
  password: "securePassword123",
  name: "John Doe"
});
```

### 2. Social Sign-In
```typescript
const { data, error } = await authClient.signIn.social({
  provider: "github",
  callbackURL: "/dashboard"
});
```

### 3. Passkey Authentication
```typescript
// Add a passkey
await authClient.passkey.addPasskey({
  name: "My iPhone"
});

// Sign in with passkey
await authClient.passkey.signInPasskey();
```

### 4. Two-Factor Authentication
```typescript
// Enable 2FA
const { data, error } = await authClient.twoFactor.enable();

// Verify TOTP code
await authClient.twoFactor.verifyTotp({
  code: "123456"
});
```

## Security Features

### Rate Limiting
- **Global**: 100 requests per 60 seconds
- **Sign In**: 5 attempts per 60 seconds
- **Sign Up**: 3 attempts per 60 seconds
- **Password Reset**: 2 attempts per 60 seconds

### CSRF Protection
- Automatic CSRF token generation and validation
- Secure token storage in HTTP-only cookies
- Protection against cross-site request forgery

### Session Security
- **Expiry**: 7 days by default
- **Rotation**: Sessions update every 24 hours
- **Secure Cookies**: HTTP-only, secure, same-site
- **Cross-device Support**: Multiple active sessions

### Password Security
- Automatic password hashing with secure algorithms
- Password strength requirements (implement as needed)
- Secure password reset flow with time-limited tokens

## API Endpoints

All authentication endpoints are handled through the catch-all route:

```
POST /api/auth/sign-in
POST /api/auth/sign-up
POST /api/auth/sign-out
POST /api/auth/reset-password
GET  /api/auth/session
POST /api/auth/verify-email
... and more
```

## Database Schema

The system creates the following tables:
- `user` - User accounts and profiles
- `session` - Active user sessions
- `account` - OAuth account linking
- `verification` - Email verification tokens
- `twoFactor` - 2FA secrets and backup codes
- `passkey` - WebAuthn credentials

## Production Considerations

### Security Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `BETTER_AUTH_SECRET`
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set secure cookie domain
- [ ] Monitor failed authentication attempts
- [ ] Implement proper logging
- [ ] Regular security updates

### Performance
- Database connection pooling is configured
- Session caching reduces database queries
- Rate limiting prevents abuse
- Efficient query patterns with Drizzle ORM

## Troubleshooting

### Common Issues

1. **"Database connection failed"**
   - Check `DATABASE_URL` environment variable
   - Ensure PostgreSQL is running
   - Verify database exists and is accessible

2. **"OAuth authentication failed"**
   - Verify OAuth client credentials
   - Check redirect URLs in OAuth app settings
   - Ensure `FRONTEND_URL` is correctly set

3. **"Session not found"**
   - Check if cookies are being sent
   - Verify `baseURL` configuration
   - Ensure same domain for client and server

4. **"Rate limit exceeded"**
   - Normal behavior for too many requests
   - Adjust rate limits in production if needed
   - Implement user feedback for rate limiting

### Debug Mode

Enable debug logging in development:

```typescript
// In auth.server.ts
logger: {
  level: "debug",
  disabled: false,
}
```

## Next Steps

### Recommended Enhancements
1. **Email Service Integration** - Implement actual email sending for verification and password reset
2. **User Roles & Permissions** - Extend the user schema with role-based access control
3. **Account Linking** - Allow users to link multiple OAuth accounts
4. **Session Management UI** - Build interface for users to manage active sessions
5. **Audit Logging** - Track authentication events for security monitoring
6. **Magic Link Authentication** - Add passwordless email-based sign-in
7. **SMS 2FA** - Extend 2FA with SMS verification option

### Testing
Consider implementing:
- Authentication flow tests
- Security vulnerability tests
- Rate limiting tests
- Session management tests
- OAuth integration tests

---

This authentication system provides a solid foundation for secure user management while maintaining flexibility for future enhancements.
