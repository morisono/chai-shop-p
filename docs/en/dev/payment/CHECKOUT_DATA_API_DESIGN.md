# Checkout Data Flow and API Design Specifications

## TypeScript Interfaces and Data Models

### Core Data Types

```typescript
// Base Types
type UUID = string
type ISODateString = string
type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
type CheckoutStatus =
  | 'cart_review'
  | 'user_identification'
  | 'guest_info'
  | 'shipping_address'
  | 'billing_address'
  | 'shipping_method'
  | 'payment_method'
  | 'order_review'
  | 'payment_processing'
  | 'payment_success'
  | 'payment_failed'
  | 'order_confirmation'

// User and Authentication Types
interface User {
  id: UUID
  email: string
  firstName: string
  lastName: string
  phone?: string
  emailVerified: boolean
  createdAt: ISODateString
  updatedAt: ISODateString
}

interface GuestInformation {
  email: string
  firstName: string
  lastName: string
  phone?: string
  marketingConsent: boolean
}

// Address Types
interface Address {
  id?: UUID
  firstName: string
  lastName: string
  company?: string
  street1: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault?: boolean
  type?: 'shipping' | 'billing'
}

interface AddressValidation {
  isValid: boolean
  confidence: number
  standardizedAddress?: Address
  suggestions: AddressSuggestion[]
  errors: ValidationError[]
}

interface AddressSuggestion {
  address: Address
  confidence: number
  description: string
  changes: string[]
}

// Cart and Product Types
interface Product {
  id: UUID
  name: string
  description: string
  price: number
  currency: CurrencyCode
  images: ProductImage[]
  variants?: ProductVariant[]
  category: string
  sku: string
  weight?: number
  dimensions?: ProductDimensions
  taxable: boolean
  requiresShipping: boolean
  inventory: InventoryInfo
}

interface ProductImage {
  id: UUID
  url: string
  altText: string
  width: number
  height: number
  isPrimary: boolean
}

interface ProductVariant {
  id: UUID
  name: string
  options: VariantOption[]
  price: number
  sku: string
  inventory: InventoryInfo
}

interface VariantOption {
  name: string
  value: string
}

interface ProductDimensions {
  length: number
  width: number
  height: number
  unit: 'in' | 'cm'
}

interface InventoryInfo {
  available: number
  reserved: number
  onHand: number
  allowBackorder: boolean
  trackQuantity: boolean
}

interface CartItem {
  id: UUID
  productId: UUID
  variantId?: UUID
  quantity: number
  price: number
  originalPrice: number
  name: string
  image: string
  sku: string
  metadata?: Record<string, any>
  customizations?: CartItemCustomization[]
}

interface CartItemCustomization {
  type: string
  name: string
  value: string
  price: number
}

interface Cart {
  id: UUID
  userId?: UUID
  sessionId?: string
  items: CartItem[]
  status: 'active' | 'abandoned' | 'converted'
  appliedCoupons: AppliedCoupon[]
  subtotal: number
  totalDiscount: number
  totalTax: number
  totalShipping: number
  total: number
  currency: CurrencyCode
  expiresAt: ISODateString
  createdAt: ISODateString
  updatedAt: ISODateString
  version: number // For optimistic locking
}

// Promotion and Coupon Types
interface Coupon {
  id: UUID
  code: string
  name: string
  description: string
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y'
  value: number
  minimumOrderAmount?: number
  maximumDiscount?: number
  startDate: ISODateString
  endDate: ISODateString
  usageLimit?: number
  usageCount: number
  perCustomerLimit?: number
  isActive: boolean
  combinable: boolean
  applicableProducts?: UUID[]
  excludedProducts?: UUID[]
  applicableCategories?: string[]
  excludedCategories?: string[]
  metadata?: Record<string, any>
}

interface AppliedCoupon {
  id: UUID
  couponId: UUID
  code: string
  discountAmount: number
  appliedAt: ISODateString
}

interface CouponValidation {
  isValid: boolean
  coupon?: Coupon
  discountAmount?: number
  errors: ValidationError[]
  warnings: string[]
}

// Shipping Types
interface ShippingMethod {
  id: UUID
  name: string
  description: string
  carrier: string
  serviceType: string
  cost: number
  estimatedDays: number
  minDeliveryDays: number
  maxDeliveryDays: number
  trackingAvailable: boolean
  requiresSignature: boolean
  insuranceIncluded: boolean
  metadata?: Record<string, any>
}

interface ShippingZone {
  id: UUID
  name: string
  countries: string[]
  states?: string[]
  zipCodes?: string[]
  methods: ShippingMethod[]
}

interface ShippingCalculation {
  address: Address
  items: CartItem[]
  availableMethods: ShippingMethod[]
  recommendedMethod?: ShippingMethod
  errors: ValidationError[]
}

interface DeliveryEstimate {
  method: ShippingMethod
  estimatedDate: ISODateString
  minDate: ISODateString
  maxDate: ISODateString
  businessDaysOnly: boolean
}

// Tax Types
interface TaxRate {
  id: UUID
  jurisdiction: string
  rate: number
  type: 'sales' | 'vat' | 'gst' | 'local'
  applicableCountries: string[]
  applicableStates?: string[]
  applicableZipCodes?: string[]
}

interface TaxCalculation {
  subtotal: number
  totalTax: number
  effectiveRate: number
  breakdown: TaxBreakdownItem[]
  jurisdiction: string
}

interface TaxBreakdownItem {
  type: string
  jurisdiction: string
  rate: number
  amount: number
  taxableAmount: number
}

// Payment Types
interface PaymentMethod {
  id: UUID
  type: 'card' | 'digital_wallet' | 'bank_transfer' | 'bnpl'
  provider: string
  displayName: string
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  metadata?: Record<string, any>
}

interface PaymentIntent {
  id: string // Stripe Payment Intent ID
  amount: number
  currency: CurrencyCode
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'canceled'
  clientSecret: string
  paymentMethod?: PaymentMethod
  lastPaymentError?: PaymentError
  metadata?: Record<string, any>
}

interface PaymentError {
  type: string
  code: string
  message: string
  declineCode?: string
  param?: string
}

interface PaymentResult {
  success: boolean
  paymentIntent: PaymentIntent
  error?: PaymentError
}

// Order Types
interface Order {
  id: UUID
  orderNumber: string
  userId?: UUID
  guestEmail?: string
  status: OrderStatus
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
  paymentIntentId: string
  subtotal: number
  totalDiscount: number
  totalTax: number
  totalShipping: number
  total: number
  currency: CurrencyCode
  appliedCoupons: AppliedCoupon[]
  taxCalculation: TaxCalculation
  notes?: string
  metadata?: Record<string, any>
  createdAt: ISODateString
  updatedAt: ISODateString
  completedAt?: ISODateString
}

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

interface OrderItem {
  id: UUID
  productId: UUID
  variantId?: UUID
  quantity: number
  unitPrice: number
  totalPrice: number
  name: string
  sku: string
  image: string
  customizations?: CartItemCustomization[]
}

// Checkout Session Types
interface CheckoutSession {
  id: UUID
  cartId: UUID
  userId?: UUID
  sessionId: string
  status: CheckoutStatus
  userType: 'guest' | 'registered'
  guestInfo?: GuestInformation
  shippingAddress?: Address
  billingAddress?: Address
  shippingMethod?: ShippingMethod
  paymentMethod?: PaymentMethod
  paymentIntentId?: string
  orderId?: UUID
  stepProgress: CheckoutStepProgress[]
  errors: CheckoutError[]
  metadata?: Record<string, any>
  expiresAt: ISODateString
  createdAt: ISODateString
  updatedAt: ISODateString
}

interface CheckoutStepProgress {
  step: CheckoutStatus
  completedAt?: ISODateString
  data?: Record<string, any>
}

interface CheckoutError {
  code: string
  message: string
  field?: string
  step?: CheckoutStatus
  timestamp: ISODateString
}

// Validation and Error Types
interface ValidationError {
  field: string
  code: string
  message: string
  value?: any
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: ValidationError[]
  }
  metadata?: {
    timestamp: ISODateString
    requestId: string
    version: string
  }
}

// Webhook Types
interface WebhookEvent {
  id: UUID
  type: string
  object: string
  apiVersion: string
  created: number
  data: {
    object: any
    previousAttributes?: any
  }
  livemode: boolean
  pendingWebhooks: number
  request: {
    id: string
    idempotencyKey?: string
  }
}

interface WebhookEndpoint {
  id: UUID
  url: string
  enabledEvents: string[]
  status: 'enabled' | 'disabled'
  description?: string
  metadata?: Record<string, any>
}
```

## REST API Endpoints Specification

### Authentication Endpoints

```typescript
// POST /api/auth/session
interface CreateSessionRequest {
  cartId?: UUID
  fingerprint?: string
}

interface CreateSessionResponse extends ApiResponse<{
  sessionId: string
  cartId: UUID
  expiresAt: ISODateString
}> {}

// GET /api/auth/session
interface GetSessionResponse extends ApiResponse<{
  user?: User
  isAuthenticated: boolean
  sessionId: string
  expiresAt: ISODateString
}> {}
```

### Cart Management Endpoints

```typescript
// POST /api/cart
interface CreateCartRequest {
  sessionId?: string
  userId?: UUID
}

interface CreateCartResponse extends ApiResponse<Cart> {}

// GET /api/cart/:cartId
interface GetCartResponse extends ApiResponse<Cart> {}

// POST /api/cart/:cartId/items
interface AddCartItemRequest {
  productId: UUID
  variantId?: UUID
  quantity: number
  customizations?: CartItemCustomization[]
}

interface AddCartItemResponse extends ApiResponse<{
  cart: Cart
  addedItem: CartItem
}> {}

// PUT /api/cart/:cartId/items/:itemId
interface UpdateCartItemRequest {
  quantity: number
  customizations?: CartItemCustomization[]
}

interface UpdateCartItemResponse extends ApiResponse<{
  cart: Cart
  updatedItem: CartItem
}> {}

// DELETE /api/cart/:cartId/items/:itemId
interface RemoveCartItemResponse extends ApiResponse<{
  cart: Cart
  removedItemId: UUID
}> {}

// POST /api/cart/:cartId/coupons
interface ApplyCouponRequest {
  code: string
}

interface ApplyCouponResponse extends ApiResponse<{
  cart: Cart
  appliedCoupon: AppliedCoupon
  validation: CouponValidation
}> {}

// DELETE /api/cart/:cartId/coupons/:couponId
interface RemoveCouponResponse extends ApiResponse<{
  cart: Cart
  removedCouponId: UUID
}> {}
```

### Checkout Process Endpoints

```typescript
// POST /api/checkout/sessions
interface CreateCheckoutSessionRequest {
  cartId: UUID
  userType: 'guest' | 'registered'
  returnUrl?: string
}

interface CreateCheckoutSessionResponse extends ApiResponse<CheckoutSession> {}

// GET /api/checkout/sessions/:sessionId
interface GetCheckoutSessionResponse extends ApiResponse<CheckoutSession> {}

// PUT /api/checkout/sessions/:sessionId/guest-info
interface UpdateGuestInfoRequest {
  guestInfo: GuestInformation
}

interface UpdateGuestInfoResponse extends ApiResponse<CheckoutSession> {}

// PUT /api/checkout/sessions/:sessionId/shipping-address
interface UpdateShippingAddressRequest {
  address: Address
  validateAddress?: boolean
}

interface UpdateShippingAddressResponse extends ApiResponse<{
  checkoutSession: CheckoutSession
  validation?: AddressValidation
  shippingMethods?: ShippingMethod[]
}> {}

// PUT /api/checkout/sessions/:sessionId/billing-address
interface UpdateBillingAddressRequest {
  address: Address
  sameAsShipping?: boolean
  validateAddress?: boolean
}

interface UpdateBillingAddressResponse extends ApiResponse<{
  checkoutSession: CheckoutSession
  validation?: AddressValidation
}> {}

// PUT /api/checkout/sessions/:sessionId/shipping-method
interface UpdateShippingMethodRequest {
  shippingMethodId: UUID
}

interface UpdateShippingMethodResponse extends ApiResponse<{
  checkoutSession: CheckoutSession
  taxCalculation: TaxCalculation
  orderTotal: number
}> {}

// PUT /api/checkout/sessions/:sessionId/payment-method
interface UpdatePaymentMethodRequest {
  paymentMethodId?: UUID
  savePaymentMethod?: boolean
}

interface UpdatePaymentMethodResponse extends ApiResponse<CheckoutSession> {}
```

### Address and Validation Endpoints

```typescript
// POST /api/addresses/validate
interface ValidateAddressRequest {
  address: Address
  strict?: boolean
}

interface ValidateAddressResponse extends ApiResponse<AddressValidation> {}

// GET /api/addresses/suggestions
interface GetAddressSuggestionsRequest {
  query: string
  country?: string
  limit?: number
}

interface GetAddressSuggestionsResponse extends ApiResponse<AddressSuggestion[]> {}
```

### Shipping and Tax Endpoints

```typescript
// POST /api/shipping/calculate
interface CalculateShippingRequest {
  cartItems: CartItem[]
  shippingAddress: Address
  preferredCarriers?: string[]
}

interface CalculateShippingResponse extends ApiResponse<{
  methods: ShippingMethod[]
  recommended?: ShippingMethod
  estimates: DeliveryEstimate[]
}> {}

// POST /api/tax/calculate
interface CalculateTaxRequest {
  items: CartItem[]
  shippingAddress: Address
  shippingCost?: number
}

interface CalculateTaxResponse extends ApiResponse<TaxCalculation> {}
```

### Payment Processing Endpoints

```typescript
// POST /api/payment/create-intent
interface CreatePaymentIntentRequest {
  checkoutSessionId: UUID
  paymentMethodId?: string
  savePaymentMethod?: boolean
  confirmImmediately?: boolean
}

interface CreatePaymentIntentResponse extends ApiResponse<{
  paymentIntent: PaymentIntent
  requiresAction: boolean
  actionType?: string
}> {}

// POST /api/payment/confirm
interface ConfirmPaymentRequest {
  paymentIntentId: string
  paymentMethodData?: any
}

interface ConfirmPaymentResponse extends ApiResponse<{
  paymentIntent: PaymentIntent
  order?: Order
  redirectUrl?: string
}> {}

// POST /api/payment/webhooks/stripe
interface StripeWebhookRequest {
  // Raw Stripe webhook payload
}

interface StripeWebhookResponse extends ApiResponse<{
  processed: boolean
  eventType: string
}> {}
```

### Order Management Endpoints

```typescript
// POST /api/orders
interface CreateOrderRequest {
  checkoutSessionId: UUID
  paymentIntentId: string
  idempotencyKey?: string
}

interface CreateOrderResponse extends ApiResponse<Order> {}

// GET /api/orders/:orderId
interface GetOrderResponse extends ApiResponse<Order> {}

// GET /api/orders/:orderId/status
interface GetOrderStatusResponse extends ApiResponse<{
  status: OrderStatus
  tracking?: TrackingInfo
  estimatedDelivery?: ISODateString
}> {}

interface TrackingInfo {
  carrier: string
  trackingNumber: string
  trackingUrl: string
  status: string
  lastUpdate: ISODateString
  events: TrackingEvent[]
}

interface TrackingEvent {
  timestamp: ISODateString
  status: string
  location?: string
  description: string
}
```

### Inventory Management Endpoints

```typescript
// GET /api/inventory/:productId/availability
interface CheckInventoryRequest {
  variantId?: UUID
  quantity: number
}

interface CheckInventoryResponse extends ApiResponse<{
  available: boolean
  quantity: number
  availableQuantity: number
  estimatedRestockDate?: ISODateString
  alternatives?: Product[]
}> {}

// POST /api/inventory/reserve
interface ReserveInventoryRequest {
  items: Array<{
    productId: UUID
    variantId?: UUID
    quantity: number
  }>
  reservationId: UUID
  expiresIn?: number // seconds
}

interface ReserveInventoryResponse extends ApiResponse<{
  reservationId: UUID
  items: Array<{
    productId: UUID
    variantId?: UUID
    quantityReserved: number
    expiresAt: ISODateString
  }>
  expiresAt: ISODateString
}> {}

// DELETE /api/inventory/reserve/:reservationId
interface ReleaseInventoryResponse extends ApiResponse<{
  reservationId: UUID
  releasedAt: ISODateString
}> {}
```

## Real-time Inventory Checking Mechanism

### WebSocket Integration

```typescript
interface InventoryWebSocketClient {
  connect(sessionId: string): Promise<void>
  subscribe(productIds: UUID[]): Promise<void>
  unsubscribe(productIds: UUID[]): Promise<void>
  onInventoryUpdate(callback: (update: InventoryUpdate) => void): void
  onConnectionLost(callback: () => void): void
  disconnect(): void
}

interface InventoryUpdate {
  productId: UUID
  variantId?: UUID
  previousQuantity: number
  currentQuantity: number
  isAvailable: boolean
  timestamp: ISODateString
  reason: 'sale' | 'restock' | 'adjustment' | 'reservation'
}

// Implementation
const inventoryClient = new InventoryWebSocketClient()

// Connect and subscribe to cart items
await inventoryClient.connect(sessionId)
await inventoryClient.subscribe(cartItems.map(item => item.productId))

// Handle real-time updates
inventoryClient.onInventoryUpdate((update) => {
  if (!update.isAvailable) {
    showInventoryAlert(`${update.productId} is now out of stock`)
    updateCartItemAvailability(update.productId, false)
  }
})
```

### Polling Fallback Strategy

```typescript
interface InventoryPoller {
  startPolling(productIds: UUID[], interval: number): void
  stopPolling(): void
  onUpdate(callback: (updates: InventoryUpdate[]) => void): void
}

// Fallback implementation
const inventoryPoller = new InventoryPoller()

if (!isWebSocketSupported) {
  inventoryPoller.startPolling(
    cartItems.map(item => item.productId),
    30000 // 30 seconds
  )

  inventoryPoller.onUpdate((updates) => {
    updates.forEach(update => {
      if (!update.isAvailable) {
        handleOutOfStock(update.productId)
      }
    })
  })
}
```

## Stripe Webhook Event Handling

### Webhook Event Processor

```typescript
interface WebhookEventProcessor {
  processEvent(event: WebhookEvent): Promise<WebhookProcessingResult>
  retryFailedEvent(eventId: UUID): Promise<WebhookProcessingResult>
  getProcessingStatus(eventId: UUID): Promise<WebhookProcessingStatus>
}

interface WebhookProcessingResult {
  success: boolean
  eventId: UUID
  eventType: string
  processedAt: ISODateString
  error?: string
  retryCount: number
  nextRetryAt?: ISODateString
}

interface WebhookProcessingStatus {
  eventId: UUID
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retrying'
  attempts: number
  lastAttemptAt?: ISODateString
  error?: string
}

// Stripe webhook event handlers
const webhookHandlers = {
  'payment_intent.succeeded': async (event: WebhookEvent) => {
    const paymentIntent = event.data.object as PaymentIntent

    // Find the checkout session
    const checkoutSession = await getCheckoutSessionByPaymentIntent(paymentIntent.id)
    if (!checkoutSession) {
      throw new Error(`No checkout session found for payment intent ${paymentIntent.id}`)
    }

    // Create the order
    const order = await createOrderFromCheckoutSession(checkoutSession, paymentIntent)

    // Update checkout session status
    await updateCheckoutSessionStatus(checkoutSession.id, 'payment_success')

    // Send confirmation email
    await sendOrderConfirmationEmail(order)

    // Release inventory reservation
    await releaseInventoryReservation(checkoutSession.cartId)

    // Clear cart
    await clearCart(checkoutSession.cartId)

    return { orderId: order.id }
  },

  'payment_intent.payment_failed': async (event: WebhookEvent) => {
    const paymentIntent = event.data.object as PaymentIntent

    const checkoutSession = await getCheckoutSessionByPaymentIntent(paymentIntent.id)
    if (!checkoutSession) {
      throw new Error(`No checkout session found for payment intent ${paymentIntent.id}`)
    }

    // Update checkout session with error
    await updateCheckoutSessionStatus(checkoutSession.id, 'payment_failed', {
      error: paymentIntent.lastPaymentError
    })

    // Extend inventory reservation
    await extendInventoryReservation(checkoutSession.cartId, 3600) // 1 hour

    // Send payment failure notification
    await sendPaymentFailureNotification(checkoutSession)

    return { checkoutSessionId: checkoutSession.id }
  },

  'payment_method.attached': async (event: WebhookEvent) => {
    const paymentMethod = event.data.object

    // Save payment method for future use
    await saveCustomerPaymentMethod(paymentMethod)

    return { paymentMethodId: paymentMethod.id }
  }
}
```

### Webhook Security and Validation

```typescript
interface WebhookValidator {
  validateSignature(payload: string, signature: string, secret: string): boolean
  validateTimestamp(timestamp: number, tolerance: number): boolean
  validateEvent(event: WebhookEvent): ValidationResult
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Webhook signature validation
const validateStripeWebhook = (req: Request): WebhookEvent => {
  const signature = req.headers['stripe-signature']
  const payload = req.body

  if (!signature) {
    throw new Error('Missing Stripe signature')
  }

  // Validate signature
  const isValidSignature = webhookValidator.validateSignature(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  )

  if (!isValidSignature) {
    throw new Error('Invalid webhook signature')
  }

  // Parse event
  const event = JSON.parse(payload) as WebhookEvent

  // Validate timestamp (5 minutes tolerance)
  const isValidTimestamp = webhookValidator.validateTimestamp(
    event.created,
    300
  )

  if (!isValidTimestamp) {
    throw new Error('Webhook timestamp too old')
  }

  return event
}
```

## Comprehensive Error Handling Strategy

### Error Classification and Response

```typescript
interface ErrorHandler {
  handleValidationError(error: ValidationError[]): ApiResponse
  handleBusinessLogicError(error: BusinessLogicError): ApiResponse
  handleSystemError(error: SystemError): ApiResponse
  handlePaymentError(error: PaymentError): ApiResponse
}

interface BusinessLogicError {
  code: string
  message: string
  context?: Record<string, any>
  recoverable: boolean
  userMessage: string
}

interface SystemError {
  code: string
  message: string
  stack?: string
  requestId: string
  timestamp: ISODateString
}

// Error response formatting
const formatErrorResponse = (error: any, requestId: string): ApiResponse => {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'The request contains invalid data',
        details: error.details
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId,
        version: '1.0'
      }
    }
  }

  if (error instanceof BusinessLogicError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.userMessage || error.message
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId,
        version: '1.0'
      }
    }
  }

  // System errors - don't expose internal details
  logger.error('System error', { error, requestId })

  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again.'
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId,
      version: '1.0'
    }
  }
}

// Retry logic for transient errors
const retryPolicy = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryableErrors: [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'RATE_LIMIT_ERROR',
    'TEMPORARY_UNAVAILABLE'
  ]
}

const executeWithRetry = async <T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> => {
  let lastError: Error

  for (let attempt = 1; attempt <= retryPolicy.maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      if (!isRetryableError(error) || attempt === retryPolicy.maxAttempts) {
        throw error
      }

      const delay = Math.min(
        retryPolicy.baseDelay * Math.pow(retryPolicy.backoffMultiplier, attempt - 1),
        retryPolicy.maxDelay
      )

      logger.warn(`Retrying ${context} (attempt ${attempt}/${retryPolicy.maxAttempts})`, {
        error: error.message,
        delay
      })

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}
```

This comprehensive data flow and API design provides a robust foundation for implementing the checkout system with proper error handling, real-time inventory management, and secure payment processing.
