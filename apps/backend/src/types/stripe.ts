import Stripe from 'stripe'

export interface WebhookEventHandler {
  eventType: string
  handler: (event: Stripe.Event) => Promise<WebhookResult>
}

export interface WebhookResult {
  success: boolean
  error?: string
  retryable?: boolean
}

export interface PaymentWebhookData {
  paymentIntentId: string
  orderId?: string
  customerId?: string
  amount: number
  currency: string
  status: string
  metadata?: Record<string, string>
}

export interface SubscriptionWebhookData {
  subscriptionId: string
  customerId: string
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  metadata?: Record<string, string>
}

export interface InvoiceWebhookData {
  invoiceId: string
  subscriptionId?: string
  customerId: string
  amountPaid: number
  amountDue: number
  status: string
  metadata?: Record<string, string>
}

export interface WebhookLogEntry {
  id: string
  eventId: string
  eventType: string
  processed: boolean
  attempts: number
  lastAttempt: Date
  success: boolean
  error?: string
  createdAt: Date
  updatedAt: Date
}

export interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 60000, // 1 minute
  backoffMultiplier: 2
}

export interface WebhookSecurityConfig {
  toleranceWindow: number // in seconds
  enableIPValidation: boolean
  trustedIPs: string[]
  enableSignatureValidation: boolean
  rotateSecrets: boolean
  secretRotationInterval: number // in hours
}

export const DEFAULT_SECURITY_CONFIG: WebhookSecurityConfig = {
  toleranceWindow: 300, // 5 minutes
  enableIPValidation: false, // Stripe doesn't provide static IPs
  trustedIPs: [],
  enableSignatureValidation: true,
  rotateSecrets: false,
  secretRotationInterval: 24 * 7 // Weekly
}