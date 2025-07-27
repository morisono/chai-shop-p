---
mode: 'agent'
tools: ['githubRepo', 'codebase']
description: 'Implement a comprehensive, business-grade paywall system with Stripe integration'
---

Implement a comprehensive, business-grade paywall system with Stripe integration featuring multi-tiered subscription plans with the following specifications:

**Free Tier**: Basic feature access with rate-limited API calls and essential functionality
**Pro Tier**: Full platform access with advanced capabilities, priority support, and enhanced quotas
**Business Tier**: Customizable feature bundles with dedicated infrastructure, SLA guarantees, and concierge onboarding

System configuration with production-ready parameters:

```yaml
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
  plans:
    free:
      id: "tier_free_v3"
      rate_limits:
        api: "1000/day"
        bandwidth: "1GB/month"
      features:
        - read_access
        - community_support
    pro:
      id: "tier_pro_v3"
      features:
        - unrestricted_api
        - dedicated_sla
        - white_labeling
        - webhook_customization
    business:
      id: "custom_pricing"
      configurable:
        - feature_bundles
        - dedicated_instances
        - private_deployments
    billing_cycle:
      monthly:
        id: ${PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID}
      yearly:
        id: ${PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID}
```

Technical requirements:

1. Global payment processing:
   - Multi-provider failover with <1s switchover
   - Real-time currency conversion with <0.5% FX margin
   - Cryptocurrency settlement with on-chain confirmation
   - PCI-DSS Level 1 certified vaultless tokenization

2. Security framework:
   - FIDO2/WebAuthn authentication with fallback to:
     - Time-bound OTP (TOTP/HOTP)
     - Biometric verification
     - Hardware security key enforcement for admin roles
   - Continuous threat monitoring:
     - Behavioral anomaly detection (ML model refresh <15m)
     - Real-time velocity pattern analysis
     - Automated dark web credential scanning

3. Subscription engine:
   - Dynamic plan migration with zero downtime
   - Predictive churn modeling (AUC >0.9)
   - Automated recovery workflows:
     - Smart dunning with 3-stage escalation
     - Win-back incentive personalization
   - Usage-based billing integration

4. Compliance architecture:
   - Automated data sovereignty enforcement
   - Cryptographic proof of erasure (NIST 800-88)
   - Real-time consent audit trails
   - Regulatory reporting automation (GDPR/CCPA/LGPD)

5. Performance SLAs:
   - API latency: <25ms p95 worldwide
   - Event processing: <100ms e2e latency
   - 99.99% uptime with multi-region active-active
   - Cold standby capacity for 200% traffic surge

6. Observability stack:
   - Distributed tracing with 1ms resolution
   - Real-time revenue attribution
   - Anomaly detection on:
     - Payment success rates
     - Subscription lifecycle events
     - Fraud pattern evolution

7. User experience:
   - Adaptive paywall rendering:
     - Geo-localized pricing
     - Behavioral targeting
     - A/B test framework
   - Instant access propagation
   - Cross-platform state synchronization
