import { FastifyInstance } from 'fastify'
import {
  WebhookResult,
  RetryConfig,
  DEFAULT_RETRY_CONFIG,
  WebhookLogEntry
} from '../types/stripe'

export class WebhookRetryService {
  private logger: FastifyInstance['log']
  private config: RetryConfig

  constructor(logger: FastifyInstance['log'], config: Partial<RetryConfig> = {}) {
    this.logger = logger
    this.config = { ...DEFAULT_RETRY_CONFIG, ...config }
  }

  /**
   * Executes a webhook handler with retry logic
   */
  async executeWithRetry<T>(
    eventId: string,
    handler: () => Promise<WebhookResult>,
    _context?: T
  ): Promise<WebhookResult> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        this.logger.info(`Executing webhook handler for ${eventId}, attempt ${attempt}/${this.config.maxAttempts}`)

        const result = await handler()

        if (result.success) {
          await this.logSuccess(eventId, attempt)
          return result
        }

        // If not retryable, don't continue
        if (result.retryable === false) {
          await this.logFailure(eventId, attempt, result.error || 'Non-retryable error')
          return result
        }

        // If this is not the last attempt, wait before retrying
        if (attempt < this.config.maxAttempts) {
          const delay = this.calculateDelay(attempt)
          this.logger.warn(`Webhook handler failed for ${eventId}, retrying in ${delay}ms: ${result.error}`)
          await this.sleep(delay)
        } else {
          await this.logFailure(eventId, attempt, result.error || 'Max attempts reached')
          return result
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')

        if (attempt < this.config.maxAttempts) {
          const delay = this.calculateDelay(attempt)
          this.logger.error(`Webhook handler threw error for ${eventId}, retrying in ${delay}ms:`, error)
          await this.sleep(delay)
        } else {
          await this.logFailure(eventId, attempt, lastError.message)
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Max retry attempts exceeded',
      retryable: false
    }
  }

  /**
   * Calculates exponential backoff delay
   */
  private calculateDelay(attempt: number): number {
    const delay = this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1)
    return Math.min(delay, this.config.maxDelay)
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Logs successful webhook execution
   */
  private async logSuccess(eventId: string, attempts: number): Promise<void> {
    const logEntry: Partial<WebhookLogEntry> = {
      eventId,
      processed: true,
      attempts,
      lastAttempt: new Date(),
      success: true
    }

    this.logger.info(`Webhook ${eventId} processed successfully after ${attempts} attempts`)
    await this.persistLogEntry(logEntry)
  }

  /**
   * Logs failed webhook execution
   */
  private async logFailure(eventId: string, attempts: number, error: string): Promise<void> {
    const logEntry: Partial<WebhookLogEntry> = {
      eventId,
      processed: false,
      attempts,
      lastAttempt: new Date(),
      success: false,
      error
    }

    this.logger.error(`Webhook ${eventId} failed after ${attempts} attempts: ${error}`)
    await this.persistLogEntry(logEntry)
  }

  /**
   * Persists log entry to database
   */
  private async persistLogEntry(logEntry: Partial<WebhookLogEntry>): Promise<void> {
    // TODO: Implement database persistence
    // For now, just log to console
    this.logger.debug('Webhook log entry:', logEntry)
  }

  /**
   * Retrieves failed webhooks for manual retry
   */
  async getFailedWebhooks(_limit: number = 100): Promise<WebhookLogEntry[]> {
    // TODO: Implement database query
    // For now, return empty array
    return []
  }

  /**
   * Manually retries a failed webhook
   */
  async retryFailedWebhook(eventId: string): Promise<WebhookResult> {
    // TODO: Implement manual retry logic
    this.logger.info(`Manual retry requested for webhook ${eventId}`)

    return {
      success: false,
      error: 'Manual retry not implemented yet'
    }
  }

  /**
   * Gets retry statistics
   */
  async getRetryStats(): Promise<{
    totalWebhooks: number
    successfulWebhooks: number
    failedWebhooks: number
    averageAttempts: number
  }> {
    // TODO: Implement statistics query
    return {
      totalWebhooks: 0,
      successfulWebhooks: 0,
      failedWebhooks: 0,
      averageAttempts: 0
    }
  }
}