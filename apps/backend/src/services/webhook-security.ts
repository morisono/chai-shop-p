import Stripe from 'stripe'
import { FastifyInstance, FastifyRequest } from 'fastify'
import {
  WebhookResult,
  WebhookSecurityConfig,
  DEFAULT_SECURITY_CONFIG
} from '../types/stripe'

export class WebhookSecurityService {
  private stripe: Stripe
  private config: WebhookSecurityConfig
  private logger: FastifyInstance['log']

  constructor(
    stripe: Stripe,
    logger: FastifyInstance['log'],
    config: Partial<WebhookSecurityConfig> = {}
  ) {
    this.stripe = stripe
    this.logger = logger
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config }
  }

  /**
   * Validates webhook signature and constructs Stripe event
   */
  async validateAndConstructEvent(
    payload: string | Buffer,
    signature: string,
    endpointSecret: string
  ): Promise<{ success: boolean; event?: Stripe.Event; error?: string }> {
    try {
      // Validate signature with tolerance window
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret,
        this.config.toleranceWindow
      )

      this.logger.info(`Webhook signature validated for event: ${event.id}`)

      return { success: true, event }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      this.logger.error(`Webhook signature validation failed: ${errorMessage}`)

      // Log security incidents
      await this.logSecurityIncident({
        type: 'signature_validation_failed',
        error: errorMessage,
        timestamp: new Date()
      })

      return {
        success: false,
        error: `Webhook signature validation failed: ${errorMessage}`
      }
    }
  }

  /**
   * Validates request timing to prevent replay attacks
   */
  validateRequestTiming(timestamp: number): boolean {
    const now = Math.floor(Date.now() / 1000)
    const timeDiff = Math.abs(now - timestamp)

    if (timeDiff > this.config.toleranceWindow) {
      this.logger.warn(`Webhook request outside tolerance window: ${timeDiff}s`)
      return false
    }

    return true
  }

  /**
   * Validates IP address if enabled (Note: Stripe doesn't provide static IPs)
   */
  validateIPAddress(request: FastifyRequest): boolean {
    if (!this.config.enableIPValidation) {
      return true
    }

    const clientIP = request.ip || request.headers['x-forwarded-for'] as string || 'unknown'

    if (!this.config.trustedIPs.includes(clientIP)) {
      this.logger.warn(`Webhook request from untrusted IP: ${clientIP}`)
      return false
    }

    return true
  }

  /**
   * Checks if event is duplicate by ID
   */
  async isDuplicateEvent(_eventId: string): Promise<boolean> {
    // In production, implement database check
    // For now, use in-memory cache with expiration
    // TODO: Implement database-backed duplicate detection
    return false
  }

  /**
   * Logs security incidents for monitoring
   */
  private async logSecurityIncident(incident: {
    type: string
    error: string
    timestamp: Date
  }): Promise<void> {
    this.logger.error('Webhook Security Incident:', incident)

    // In production, send alerts to security team
    // TODO: Implement alerting system (email, Slack, PagerDuty)
  }

  /**
   * Rate limiting check for webhook endpoints
   */
  async checkRateLimit(_identifier: string): Promise<boolean> {
    // TODO: Implement rate limiting logic
    // For now, return true (no rate limiting)
    return true
  }

  /**
   * Validates webhook event payload structure
   */
  validateEventPayload(event: Stripe.Event): WebhookResult {
    try {
      // Basic validation
      if (!event.id || !event.type || !event.data) {
        return {
          success: false,
          error: 'Invalid event structure: missing required fields'
        }
      }

      // Validate event ID format
      if (!event.id.startsWith('evt_')) {
        return {
          success: false,
          error: 'Invalid event ID format'
        }
      }

      // Validate timestamp
      if (!event.created || event.created <= 0) {
        return {
          success: false,
          error: 'Invalid event timestamp'
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payload validation failed'
      }
    }
  }

  /**
   * Sanitizes event data for logging
   */
  sanitizeEventForLogging(event: Stripe.Event): any {
    const sanitized = {
      id: event.id,
      type: event.type,
      created: event.created,
      livemode: event.livemode,
      // Remove sensitive data from object
      data: {
        object: {
          id: (event.data.object as any).id || 'unknown',
          object: (event.data.object as any).object || 'unknown',
          // Add other non-sensitive fields as needed
        }
      }
    }

    return sanitized
  }
}