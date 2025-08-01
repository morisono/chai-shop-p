# Comprehensive Checkout Page Workflow Architecture

## System Architecture Overview

This document defines the complete architecture for a production-ready checkout system with both registered and guest user support, Stripe payment integration, and comprehensive security features.

## 1. Checkout Workflow State Machine

### State Definitions

```typescript
type CheckoutState =
  | 'cart_review'           // Initial state - cart review
  | 'user_identification'   // Guest vs registered user choice
  | 'guest_info'           // Guest checkout information
  | 'shipping_address'     // Shipping address entry
  | 'billing_address'      // Billing address (if different)
  | 'shipping_method'      // Shipping options selection
  | 'payment_method'       // Payment method selection
  | 'order_review'         // Final order review
  | 'payment_processing'   // Processing payment
  | 'payment_success'      // Successful payment
  | 'payment_failed'       // Failed payment
  | 'order_confirmation'   // Order confirmation display

type UserType = 'guest' | 'registered' | 'unknown'

interface CheckoutContext {
  userType: UserType
  userId?: string
  cartItems: CartItem[]
  guestInfo?: GuestInformation
  shippingAddress?: Address
  billingAddress?: Address
  shippingMethod?: ShippingMethod
  paymentMethod?: PaymentMethod
  orderTotal: OrderTotal
  promotions: AppliedPromotion[]
  errors: CheckoutError[]
  isLoading: boolean
}
```

### State Transitions

```typescript
const checkoutMachine = {
  id: 'checkout',
  initial: 'cart_review',
  context: {} as CheckoutContext,
  states: {
    cart_review: {
      on: {
        PROCEED_TO_CHECKOUT: {
          target: 'user_identification',
          cond: 'hasValidCartItems'
        },
        UPDATE_CART: { actions: 'updateCartItems' },
        APPLY_COUPON: { actions: 'applyCoupon' }
      }
    },
    user_identification: {
      on: {
        SELECT_GUEST: {
          target: 'guest_info',
          actions: 'setUserType'
        },
        SELECT_REGISTERED: {
          target: 'shipping_address',
          actions: 'setUserType',
          cond: 'isAuthenticated'
        },
        LOGIN_REQUIRED: 'auth_redirect'
      }
    },
    guest_info: {
      on: {
        SUBMIT_GUEST_INFO: {
          target: 'shipping_address',
          actions: 'saveGuestInfo',
          cond: 'isValidGuestInfo'
        }
      }
    },
    shipping_address: {
      on: {
        SUBMIT_SHIPPING: {
          target: 'billing_address',
          actions: 'saveShippingAddress',
          cond: 'isValidAddress'
        },
        USE_BILLING_AS_SHIPPING: {
          target: 'shipping_method',
          actions: 'copyShippingToBilling'
        }
      }
    },
    billing_address: {
      on: {
        SUBMIT_BILLING: {
          target: 'shipping_method',
          actions: 'saveBillingAddress',
          cond: 'isValidAddress'
        },
        USE_SHIPPING_ADDRESS: {
          target: 'shipping_method',
          actions: 'copyShippingToBilling'
        }
      }
    },
    shipping_method: {
      on: {
        SELECT_SHIPPING: {
          target: 'payment_method',
          actions: 'saveShippingMethod'
        }
      }
    },
    payment_method: {
      on: {
        SELECT_PAYMENT: {
          target: 'order_review',
          actions: 'savePaymentMethod'
        }
      }
    },
    order_review: {
      on: {
        CONFIRM_ORDER: {
          target: 'payment_processing',
          actions: 'initiatePayment'
        },
        EDIT_SHIPPING: 'shipping_address',
        EDIT_BILLING: 'billing_address',
        EDIT_PAYMENT: 'payment_method'
      }
    },
    payment_processing: {
      on: {
        PAYMENT_SUCCESS: {
          target: 'payment_success',
          actions: 'handlePaymentSuccess'
        },
        PAYMENT_FAILURE: {
          target: 'payment_failed',
          actions: 'handlePaymentFailure'
        }
      }
    },
    payment_success: {
      on: {
        PROCEED_TO_CONFIRMATION: {
          target: 'order_confirmation',
          actions: 'createOrder'
        }
      }
    },
    payment_failed: {
      on: {
        RETRY_PAYMENT: 'payment_method',
        CHANGE_PAYMENT_METHOD: 'payment_method'
      }
    },
    order_confirmation: {
      type: 'final'
    }
  }
}
```

## 2. Session Management Strategy

### Session Configuration
```typescript
interface SessionConfig {
  framework: 'better-auth'
  tokenStrategy: 'jwt + httpOnly-cookie'
  jwtExpiry: '1h'
  sessionExpiry: '7d'
  refreshPolicy: 'sliding-window'
  storage: {
    primary: 'postgresql'
    cache: 'redis' // Optional for high-performance
  }
  security: {
    csrfProtection: true
    sameSite: 'strict'
    secure: true
    httpOnly: true
  }
}

interface GuestSession {
  id: string
  cartId: string
  expiresAt: Date
  ipAddress: string
  userAgent: string
  checkoutData?: Partial<CheckoutContext>
}

interface RegisteredSession extends GuestSession {
  userId: string
  authToken: string
  refreshToken: string
}
```

### Session Persistence
```typescript
// Guest checkout data persistence
interface GuestCheckoutData {
  sessionId: string
  cartItems: CartItem[]
  guestInfo?: GuestInformation
  shippingAddress?: Address
  billingAddress?: Address
  expiresAt: Date
}

// Database schema additions needed
const guestSessions = pgTable('guest_sessions', {
  id: text('id').primaryKey(),
  cartId: text('cart_id').notNull(),
  checkoutData: jsonb('checkout_data'),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
```

## 3. Shopping Bag Management System

### CRUD Operations
```typescript
interface ShoppingBagService {
  // Create
  createCart(sessionId: string): Promise<Cart>
  createGuestCart(sessionId: string): Promise<Cart>

  // Read
  getCart(cartId: string): Promise<Cart | null>
  getCartBySession(sessionId: string): Promise<Cart | null>
  getCartItems(cartId: string): Promise<CartItem[]>

  // Update
  addItem(cartId: string, item: CartItemInput): Promise<CartItem>
  updateItemQuantity(cartId: string, itemId: string, quantity: number): Promise<CartItem>
  removeItem(cartId: string, itemId: string): Promise<void>
  applyCoupon(cartId: string, couponCode: string): Promise<AppliedCoupon>
  removeCoupon(cartId: string, couponId: string): Promise<void>

  // Delete
  clearCart(cartId: string): Promise<void>
  deleteExpiredCarts(): Promise<number>
}
```

### Storage Strategy
```typescript
interface StorageConfig {
  // In-memory for active sessions (Redis)
  activeStorage: {
    type: 'redis'
    ttl: '2h' // Active cart TTL
    keyPrefix: 'cart:'
  }

  // Persistent storage for checkout data
  persistentStorage: {
    type: 'postgresql'
    tables: ['carts', 'cart_items', 'applied_coupons']
  }

  // Concurrency control
  concurrency: {
    lockTimeout: '30s'
    retryAttempts: 3
    optimisticLocking: true
  }
}

// Database schema
const carts = pgTable('carts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  sessionId: text('session_id'),
  status: text('status').$type<'active' | 'abandoned' | 'converted'>().default('active'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  version: integer('version').default(1) // For optimistic locking
})

const cartItems = pgTable('cart_items', {
  id: text('id').primaryKey(),
  cartId: text('cart_id').references(() => carts.id, { onDelete: 'cascade' }).notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  metadata: jsonb('metadata'), // For product variants, customizations
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
```

## 4. Inventory Synchronization

### Real-time Stock Checking
```typescript
interface InventoryService {
  checkAvailability(productId: string, quantity: number): Promise<InventoryCheck>
  reserveInventory(items: CartItem[], reservationId: string): Promise<InventoryReservation>
  releaseReservation(reservationId: string): Promise<void>
  getStockLevel(productId: string): Promise<number>

  // Real-time updates
  subscribeToStockUpdates(productIds: string[], callback: StockUpdateCallback): Subscription
}

interface InventoryCheck {
  productId: string
  requested: number
  available: number
  isAvailable: boolean
  backorderInfo?: BackorderInfo
}

interface InventoryReservation {
  id: string
  items: ReservedItem[]
  expiresAt: Date
  status: 'active' | 'expired' | 'fulfilled' | 'cancelled'
}

// Fallback strategies
interface StockFallbackConfig {
  strategies: [
    {
      type: 'backorder'
      enabled: true
      estimatedDelivery: '2-3 weeks'
    },
    {
      type: 'substitute'
      enabled: true
      autoSuggest: true
    },
    {
      type: 'waitlist'
      enabled: true
      notifyOnAvailability: true
    }
  ]
}
```

### External System Integration
```typescript
// Recommended external inventory systems
interface InventorySystemConfig {
  primary: {
    provider: 'shipstation' | 'shopify' | 'woocommerce'
    apiEndpoint: string
    apiKey: string
    syncInterval: '5m'
    webhookEndpoint: '/api/inventory/webhook'
  }

  fallback: {
    provider: 'internal'
    database: 'postgresql'
    table: 'inventory'
  }

  // Real-time sync configuration
  realTimeSync: {
    enabled: true
    provider: 'pusher' | 'socket.io' | 'websocket'
    channels: ['inventory-updates']
    throttle: '1s' // Prevent spam updates
  }
}
```

## 5. Promotions and Coupon System

### Coupon Application Flow
```typescript
interface CouponService {
  validateCoupon(code: string, cartId: string): Promise<CouponValidation>
  applyCoupon(code: string, cartId: string): Promise<AppliedCoupon>
  removeCoupon(cartId: string, couponId: string): Promise<void>
  calculateDiscount(cart: Cart, coupons: AppliedCoupon[]): Promise<DiscountCalculation>
}

interface CouponValidation {
  isValid: boolean
  coupon?: Coupon
  errors: ValidationError[]
  conflicts: CouponConflict[]
}

interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y'
  value: number
  minimumOrderAmount?: number
  maximumDiscount?: number
  startDate: Date
  endDate: Date
  usageLimit?: number
  usageCount: number
  isActive: boolean
  combinable: boolean
  applicableProducts?: string[]
  excludedProducts?: string[]
}

// Combinability rules
interface CombinabilityRules {
  maxCouponsPerOrder: number
  allowPercentageWithFixed: boolean
  allowMultiplePercentage: boolean
  allowFreeShippingCombination: boolean
  priorityOrder: CouponType[]
}
```

### Database Schema for Promotions
```typescript
const coupons = pgTable('coupons', {
  id: text('id').primaryKey(),
  code: text('code').unique().notNull(),
  type: text('type').$type<CouponType>().notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minimumOrderAmount: decimal('minimum_order_amount', { precision: 10, scale: 2 }),
  maximumDiscount: decimal('maximum_discount', { precision: 10, scale: 2 }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').default(0),
  isActive: boolean('is_active').default(true),
  combinable: boolean('combinable').default(false),
  metadata: jsonb('metadata'), // For complex rules
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

const appliedCoupons = pgTable('applied_coupons', {
  id: text('id').primaryKey(),
  cartId: text('cart_id').references(() => carts.id, { onDelete: 'cascade' }).notNull(),
  couponId: text('coupon_id').references(() => coupons.id).notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull(),
  appliedAt: timestamp('applied_at').defaultNow()
})
```

## 6. Comprehensive Checkout Flow

### Address Validation
```typescript
interface AddressValidationService {
  validateAddress(address: Address): Promise<AddressValidation>
  suggestCorrections(address: Address): Promise<AddressSuggestion[]>
  verifyDeliverability(address: Address): Promise<DeliverabilityCheck>
}

interface AddressValidation {
  isValid: boolean
  standardizedAddress?: Address
  suggestions: AddressSuggestion[]
  confidence: number
  deliverabilityScore: number
}

// Recommended: Use external services
interface AddressServiceConfig {
  primary: {
    provider: 'google_maps' | 'usps' | 'ups' | 'fedex'
    apiKey: string
    endpoint: string
  }
  fallback: {
    provider: 'manual_validation'
    rules: ValidationRule[]
  }
}
```

### Tax and Shipping Calculation
```typescript
interface TaxCalculationService {
  calculateTax(order: OrderSummary): Promise<TaxCalculation>
  getApplicableTaxRates(address: Address): Promise<TaxRate[]>
}

interface ShippingCalculationService {
  getShippingOptions(cart: Cart, address: Address): Promise<ShippingOption[]>
  calculateShippingCost(items: CartItem[], address: Address, method: ShippingMethod): Promise<ShippingCost>
  estimateDeliveryDate(address: Address, method: ShippingMethod): Promise<DeliveryEstimate>
}

interface TaxCalculation {
  subtotal: number
  taxAmount: number
  taxRate: number
  taxBreakdown: TaxBreakdownItem[]
  applicableRates: ApplicableTaxRate[]
}

interface ShippingOption {
  id: string
  name: string
  description: string
  cost: number
  estimatedDays: number
  carrier: string
  serviceType: string
  trackingAvailable: boolean
}

// External service recommendations
interface TaxServiceConfig {
  provider: 'stripe_tax' | 'avalara' | 'taxjar' | 'manual'
  apiKey: string
  enableAutoCalculation: true
  cacheResults: true
  cacheTTL: '1h'
}

interface ShippingServiceConfig {
  providers: [
    {
      name: 'ups'
      apiKey: string
      accountNumber: string
      services: ['ground', 'next_day', '2_day']
    },
    {
      name: 'fedex'
      apiKey: string
      accountNumber: string
      services: ['ground', 'express', 'overnight']
    }
  ]
  fallback: {
    provider: 'flat_rate'
    rates: FlatRate[]
  }
}
```

## 7. Payment Infrastructure

### Stripe Integration Architecture
```typescript
interface PaymentInfrastructure {
  processor: {
    primary: 'stripe'
    fallback: 'stripe_alternate_account'
    account: {
      publishableKey: string
      secretKey: string
      webhookSecret: string
    }
  }

  webhookEndpoints: {
    paymentSucceeded: '/api/webhooks/stripe/payment-succeeded'
    paymentFailed: '/api/webhooks/stripe/payment-failed'
    invoicePaid: '/api/webhooks/stripe/invoice-paid'
    subscriptionUpdated: '/api/webhooks/stripe/subscription-updated'
  }

  retryLogic: {
    maxAttempts: 3
    backoffStrategy: 'exponential'
    timeouts: ['30s', '60s', '120s']
  }

  security: {
    webhookVerification: true
    toleranceWindow: '5m'
    endpointRotation: 'weekly'
    ipWhitelist: StripeIPRanges
  }
}

interface StripePaymentService {
  createPaymentIntent(order: OrderSummary): Promise<PaymentIntent>
  confirmPayment(paymentIntentId: string, paymentMethod: PaymentMethodData): Promise<PaymentResult>
  handleWebhook(event: StripeEvent): Promise<WebhookResponse>
  refundPayment(paymentIntentId: string, amount?: number): Promise<RefundResult>

  // Advanced features
  createSetupIntent(customerId: string): Promise<SetupIntent>
  savePaymentMethod(customerId: string, paymentMethod: PaymentMethodData): Promise<SavedPaymentMethod>
  processSubscription(subscriptionData: SubscriptionData): Promise<Subscription>
}
```

### Payment Method Support
```typescript
interface PaymentMethodConfig {
  supportedMethods: [
    {
      type: 'card'
      providers: ['visa', 'mastercard', 'amex', 'discover']
      enabled: true
      fees: {
        domestic: 2.9
        international: 3.9
      }
    },
    {
      type: 'digital_wallet'
      providers: ['apple_pay', 'google_pay', 'paypal']
      enabled: true
    },
    {
      type: 'bank_transfer'
      providers: ['ach', 'wire_transfer']
      enabled: false // Future implementation
    },
    {
      type: 'buy_now_pay_later'
      providers: ['klarna', 'afterpay']
      enabled: false // Future implementation
    }
  ]

  // Security settings
  security: {
    require3DS: 'automatic' // 'always' | 'never' | 'automatic'
    enableFraudDetection: true
    velocityChecks: true
    riskThreshold: 'medium'
  }
}
```

## 8. Security Implementation

### CSRF Protection
```typescript
interface CSRFConfig {
  tokenGeneration: {
    algorithm: 'SHA256'
    secretRotation: '24h'
    tokenLength: 32
  }

  validation: {
    headerName: 'X-CSRF-Token'
    cookieName: '__Host-csrf-token'
    sameSite: 'strict'
    secure: true
    httpOnly: false // Needs JS access
  }

  exemptRoutes: [
    '/api/webhooks/stripe/*' // Webhook endpoints
  ]
}

// CSRF middleware implementation
const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (isExemptRoute(req.path)) return next()

  const token = req.headers['x-csrf-token'] || req.body._csrf
  const sessionToken = req.cookies['__Host-csrf-token']

  if (!validateCSRFToken(token, sessionToken)) {
    return res.status(403).json({ error: 'Invalid CSRF token' })
  }

  next()
}
```

### Input Validation and Sanitization
```typescript
interface ValidationRules {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    maxLength: 320
    required: true
  }

  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/
    minLength: 10
    maxLength: 20
    required: false
  }

  address: {
    street: { maxLength: 200, required: true }
    city: { maxLength: 100, required: true }
    state: { maxLength: 50, required: true }
    zipCode: { pattern: /^\d{5}(-\d{4})?$/, required: true }
    country: { enum: ISO_COUNTRY_CODES, required: true }
  }

  payment: {
    cardNumber: { luhnCheck: true, encrypt: true }
    expiryDate: { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/ }
    cvv: { pattern: /^\d{3,4}$/, noLog: true }
  }
}

// Zod schemas for validation
const addressSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  street1: z.string().min(1).max(200),
  street2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(2).max(50),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  country: z.enum(COUNTRY_CODES),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional()
})

const guestInfoSchema = z.object({
  email: z.string().email().max(320),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional(),
  marketingConsent: z.boolean().default(false)
})
```

### Rate Limiting
```typescript
interface RateLimitConfig {
  global: {
    windowMs: 15 * 60 * 1000 // 15 minutes
    maxRequests: 1000
    message: 'Too many requests, please try again later'
  }

  endpoints: {
    '/api/checkout/*': {
      windowMs: 5 * 60 * 1000 // 5 minutes
      maxRequests: 50
      skipSuccessfulRequests: false
    }

    '/api/payment/create-intent': {
      windowMs: 5 * 60 * 1000
      maxRequests: 10
      skipSuccessfulRequests: true
    }

    '/api/auth/login': {
      windowMs: 15 * 60 * 1000
      maxRequests: 5
      blockDuration: 30 * 60 * 1000 // 30 min block
    }
  }

  // Advanced rate limiting
  adaptive: {
    enabled: true
    baseLimit: 100
    surgeMultiplier: 0.5 // Reduce limit during high load
    monitorInterval: '1m'
  }
}

// Implementation with Redis
const rateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    })
  }
})
```

### Audit Logging
```typescript
interface AuditLogService {
  logCheckoutEvent(event: CheckoutAuditEvent): Promise<void>
  logPaymentEvent(event: PaymentAuditEvent): Promise<void>
  logSecurityEvent(event: SecurityAuditEvent): Promise<void>
  queryLogs(filters: AuditLogFilters): Promise<AuditLog[]>
}

interface CheckoutAuditEvent {
  type: 'cart_created' | 'item_added' | 'coupon_applied' | 'checkout_started' | 'checkout_completed'
  userId?: string
  sessionId: string
  cartId: string
  metadata: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

interface PaymentAuditEvent {
  type: 'payment_initiated' | 'payment_succeeded' | 'payment_failed' | 'refund_processed'
  paymentIntentId: string
  amount: number
  currency: string
  paymentMethod: string
  status: string
  metadata: Record<string, any>
  timestamp: Date
}

// Database schema for audit logs
const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  userId: text('user_id'),
  sessionId: text('session_id'),
  action: text('action').notNull(),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow()
})
```

This comprehensive architecture provides a production-ready foundation for implementing the checkout page workflow with both registered and guest user support, complete Stripe integration, and enterprise-level security features.
