# Stripe Webhook Implementation Guide

## Overview

This document provides comprehensive documentation for the Stripe webhook implementation in our checkout workflow. The system is designed to handle payment events, subscription management, and invoice processing with security, reliability, and observability in mind.

## Architecture

### Components

1. **WebhookService** - Main orchestrator for webhook processing
2. **SecurityService** - Handles signature validation and security measures
3. **RetryService** - Implements exponential backoff retry logic
4. **EventHandlers** - Specific handlers for payment, subscription, and invoice events

### Endpoints

Based on the CHECKOUT_ARCHITECTURE.md specification:

- `POST /api/webhooks/stripe` - Main webhook endpoint
- `POST /api/webhooks/stripe/payment-succeeded` - Payment success events
- `POST /api/webhooks/stripe/payment-failed` - Payment failure events
- `POST /api/webhooks/stripe/invoice-paid` - Invoice payment events
- `POST /api/webhooks/stripe/subscription-updated` - Subscription change events

### Management Endpoints

- `GET /api/webhooks/health` - Health check and statistics
- `GET /api/webhooks/failed` - List failed webhook deliveries
- `POST /api/webhooks/retry/:eventId` - Manual retry for failed events
- `GET /api/webhooks/events/supported` - List of supported event types

## Security Implementation

### Signature Validation

The system validates webhook signatures using Stripe's standard verification:

```typescript
const event = stripe.webhooks.constructEvent(
  payload,
  signature,
  endpointSecret,
  toleranceWindow
)
```

### Security Features

- **Signature Verification**: Every webhook request is verified using Stripe's signature
- **Timestamp Validation**: Requests outside the tolerance window (5 minutes) are rejected
- **Duplicate Detection**: Events are checked for duplicates to prevent replay attacks
- **Rate Limiting**: Protection against webhook flooding (configurable)
- **IP Validation**: Optional IP whitelist validation (disabled by default for Stripe)

### Environment Variables

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
PORT=3001
```

## Supported Events

### Payment Events

- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `payment_intent.requires_action` - 3D Secure or other action required

### Subscription Events

- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription modified
- `customer.subscription.deleted` - Subscription cancelled

### Invoice Events

- `invoice.paid` - Invoice payment successful
- `invoice.payment_failed` - Invoice payment failed

## Testing with Stripe CLI

### Installation and Setup

1. Install Stripe CLI:
```bash
# macOS with Homebrew
brew install stripe/stripe-cli/stripe

# Linux with package manager
wget -qO- https://cli.stripe.com/install.sh | sh

# Or download from https://github.com/stripe/stripe-cli/releases
```

2. Login to Stripe:
```bash
stripe login
```

3. Set up webhook forwarding:
```bash
# Forward to local development server
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Forward specific events only
stripe listen --events payment_intent.succeeded,payment_intent.payment_failed --forward-to localhost:3001/api/webhooks/stripe
```

### Testing Payment Events

1. Create a test payment intent:
```bash
stripe payment_intents create --amount=2000 --currency=usd --automatic-payment-methods-enabled=true
```

2. Trigger payment succeeded event:
```bash
# Get payment intent ID from the previous command
stripe trigger payment_intent.succeeded --override payment_intent:id=pi_test_...
```

3. Trigger payment failed event:
```bash
stripe trigger payment_intent.payment_failed
```

### Testing Subscription Events

1. Create test subscription:
```bash
# First create a customer
stripe customers create --email=test@example.com --name="Test Customer"

# Create a subscription
stripe subscriptions create --customer=cus_test... --items[0][price]=price_test...
```

2. Trigger subscription events:
```bash
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

### Testing with Custom Events

```bash
# Send a complete test event
stripe events resend evt_test_webhook --webhook-endpoint we_test_...
```

## Webhook Configuration in Stripe Dashboard

### 1. Create Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for

### 2. Required Events

Select these events in the dashboard:

**Payment Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.requires_action`

**Subscription Events:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Invoice Events:**
- `invoice.paid`
- `invoice.payment_failed`

### 3. Configure Webhook Secret

1. After creating the endpoint, copy the webhook signing secret
2. Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

## Monitoring and Debugging

### Health Check

```bash
curl http://localhost:3001/api/webhooks/health
```

Response:
```json
{
  "status": "healthy",
  "handlersCount": 8,
  "supportedEvents": [
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "customer.subscription.created"
  ],
  "retryStats": {
    "totalWebhooks": 150,
    "successfulWebhooks": 148,
    "failedWebhooks": 2,
    "averageAttempts": 1.1
  }
}
```

### Failed Webhooks

```bash
curl http://localhost:3001/api/webhooks/failed
```

### Manual Retry

```bash
curl -X POST http://localhost:3001/api/webhooks/retry/evt_test_webhook
```

### Logs

The system provides structured logging for all webhook events:

```json
{
  "level": "info",
  "msg": "Received Stripe webhook: payment_intent.succeeded (evt_1234567890)",
  "eventId": "evt_1234567890",
  "eventType": "payment_intent.succeeded",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Error Handling

### Retry Logic

The system implements exponential backoff with the following configuration:

- **Max Attempts**: 3
- **Base Delay**: 1 second
- **Max Delay**: 60 seconds
- **Backoff Multiplier**: 2

### Error Types

1. **Retryable Errors**: Network timeouts, temporary service unavailability
2. **Non-retryable Errors**: Invalid signatures, malformed payloads
3. **Business Logic Errors**: Application-specific failures

### Failure Scenarios

1. **Signature Validation Failed**: Returns 400, logs security incident
2. **Handler Error**: Retries with exponential backoff
3. **Database Error**: Retries with backoff
4. **External Service Error**: Retries with backoff

## Production Deployment

### Security Checklist

- [ ] Webhook endpoint uses HTTPS
- [ ] Webhook secret is properly configured
- [ ] Rate limiting is enabled
- [ ] Monitoring and alerting are set up
- [ ] Backup webhook endpoints are configured
- [ ] Log retention policy is configured

### Performance Considerations

- Webhook processing should complete within 30 seconds
- Use async processing for heavy operations
- Implement proper database connection pooling
- Monitor webhook processing times
- Set up alerts for failed webhooks

### Monitoring Setup

1. **Metrics to Track**:
   - Webhook processing time
   - Success/failure rates
   - Retry attempts
   - Queue sizes

2. **Alerts to Configure**:
   - Failed webhook rate > 5%
   - Processing time > 10 seconds
   - Retry rate > 20%
   - Queue backlog > 100 events

### Database Schema

TODO: Implement database tables for webhook logging:

```sql
-- Webhook event logs
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR NOT NULL UNIQUE,
  event_type VARCHAR NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 1,
  last_attempt TIMESTAMP DEFAULT NOW(),
  success BOOLEAN DEFAULT FALSE,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Webhook retry queue
CREATE TABLE webhook_retry_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR NOT NULL,
  next_retry TIMESTAMP NOT NULL,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events**
   - Check endpoint URL in Stripe dashboard
   - Verify webhook secret configuration
   - Check firewall and network settings

2. **Signature Verification Failed**
   - Verify webhook secret matches Stripe dashboard
   - Check request body parsing (must be raw)
   - Verify timestamp tolerance window

3. **Events Being Retried Multiple Times**
   - Check handler logic for proper error handling
   - Verify database connectivity
   - Check for idempotency issues

### Debug Mode

Enable debug logging:

```bash
NODE_ENV=development npm run dev
```

This will enable detailed webhook processing logs.

## Future Enhancements

1. **Database Integration**: Implement proper database persistence
2. **Advanced Monitoring**: Integrate with APM tools (DataDog, New Relic)
3. **Alert System**: Email/Slack notifications for critical failures
4. **Webhook Dashboard**: Web interface for monitoring and management
5. **Event Replay**: Ability to replay events from specific timestamps
6. **A/B Testing**: Support for webhook endpoint testing
7. **Circuit Breaker**: Prevent cascade failures during outages

## References

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)