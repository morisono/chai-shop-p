import Stripe from 'stripe'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { WebhookSecurityService } from '../services/webhook-security'
import { WebhookRetryService } from '../services/webhook-retry'
import { PaymentEventHandler } from './payment-handler'
import { SubscriptionEventHandler, InvoiceEventHandler } from './subscription-handler'
import { WebhookResult, WebhookEventHandler } from '../types/stripe'

export class StripeWebhookService {
  private logger: FastifyInstance['log']
  private securityService: WebhookSecurityService
  private retryService: WebhookRetryService
  private paymentHandler: PaymentEventHandler
  private subscriptionHandler: SubscriptionEventHandler
  private invoiceHandler: InvoiceEventHandler
  private eventHandlers: Map<string, WebhookEventHandler>

  constructor(stripe: Stripe, logger: FastifyInstance['log']) {
    this.logger = logger
    this.securityService = new WebhookSecurityService(stripe, logger)
    this.retryService = new WebhookRetryService(logger)
    this.paymentHandler = new PaymentEventHandler(logger)
    this.subscriptionHandler = new SubscriptionEventHandler(logger)
    this.invoiceHandler = new InvoiceEventHandler(logger)
    this.eventHandlers = new Map()

    this.initializeEventHandlers()
  }

  /**
   * Main webhook processing method
   */
  async processWebhook(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const startTime = Date.now()

    try {
      // Security validations
      const signature = request.headers['stripe-signature'] as string
      if (!signature) {
        this.logger.error('Missing Stripe signature header')
        reply.status(400).send({ error: 'Missing stripe-signature header' })
        return
      }

      // Validate IP address (if enabled)
      if (!this.securityService.validateIPAddress(request)) {
        reply.status(403).send({ error: 'Request from untrusted IP address' })
        return
      }

      // Construct and validate event
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
      const { success, event, error } = await this.securityService.validateAndConstructEvent(
        (request as any).rawBody || request.body as string,
        signature,
        endpointSecret
      )

      if (!success || !event) {
        reply.status(400).send({ error: error || 'Invalid webhook signature' })
        return
      }

      // Validate event payload
      const payloadValidation = this.securityService.validateEventPayload(event)
      if (!payloadValidation.success) {
        this.logger.error(`Invalid event payload: ${payloadValidation.error}`)
        reply.status(400).send({ error: 'Invalid event payload' })
        return
      }

      // Check for duplicate events
      if (await this.securityService.isDuplicateEvent(event.id)) {
        this.logger.info(`Duplicate event detected: ${event.id}`)
        reply.status(200).send({ received: true, duplicate: true })
        return
      }

      // Log event reception
      this.logger.info(`Received Stripe webhook: ${event.type} (${event.id})`)

      // Process event with retry logic
      const result = await this.retryService.executeWithRetry(
        event.id,
        () => this.handleEvent(event),
        { event }
      )

      // Send response
      if (result.success) {
        const processingTime = Date.now() - startTime
        this.logger.info(`Webhook processed successfully in ${processingTime}ms: ${event.id}`)
        reply.status(200).send({ received: true, processed: true })
      } else {
        this.logger.error(`Webhook processing failed: ${event.id} - ${result.error}`)
        // Still return 200 to prevent Stripe retries for non-retryable errors
        reply.status(200).send({
          received: true,
          processed: false,
          error: result.error,
          retryable: result.retryable
        })
      }

    } catch (error) {
      const processingTime = Date.now() - startTime
      this.logger.error(`Webhook processing error after ${processingTime}ms:`, error)
      reply.status(500).send({ error: 'Internal server error' })
    }
  }

  /**
   * Routes events to appropriate handlers
   */
  private async handleEvent(event: Stripe.Event): Promise<WebhookResult> {
    const handler = this.eventHandlers.get(event.type)

    if (!handler) {
      this.logger.warn(`No handler found for event type: ${event.type}`)
      return {
        success: true, // Return success for unknown events to prevent retries
        error: `No handler for event type: ${event.type}`
      }
    }

    try {
      return await handler.handler(event)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Handler error for ${event.type}:`, error)

      return {
        success: false,
        error: errorMessage,
        retryable: true
      }
    }
  }

  /**
   * Initialize event handlers mapping
   */
  private initializeEventHandlers(): void {
    // Payment events
    this.eventHandlers.set('payment_intent.succeeded', {
      eventType: 'payment_intent.succeeded',
      handler: this.paymentHandler.handlePaymentSucceeded.bind(this.paymentHandler)
    })

    this.eventHandlers.set('payment_intent.payment_failed', {
      eventType: 'payment_intent.payment_failed',
      handler: this.paymentHandler.handlePaymentFailed.bind(this.paymentHandler)
    })

    this.eventHandlers.set('payment_intent.requires_action', {
      eventType: 'payment_intent.requires_action',
      handler: this.paymentHandler.handlePaymentRequiresAction.bind(this.paymentHandler)
    })

    // Subscription events
    this.eventHandlers.set('customer.subscription.created', {
      eventType: 'customer.subscription.created',
      handler: this.subscriptionHandler.handleSubscriptionCreated.bind(this.subscriptionHandler)
    })

    this.eventHandlers.set('customer.subscription.updated', {
      eventType: 'customer.subscription.updated',
      handler: this.subscriptionHandler.handleSubscriptionUpdated.bind(this.subscriptionHandler)
    })

    this.eventHandlers.set('customer.subscription.deleted', {
      eventType: 'customer.subscription.deleted',
      handler: this.subscriptionHandler.handleSubscriptionDeleted.bind(this.subscriptionHandler)
    })

    // Invoice events
    this.eventHandlers.set('invoice.paid', {
      eventType: 'invoice.paid',
      handler: this.invoiceHandler.handleInvoicePaid.bind(this.invoiceHandler)
    })

    this.eventHandlers.set('invoice.payment_failed', {
      eventType: 'invoice.payment_failed',
      handler: this.invoiceHandler.handleInvoicePaymentFailed.bind(this.invoiceHandler)
    })

    this.logger.info(`Initialized ${this.eventHandlers.size} webhook event handlers`)
  }

  /**
   * Registers a custom event handler
   */
  registerEventHandler(eventType: string, handler: (event: Stripe.Event) => Promise<WebhookResult>): void {
    this.eventHandlers.set(eventType, {
      eventType,
      handler
    })

    this.logger.info(`Registered custom handler for event type: ${eventType}`)
  }

  /**
   * Gets list of supported event types
   */
  getSupportedEventTypes(): string[] {
    return Array.from(this.eventHandlers.keys())
  }

  /**
   * Health check for webhook service
   */
  async healthCheck(): Promise<{
    status: string
    handlersCount: number
    supportedEvents: string[]
    retryStats: any
  }> {
    const retryStats = await this.retryService.getRetryStats()

    return {
      status: 'healthy',
      handlersCount: this.eventHandlers.size,
      supportedEvents: this.getSupportedEventTypes(),
      retryStats
    }
  }

  /**
   * Manual retry for failed webhooks
   */
  async retryFailedWebhook(eventId: string): Promise<WebhookResult> {
    return await this.retryService.retryFailedWebhook(eventId)
  }

  /**
   * Gets failed webhooks for manual intervention
   */
  async getFailedWebhooks(limit: number = 100): Promise<any[]> {
    return await this.retryService.getFailedWebhooks(limit)
  }
}