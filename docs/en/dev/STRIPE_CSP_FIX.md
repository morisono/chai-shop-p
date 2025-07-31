# Stripe Payment Integration Fix

## Issue
The payment workflow was failing due to Content Security Policy (CSP) violations blocking Stripe's JavaScript and iframe requests.

## Root Cause
The browser was blocking Stripe resources due to overly restrictive CSP headers with `script-src 'none'` and `frame-src 'none'`.

## Fixes Applied

### 1. Updated CSP Headers in HTML
- Modified `apps/frontend/index.html` to include proper CSP meta tag allowing Stripe domains
- Added preconnect links for Stripe resources

### 2. Updated Vite Development Server Configuration
- Modified `apps/frontend/vite.config.ts` to set CSP headers during development
- Allowed necessary Stripe domains for scripts, frames, and connections

### 3. Updated Backend Security Headers
- Modified `apps/backend/src/index.ts` to include proper CSP headers
- Added security headers middleware with Stripe-compatible CSP

### 4. Environment Configuration
- Created/updated `.env` files with placeholder Stripe keys
- Fixed API URLs to match correct ports (frontend: 5173, backend: 3001)

### 5. Added Production Headers
- Created `apps/frontend/public/_headers` for deployment CSP configuration

## Required Action: Set Real Stripe Keys

**IMPORTANT**: The Stripe keys are currently set to placeholders. You need to:

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Update the environment files:

### Frontend (.env)
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### Backend (.env)
```bash
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

## CSP Domains Allowed for Stripe

The following domains are now whitelisted in the CSP:
- `https://js.stripe.com` - Stripe.js library
- `https://m.stripe.network` - Stripe network infrastructure
- `https://q.stripe.com` - Stripe APIs
- `https://hooks.stripe.com` - Stripe webhooks
- `https://api.stripe.com` - Stripe API endpoints
- `https://checkout.stripe.com` - Stripe Checkout

## Testing

1. Restart both development servers (already done)
2. Add real Stripe keys to environment files
3. Test payment flow - CSP errors should be resolved
4. Check browser console - no more Stripe-related CSP violations

## Security Notes

- The CSP allows `unsafe-inline` and `unsafe-eval` which are required by Stripe but not ideal for security
- In production, consider using nonces or hashes for inline scripts where possible
- Monitor CSP violation reports to ensure no unauthorized scripts are being blocked
