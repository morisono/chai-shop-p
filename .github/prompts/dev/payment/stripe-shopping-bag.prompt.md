---
mode: 'agent'
tools: ['githubRepo', 'codebase']
description: 'Implement a comprehensive, business-grade paywall system with Stripe integration'
---

Generate a secure shopping (bag) system that seamlessly integrated with the existing shopping flow.

The output should include:

• session_management
  – framework/version
  – token_strategy (e.g. JWT, HttpOnly cookie)
  – expiry and refresh policy

• shopping_bag_management
  – create/read/update/delete endpoints
  – in‑memory vs persistent storage
  – concurrency controls

• inventory_sync
  – real‑time stock checks
  – fallback for out‑of‑stock

• promotions
  – coupon application flow
  – combinability rules

• checkout_flow
  – address validation
  – tax and shipping calculation

• payment_infrastructure
  – processor.primary: “stripe”
  – webhook_endpoints
  – retry logic

• security
  – CSRF protection
  – input validation
  – rate limiting

Ensure each section defines fields, types, constraints, and example values.
Each step must include precise measurements, carefully selected libraries, and rationale for design decisions.
You can also suggest external system for ideal inventory sync and payment processing.


System configuration with production-ready parameters:

```
payment_infrastructure:
  processor:
    primary: "stripe"
    fallback: "stripe_alternate_account"
    account:
      id: "${STRIPE_PUBLISHABLE_KEY}"
      secret: "${STRIPE_SECRET_KEY}"
    webhook:
      verification:
        secret: "${STRIPE_WEBHOOK_SECRET}"
        tolerance: "5m"
      endpoint_rotation: "weekly"
    subscription:
      status: "active"
      env: "${BILLING_PLAN_ENV}"

session_management:
  framework: "react-router"

credential_management:
  storage:
    type: "persistent"
    engine: "Cloudflare KV"
...

```