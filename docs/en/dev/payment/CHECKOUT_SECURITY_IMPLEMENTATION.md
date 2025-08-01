# Checkout Security Implementation Specifications

## CSRF Protection Implementation

### Token Generation and Validation

```typescript
interface CSRFTokenService {
  generateToken(sessionId: string): Promise<CSRFToken>
  validateToken(token: string, sessionId: string): Promise<boolean>
  refreshToken(sessionId: string): Promise<CSRFToken>
  revokeToken(sessionId: string): Promise<void>
}

interface CSRFToken {
  token: string
  expiresAt: Date
  sessionId: string
  createdAt: Date
}

class CSRFTokenServiceImpl implements CSRFTokenService {
  private readonly secretKey: string
  private readonly tokenExpiry: number = 24 * 60 * 60 * 1000 // 24 hours

  constructor() {
    this.secretKey = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex')
  }

  async generateToken(sessionId: string): Promise<CSRFToken> {
    const timestamp = Date.now()
    const randomBytes = crypto.randomBytes(16).toString('hex')

    // Create HMAC signature
    const payload = `${sessionId}.${timestamp}.${randomBytes}`
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(payload)
      .digest('hex')

    const token = `${payload}.${signature}`

    return {
      token,
      expiresAt: new Date(timestamp + this.tokenExpiry),
      sessionId,
      createdAt: new Date(timestamp)
    }
  }

  async validateToken(token: string, sessionId: string): Promise<boolean> {
    try {
      const parts = token.split('.')
      if (parts.length !== 4) return false

      const [tokenSessionId, timestamp, randomBytes, signature] = parts

      // Verify session ID matches
      if (tokenSessionId !== sessionId) return false

      // Verify token hasn't expired
      const tokenTime = parseInt(timestamp)
      if (Date.now() - tokenTime > this.tokenExpiry) return false

      // Verify signature
      const payload = `${tokenSessionId}.${timestamp}.${randomBytes}`
      const expectedSignature = crypto
        .createHmac('sha256', this.secretKey)
        .update(payload)
        .digest('hex')

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      )
    } catch (error) {
      return false
    }
  }

  async refreshToken(sessionId: string): Promise<CSRFToken> {
    return this.generateToken(sessionId)
  }

  async revokeToken(sessionId: string): Promise<void> {
    // Remove from Redis cache if using caching
    await redis.del(`csrf:${sessionId}`)
  }
}
```

### CSRF Middleware Implementation

```typescript
interface CSRFMiddlewareConfig {
  tokenService: CSRFTokenService
  headerName: string
  cookieName: string
  exemptPaths: string[]
  exemptMethods: string[]
  onTokenMismatch: (req: Request, res: Response) => void
}

const createCSRFMiddleware = (config: CSRFMiddlewareConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { method, path } = req

    // Skip CSRF for exempt methods
    if (config.exemptMethods.includes(method)) {
      return next()
    }

    // Skip CSRF for exempt paths (webhooks, etc.)
    if (config.exemptPaths.some(exemptPath => path.startsWith(exemptPath))) {
      return next()
    }

    const sessionId = req.session?.id || req.headers['x-session-id']
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_SESSION',
          message: 'Session required for this operation'
        }
      })
    }

    // Extract CSRF token from header or body
    const csrfToken = req.headers[config.headerName.toLowerCase()] ||
                     req.body._csrf ||
                     req.query._csrf

    if (!csrfToken) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CSRF_TOKEN_MISSING',
          message: 'CSRF token required'
        }
      })
    }

    // Validate token
    const isValid = await config.tokenService.validateToken(csrfToken as string, sessionId)

    if (!isValid) {
      config.onTokenMismatch(req, res)
      return res.status(403).json({
        success: false,
        error: {
          code: 'CSRF_TOKEN_INVALID',
          message: 'Invalid or expired CSRF token'
        }
      })
    }

    next()
  }
}

// Usage
const csrfMiddleware = createCSRFMiddleware({
  tokenService: new CSRFTokenServiceImpl(),
  headerName: 'X-CSRF-Token',
  cookieName: '__Host-csrf-token',
  exemptPaths: ['/api/webhooks/', '/api/health'],
  exemptMethods: ['GET', 'HEAD', 'OPTIONS'],
  onTokenMismatch: (req, res) => {
    logger.warn('CSRF token mismatch', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path,
      sessionId: req.session?.id
    })
  }
})

// Apply to checkout routes
app.use('/api/checkout', csrfMiddleware)
app.use('/api/cart', csrfMiddleware)
app.use('/api/payment', csrfMiddleware)
```

## Input Validation and Sanitization

### Zod Schema Definitions

```typescript
import { z } from 'zod'

// Base validation schemas
const emailSchema = z.string()
  .email('Please enter a valid email address')
  .max(320, 'Email address is too long')
  .transform(email => email.toLowerCase().trim())

const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
  .min(10, 'Phone number is too short')
  .max(20, 'Phone number is too long')
  .optional()
  .transform(phone => phone ? phone.replace(/[^\d+]/g, '') : undefined)

const nameSchema = z.string()
  .min(1, 'This field is required')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters')
  .transform(name => name.trim())

const postalCodeSchema = z.string()
  .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code')
  .transform(zip => zip.replace(/\D/g, ''))

// Guest information validation
export const guestInformationSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  marketingConsent: z.boolean().default(false)
})

// Address validation
export const addressSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  company: z.string().max(100).optional().transform(val => val?.trim()),
  street1: z.string()
    .min(1, 'Street address is required')
    .max(200, 'Street address is too long')
    .transform(addr => addr.trim()),
  street2: z.string()
    .max(200, 'Address line 2 is too long')
    .optional()
    .transform(addr => addr?.trim()),
  city: z.string()
    .min(1, 'City is required')
    .max(100, 'City name is too long')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'City contains invalid characters')
    .transform(city => city.trim()),
  state: z.string()
    .min(2, 'State is required')
    .max(50, 'State name is too long')
    .regex(/^[A-Z]{2}$/, 'Please select a valid state'),
  zipCode: postalCodeSchema,
  country: z.string()
    .length(2, 'Please select a valid country')
    .regex(/^[A-Z]{2}$/, 'Invalid country code'),
  phone: phoneSchema
})

// Cart item validation
export const cartItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  variantId: z.string().uuid('Invalid variant ID').optional(),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(100, 'Quantity cannot exceed 100'),
  customizations: z.array(z.object({
    type: z.string().min(1).max(50),
    name: z.string().min(1).max(100),
    value: z.string().min(1).max(500),
    price: z.number().min(0).max(10000)
  })).optional()
})

// Coupon code validation
export const couponCodeSchema = z.string()
  .min(1, 'Coupon code is required')
  .max(50, 'Coupon code is too long')
  .regex(/^[A-Z0-9\-_]+$/, 'Invalid coupon code format')
  .transform(code => code.toUpperCase().trim())

// Payment data validation (client-side only - never log)
export const paymentMethodSchema = z.object({
  type: z.enum(['card', 'digital_wallet', 'bank_transfer']),
  saveForFuture: z.boolean().default(false)
}).strict() // Prevent additional fields

// Order note validation
export const orderNoteSchema = z.string()
  .max(500, 'Order note is too long')
  .optional()
  .transform(note => note?.trim())
```

### Input Sanitization Service

```typescript
interface SanitizationService {
  sanitizeHtml(input: string): string
  sanitizeFileName(input: string): string
  sanitizeSearchQuery(input: string): string
  validateAndSanitize<T>(data: unknown, schema: z.ZodSchema<T>): T
}

class SanitizationServiceImpl implements SanitizationService {
  private readonly dompurify = require('isomorphic-dompurify')

  sanitizeHtml(input: string): string {
    return this.dompurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: []
    })
  }

  sanitizeFileName(input: string): string {
    return input
      .replace(/[^\w\s\-_.]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .substring(0, 100) // Limit length
  }

  sanitizeSearchQuery(input: string): string {
    return input
      .replace(/[<>'"&]/g, '') // Remove potential XSS characters
      .trim()
      .substring(0, 100) // Limit length
  }

  validateAndSanitize<T>(data: unknown, schema: z.ZodSchema<T>): T {
    try {
      return schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid input data', error.errors)
      }
      throw error
    }
  }
}

// Validation middleware
const createValidationMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const sanitizer = new SanitizationServiceImpl()
      req.validatedBody = sanitizer.validateAndSanitize(req.body, schema)
      next()
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors
          }
        })
      }
      next(error)
    }
  }
}

// Usage examples
app.post('/api/checkout/guest-info',
  createValidationMiddleware(guestInformationSchema),
  async (req: Request, res: Response) => {
    const guestInfo = req.validatedBody // Type-safe validated data
    // Process guest information...
  }
)

app.post('/api/cart/:cartId/items',
  createValidationMiddleware(cartItemSchema),
  async (req: Request, res: Response) => {
    const cartItem = req.validatedBody
    // Add item to cart...
  }
)
```

## Rate Limiting Implementation

### Redis-Based Rate Limiter

```typescript
interface RateLimiter {
  checkLimit(key: string, config: RateLimitConfig): Promise<RateLimitResult>
  resetLimit(key: string, config: RateLimitConfig): Promise<void>
  getUsage(key: string, config: RateLimitConfig): Promise<RateLimitUsage>
}

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (req: Request) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  blockDuration?: number
}

interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: Date
  retryAfter?: number
}

interface RateLimitUsage {
  requests: number
  limit: number
  remaining: number
  resetTime: Date
}

class RedisRateLimiter implements RateLimiter {
  private readonly redis: Redis

  constructor(redisClient: Redis) {
    this.redis = redisClient
  }

  async checkLimit(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now()
    const window = Math.floor(now / config.windowMs)
    const redisKey = `rate_limit:${key}:${window}`

    // Use Redis pipeline for atomic operations
    const pipeline = this.redis.pipeline()
    pipeline.incr(redisKey)
    pipeline.expire(redisKey, Math.ceil(config.windowMs / 1000))

    const results = await pipeline.exec()
    const requests = results![0][1] as number

    const remaining = Math.max(0, config.maxRequests - requests)
    const resetTime = new Date((window + 1) * config.windowMs)

    if (requests > config.maxRequests) {
      // Check if there's a block duration
      if (config.blockDuration) {
        const blockKey = `rate_limit_block:${key}`
        await this.redis.setex(blockKey, Math.ceil(config.blockDuration / 1000), '1')

        return {
          allowed: false,
          limit: config.maxRequests,
          remaining: 0,
          resetTime,
          retryAfter: config.blockDuration
        }
      }

      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime,
        retryAfter: Math.ceil((resetTime.getTime() - now) / 1000)
      }
    }

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining,
      resetTime
    }
  }

  async resetLimit(key: string, config: RateLimitConfig): Promise<void> {
    const now = Date.now()
    const window = Math.floor(now / config.windowMs)
    const redisKey = `rate_limit:${key}:${window}`

    await this.redis.del(redisKey)
  }

  async getUsage(key: string, config: RateLimitConfig): Promise<RateLimitUsage> {
    const now = Date.now()
    const window = Math.floor(now / config.windowMs)
    const redisKey = `rate_limit:${key}:${window}`

    const requests = await this.redis.get(redisKey) || 0
    const remaining = Math.max(0, config.maxRequests - Number(requests))
    const resetTime = new Date((window + 1) * config.windowMs)

    return {
      requests: Number(requests),
      limit: config.maxRequests,
      remaining,
      resetTime
    }
  }
}
```

### Rate Limiting Middleware

```typescript
interface RateLimitMiddlewareConfig extends RateLimitConfig {
  rateLimiter: RateLimiter
  message?: string
  standardHeaders?: boolean
  legacyHeaders?: boolean
  onLimitReached?: (req: Request, res: Response) => void
}

const createRateLimitMiddleware = (config: RateLimitMiddlewareConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Generate rate limit key
    const key = config.keyGenerator ?
      config.keyGenerator(req) :
      `${req.ip}:${req.path}`

    try {
      const result = await config.rateLimiter.checkLimit(key, config)

      // Set rate limit headers
      if (config.standardHeaders !== false) {
        res.set({
          'RateLimit-Limit': result.limit.toString(),
          'RateLimit-Remaining': result.remaining.toString(),
          'RateLimit-Reset': Math.ceil(result.resetTime.getTime() / 1000).toString()
        })
      }

      if (config.legacyHeaders !== false) {
        res.set({
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(result.resetTime.getTime() / 1000).toString()
        })
      }

      if (!result.allowed) {
        if (result.retryAfter) {
          res.set('Retry-After', Math.ceil(result.retryAfter / 1000).toString())
        }

        if (config.onLimitReached) {
          config.onLimitReached(req, res)
        }

        return res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: config.message || 'Too many requests, please try again later'
          },
          metadata: {
            retryAfter: result.retryAfter,
            resetTime: result.resetTime.toISOString()
          }
        })
      }

      next()
    } catch (error) {
      // If rate limiting fails, allow the request to proceed
      logger.error('Rate limiting error', { error, key })
      next()
    }
  }
}

// Rate limiting configurations
const rateLimitConfigs = {
  global: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    keyGenerator: (req: Request) => req.ip
  },

  checkout: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 50,
    keyGenerator: (req: Request) => `${req.ip}:${req.session?.id || 'anonymous'}`
  },

  paymentIntent: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10,
    blockDuration: 30 * 60 * 1000, // 30 minutes block
    keyGenerator: (req: Request) => `${req.ip}:${req.session?.id || 'anonymous'}`
  },

  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    blockDuration: 30 * 60 * 1000, // 30 minutes block
    keyGenerator: (req: Request) => req.ip
  }
}

// Apply rate limiting
const rateLimiter = new RedisRateLimiter(redisClient)

app.use(createRateLimitMiddleware({
  ...rateLimitConfigs.global,
  rateLimiter
}))

app.use('/api/checkout', createRateLimitMiddleware({
  ...rateLimitConfigs.checkout,
  rateLimiter,
  message: 'Too many checkout requests. Please wait before trying again.'
}))

app.use('/api/payment/create-intent', createRateLimitMiddleware({
  ...rateLimitConfigs.paymentIntent,
  rateLimiter,
  message: 'Too many payment attempts. Please wait before trying again.',
  onLimitReached: (req, res) => {
    logger.warn('Payment rate limit exceeded', {
      ip: req.ip,
      sessionId: req.session?.id,
      userAgent: req.headers['user-agent']
    })
  }
}))
```

## Secure Session Token Management

### JWT Token Service

```typescript
interface JWTTokenService {
  generateToken(payload: TokenPayload, options?: TokenOptions): Promise<string>
  verifyToken(token: string): Promise<TokenPayload>
  refreshToken(refreshToken: string): Promise<TokenPair>
  revokeToken(tokenId: string): Promise<void>
  isTokenRevoked(tokenId: string): Promise<boolean>
}

interface TokenPayload {
  sub: string // Subject (user ID)
  iat: number // Issued at
  exp: number // Expires at
  jti: string // JWT ID
  type: 'access' | 'refresh'
  sessionId?: string
  scope?: string[]
}

interface TokenOptions {
  expiresIn?: string
  audience?: string
  issuer?: string
}

interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

class JWTTokenServiceImpl implements JWTTokenService {
  private readonly secretKey: string
  private readonly issuer: string
  private readonly audience: string

  constructor() {
    this.secretKey = process.env.JWT_SECRET!
    this.issuer = process.env.JWT_ISSUER || 'checkout-api'
    this.audience = process.env.JWT_AUDIENCE || 'checkout-client'
  }

  async generateToken(payload: TokenPayload, options?: TokenOptions): Promise<string> {
    const now = Math.floor(Date.now() / 1000)

    const tokenPayload = {
      ...payload,
      iat: now,
      iss: this.issuer,
      aud: options?.audience || this.audience,
      jti: payload.jti || crypto.randomUUID()
    }

    if (options?.expiresIn) {
      tokenPayload.exp = now + this.parseExpiresIn(options.expiresIn)
    }

    return jwt.sign(tokenPayload, this.secretKey, {
      algorithm: 'HS256'
    })
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.secretKey, {
        algorithms: ['HS256'],
        issuer: this.issuer,
        audience: this.audience
      }) as TokenPayload

      // Check if token is revoked
      const isRevoked = await this.isTokenRevoked(decoded.jti)
      if (isRevoked) {
        throw new Error('Token has been revoked')
      }

      return decoded
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const payload = await this.verifyToken(refreshToken)

    if (payload.type !== 'refresh') {
      throw new Error('Invalid refresh token')
    }

    // Revoke old refresh token
    await this.revokeToken(payload.jti)

    // Generate new token pair
    const accessTokenId = crypto.randomUUID()
    const refreshTokenId = crypto.randomUUID()

    const accessToken = await this.generateToken({
      sub: payload.sub,
      type: 'access',
      sessionId: payload.sessionId,
      scope: payload.scope,
      jti: accessTokenId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    })

    const newRefreshToken = await this.generateToken({
      sub: payload.sub,
      type: 'refresh',
      sessionId: payload.sessionId,
      jti: refreshTokenId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 // 7 days
    })

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600
    }
  }

  async revokeToken(tokenId: string): Promise<void> {
    await redis.sadd('revoked_tokens', tokenId)
    await redis.expire('revoked_tokens', 7 * 24 * 3600) // Keep for 7 days
  }

  async isTokenRevoked(tokenId: string): Promise<boolean> {
    const result = await redis.sismember('revoked_tokens', tokenId)
    return Boolean(result)
  }

  private parseExpiresIn(expiresIn: string): number {
    const units: Record<string, number> = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400
    }

    const match = expiresIn.match(/^(\d+)([smhd])$/)
    if (!match) {
      throw new Error('Invalid expiresIn format')
    }

    const [, amount, unit] = match
    return parseInt(amount) * units[unit]
  }
}
```

### Secure Cookie Configuration

```typescript
interface SecureCookieConfig {
  name: string
  secure: boolean
  httpOnly: boolean
  sameSite: 'strict' | 'lax' | 'none'
  maxAge: number
  domain?: string
  path: string
  signed: boolean
}

const cookieConfigs = {
  sessionToken: {
    name: '__Host-session-token',
    secure: true, // HTTPS only
    httpOnly: true, // Not accessible via JavaScript
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
    signed: true
  },

  csrfToken: {
    name: '__Host-csrf-token',
    secure: true,
    httpOnly: false, // Needs JavaScript access
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
    signed: false
  },

  cartId: {
    name: '__Secure-cart-id',
    secure: true,
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
    signed: true
  }
}

const setSecureCookie = (
  res: Response,
  config: SecureCookieConfig,
  value: string
) => {
  res.cookie(config.name, value, {
    secure: config.secure,
    httpOnly: config.httpOnly,
    sameSite: config.sameSite,
    maxAge: config.maxAge,
    domain: config.domain,
    path: config.path,
    signed: config.signed
  })
}

const getSecureCookie = (
  req: Request,
  config: SecureCookieConfig
): string | undefined => {
  if (config.signed) {
    return req.signedCookies[config.name]
  }
  return req.cookies[config.name]
}
```

## Audit Logging for Transactions

### Comprehensive Audit System

```typescript
interface AuditLogger {
  logEvent(event: AuditEvent): Promise<void>
  logSecurityEvent(event: SecurityAuditEvent): Promise<void>
  logTransactionEvent(event: TransactionAuditEvent): Promise<void>
  queryAuditLogs(filters: AuditLogFilters): Promise<AuditLogEntry[]>
}

interface BaseAuditEvent {
  eventId: string
  timestamp: Date
  userId?: string
  sessionId?: string
  ipAddress: string
  userAgent: string
  action: string
  resource: string
  resourceId?: string
  success: boolean
  errorCode?: string
  metadata?: Record<string, any>
}

interface SecurityAuditEvent extends BaseAuditEvent {
  category: 'security'
  securityLevel: 'low' | 'medium' | 'high' | 'critical'
  threatType?: string
  blocked: boolean
}

interface TransactionAuditEvent extends BaseAuditEvent {
  category: 'transaction'
  transactionType: 'payment' | 'refund' | 'cancellation'
  amount?: number
  currency?: string
  paymentMethod?: string
  status: string
}

interface AuditEvent extends BaseAuditEvent {
  category: 'checkout' | 'cart' | 'user' | 'system'
}

interface AuditLogEntry {
  id: string
  eventId: string
  category: string
  timestamp: Date
  userId?: string
  sessionId?: string
  ipAddress: string
  userAgent: string
  action: string
  resource: string
  resourceId?: string
  success: boolean
  errorCode?: string
  securityLevel?: string
  amount?: number
  currency?: string
  metadata: Record<string, any>
  createdAt: Date
}

interface AuditLogFilters {
  startDate?: Date
  endDate?: Date
  userId?: string
  sessionId?: string
  category?: string
  action?: string
  resource?: string
  success?: boolean
  securityLevel?: string
  limit?: number
  offset?: number
}

class DatabaseAuditLogger implements AuditLogger {
  private readonly db: DatabaseConnection

  async logEvent(event: AuditEvent): Promise<void> {
    try {
      await this.db.insert(auditLogs).values({
        id: crypto.randomUUID(),
        eventId: event.eventId,
        category: event.category,
        timestamp: event.timestamp,
        userId: event.userId,
        sessionId: event.sessionId,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        action: event.action,
        resource: event.resource,
        resourceId: event.resourceId,
        success: event.success,
        errorCode: event.errorCode,
        metadata: event.metadata || {},
        createdAt: new Date()
      })
    } catch (error) {
      // Log to fallback system (file, external service)
      logger.error('Failed to write audit log', { event, error })
    }
  }

  async logSecurityEvent(event: SecurityAuditEvent): Promise<void> {
    await this.logEvent(event)

    // Send critical security events to monitoring system
    if (event.securityLevel === 'critical') {
      await this.alertSecurityTeam(event)
    }
  }

  async logTransactionEvent(event: TransactionAuditEvent): Promise<void> {
    await this.logEvent(event)

    // Additional processing for financial transactions
    if (event.amount && event.amount > 10000) { // High value transaction
      await this.flagHighValueTransaction(event)
    }
  }

  async queryAuditLogs(filters: AuditLogFilters): Promise<AuditLogEntry[]> {
    let query = this.db.select().from(auditLogs)

    if (filters.startDate) {
      query = query.where(gte(auditLogs.timestamp, filters.startDate))
    }

    if (filters.endDate) {
      query = query.where(lte(auditLogs.timestamp, filters.endDate))
    }

    if (filters.userId) {
      query = query.where(eq(auditLogs.userId, filters.userId))
    }

    if (filters.category) {
      query = query.where(eq(auditLogs.category, filters.category))
    }

    if (filters.success !== undefined) {
      query = query.where(eq(auditLogs.success, filters.success))
    }

    return query
      .limit(filters.limit || 100)
      .offset(filters.offset || 0)
      .orderBy(desc(auditLogs.timestamp))
  }

  private async alertSecurityTeam(event: SecurityAuditEvent): Promise<void> {
    // Send to security monitoring system
    await fetch(process.env.SECURITY_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alert: 'Critical Security Event',
        event,
        timestamp: new Date().toISOString()
      })
    })
  }

  private async flagHighValueTransaction(event: TransactionAuditEvent): Promise<void> {
    // Flag for manual review
    await this.db.insert(transactionReviews).values({
      id: crypto.randomUUID(),
      eventId: event.eventId,
      amount: event.amount!,
      currency: event.currency!,
      reason: 'High value transaction',
      status: 'pending_review',
      createdAt: new Date()
    })
  }
}

// Audit middleware
const auditMiddleware = (auditLogger: AuditLogger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()
    const eventId = crypto.randomUUID()

    // Capture original response methods
    const originalSend = res.send
    const originalJson = res.json

    let responseBody: any
    let success = true

    // Override response methods to capture data
    res.send = function(body) {
      responseBody = body
      success = res.statusCode < 400
      return originalSend.call(this, body)
    }

    res.json = function(body) {
      responseBody = body
      success = res.statusCode < 400
      return originalJson.call(this, body)
    }

    // Log the event when response finishes
    res.on('finish', async () => {
      const duration = Date.now() - startTime

      const auditEvent: AuditEvent = {
        eventId,
        category: this.getCategoryFromPath(req.path),
        timestamp: new Date(startTime),
        userId: req.user?.id,
        sessionId: req.session?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || '',
        action: `${req.method} ${req.path}`,
        resource: req.path,
        resourceId: req.params.id,
        success,
        errorCode: success ? undefined : res.statusCode.toString(),
        metadata: {
          duration,
          requestSize: req.headers['content-length'],
          responseSize: res.get('content-length'),
          method: req.method,
          statusCode: res.statusCode
        }
      }

      await auditLogger.logEvent(auditEvent)
    })

    next()
  }

  private getCategoryFromPath(path: string): string {
    if (path.startsWith('/api/checkout')) return 'checkout'
    if (path.startsWith('/api/cart')) return 'cart'
    if (path.startsWith('/api/payment')) return 'transaction'
    if (path.startsWith('/api/auth')) return 'user'
    return 'system'
  }
}

// Usage
const auditLogger = new DatabaseAuditLogger()
app.use(auditMiddleware(auditLogger))
```

This comprehensive security implementation provides enterprise-grade protection for the checkout system with CSRF protection, input validation, rate limiting, secure session management, and complete audit logging.
