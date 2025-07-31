import Fastify from 'fastify'
import cors from '@fastify/cors'
import { auth } from './lib/auth'
import { auditLogger, createAuditMiddleware } from './lib/auditLogger'
import { rateLimiter } from './lib/rateLimiter'
import { securityMiddleware } from './lib/securityMiddleware'

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    serializers: {
      req: (request) => ({
        method: request.method,
        url: request.url,
        headers: process.env.ENVIRONMENT === 'development' ? request.headers : {
          'user-agent': request.headers['user-agent'],
          'content-type': request.headers['content-type']
        },
        remoteAddress: request.ip
      }),
      res: (reply) => ({
        statusCode: reply.statusCode,
        headers: process.env.ENVIRONMENT === 'development' ? reply.getHeaders() : {}
      })
    }
  }
})

// Environment configuration
const isProduction = process.env.ENVIRONMENT === 'production'
const isStaging = process.env.ENVIRONMENT === 'staging'
const isDevelopment = process.env.ENVIRONMENT === 'development'

async function startServer() {
  try {
    // CORS configuration
    await fastify.register(cors, {
      origin: isDevelopment
        ? ['http://localhost:5173', 'http://localhost:3000']
        : isStaging
        ? ['https://staging.app.domain.com']
        : ['https://app.domain.com'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Env-Override']
    })

    // Security middleware
    const securityHandler = await securityMiddleware.createSecurityMiddleware()
    fastify.addHook('preHandler', securityHandler)

    // Mock auth middleware for development
    if (isDevelopment) {
      const mockAuthHandler = await securityMiddleware.createMockAuthMiddleware()
      fastify.addHook('preHandler', mockAuthHandler)
    }

    // Audit middleware
    fastify.addHook('preHandler', createAuditMiddleware())

    // Rate limiting middleware for auth endpoints
    const authRateLimiter = rateLimiter.createMiddleware('login')
    const apiRateLimiter = rateLimiter.createMiddleware('api')

    // Health check endpoint
    fastify.get('/health', async (request, reply) => {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.ENVIRONMENT,
        version: process.env.APP_VERSION || '1.0.0',
        services: {
          database: 'connected', // TODO: Add actual database health check
          auth: auth ? 'initialized' : 'not_initialized',
          rateLimit: 'active',
          audit: 'active'
        }
      }

      // Only include detailed info in development
      if (isDevelopment) {
        healthStatus.services = {
          ...healthStatus.services,
          mockAuth: 'enabled',
          debugMode: 'active'
        }
      }

      return healthStatus
    })

    // Better Auth routes
    fastify.all('/api/auth/*', {
      preHandler: [authRateLimiter]
    }, async (request, reply) => {
      const authRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers as any,
        body: request.method !== 'GET' && request.method !== 'HEAD'
          ? JSON.stringify(request.body)
          : undefined
      })

      try {
        const authResponse = await auth.handler(authRequest)

        // Set response headers
        authResponse.headers.forEach((value, key) => {
          reply.header(key, value)
        })

        // Log auth events
        const url = new URL(request.url)
        const endpoint = url.pathname.split('/').pop()

        await auditLogger.logAuthEvent(
          endpoint as any || 'unknown',
          authResponse.ok ? 'success' : 'failure',
          {
            userId: (request as any).user?.id,
            sessionId: (request as any).securityContext?.requestId,
            ipAddress: (request as any).securityContext?.ipAddress,
            userAgent: (request as any).securityContext?.userAgent,
            metadata: {
              endpoint,
              statusCode: authResponse.status,
              method: request.method
            }
          }
        )

        return reply
          .status(authResponse.status)
          .send(await authResponse.text())
      } catch (error) {
        fastify.log.error('Auth handler error:', error)

        await auditLogger.logAuthEvent('auth_error', 'error', {
          userId: (request as any).user?.id,
          sessionId: (request as any).securityContext?.requestId,
          ipAddress: (request as any).securityContext?.ipAddress,
          userAgent: (request as any).securityContext?.userAgent,
          metadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
            endpoint: new URL(request.url).pathname
          }
        })

        return reply.status(500).send({ error: 'Authentication service error' })
      }
    })

    // WebAuthn/Passkey endpoints
    fastify.post('/api/webauthn/register/begin', {
      preHandler: [authRateLimiter]
    }, async (request, reply) => {
      // This would integrate with @simplewebauthn/server
      // For now, return a basic response
      return {
        challenge: 'webauthn-challenge',
        rpId: process.env.BETTER_AUTH_DOMAIN || 'localhost',
        timeout: 60000
      }
    })

    fastify.post('/api/webauthn/register/complete', {
      preHandler: [authRateLimiter]
    }, async (request, reply) => {
      // Complete WebAuthn registration
      return { success: true }
    })

    fastify.post('/api/webauthn/authenticate/begin', {
      preHandler: [authRateLimiter]
    }, async (request, reply) => {
      // Begin WebAuthn authentication
      return {
        challenge: 'webauthn-auth-challenge',
        timeout: 60000
      }
    })

    fastify.post('/api/webauthn/authenticate/complete', {
      preHandler: [authRateLimiter]
    }, async (request, reply) => {
      // Complete WebAuthn authentication
      return { success: true }
    })

    // API endpoints with rate limiting
    fastify.register(async function(fastify) {
      fastify.addHook('preHandler', apiRateLimiter)

      // User profile endpoint
      fastify.get('/api/user/profile', async (request, reply) => {
        const user = (request as any).user
        if (!user) {
          return reply.status(401).send({ error: 'Unauthorized' })
        }

        await auditLogger.logAccessEvent(
          'user_profile',
          'read',
          'success',
          {
            userId: user.id,
            sessionId: (request as any).securityContext?.requestId,
            ipAddress: (request as any).securityContext?.ipAddress,
            userAgent: (request as any).securityContext?.userAgent
          }
        )

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          mfaEnabled: user.mfaEnabled || false
        }
      })

      // Security settings endpoint
      fastify.get('/api/user/security', async (request, reply) => {
        const user = (request as any).user
        if (!user) {
          return reply.status(401).send({ error: 'Unauthorized' })
        }

        return {
          mfaEnabled: user.mfaEnabled || false,
          passkeyEnabled: false, // TODO: Check user's passkeys
          lastPasswordChange: user.passwordChangedAt,
          activeSessions: 1, // TODO: Get actual session count
          securityLevel: process.env.SECURITY_LEVEL || 'medium'
        }
      })

      // Audit log endpoint (admin only)
      fastify.get('/api/admin/audit-logs', async (request, reply) => {
        const user = (request as any).user
        if (!user || user.role !== 'admin') {
          return reply.status(403).send({ error: 'Forbidden' })
        }

        // TODO: Implement actual audit log retrieval
        return {
          logs: [],
          total: 0,
          page: 1
        }
      })
    })

    // Development-only endpoints
    if (isDevelopment) {
      fastify.get('/api/dev/mock-login', async (request, reply) => {
        const { role } = request.query as { role?: string }

        const mockUsers = {
          admin: { id: 'dev_admin', email: 'admin@dev', name: 'Dev Admin', role: 'admin' },
          user: { id: 'dev_user', email: 'user@dev', name: 'Dev User', role: 'user' },
          manager: { id: 'dev_manager', email: 'manager@dev', name: 'Dev Manager', role: 'manager' }
        }

        const user = mockUsers[role as keyof typeof mockUsers] || mockUsers.user

        await auditLogger.logAuthEvent('login', 'success', {
          userId: user.id,
          metadata: { mockAuth: true, role }
        })

        return {
          user,
          token: `DEBUG_TOKEN_${role?.toUpperCase() || 'USER'}`,
          message: 'Mock authentication successful (development only)'
        }
      })

      fastify.get('/api/dev/security-context', async (request, reply) => {
        return (request as any).securityContext || {}
      })
    }

    // Error handler
    fastify.setErrorHandler(async (error, request, reply) => {
      fastify.log.error(error)

      await auditLogger.log({
        eventType: 'server_error',
        eventCategory: 'system',
        severity: 'high',
        outcome: 'error',
        resource: request.url,
        action: request.method,
        metadata: {
          errorMessage: error.message,
          stack: isDevelopment ? error.stack : undefined
        },
        ipAddress: (request as any).securityContext?.ipAddress,
        userAgent: (request as any).securityContext?.userAgent
      })

      const errorResponse = {
        error: 'Internal Server Error',
        requestId: (request as any).securityContext?.requestId
      }

      if (isDevelopment) {
        errorResponse['details'] = error.message
        errorResponse['stack'] = error.stack
      }

      reply.status(500).send(errorResponse)
    })

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      fastify.log.info('SIGTERM received, shutting down gracefully')
      await auditLogger.shutdown()
      rateLimiter.shutdown()
      await fastify.close()
      process.exit(0)
    })

    process.on('SIGINT', async () => {
      fastify.log.info('SIGINT received, shutting down gracefully')
      await auditLogger.shutdown()
      rateLimiter.shutdown()
      await fastify.close()
      process.exit(0)
    })

    // Start server
    const port = parseInt(process.env.PORT || '3001')
    const host = process.env.HOST || '0.0.0.0'

    await fastify.listen({ port, host })

    fastify.log.info(`🚀 Authentication server started`)
    fastify.log.info(`📍 Environment: ${process.env.ENVIRONMENT || 'development'}`)
    fastify.log.info(`🌐 Server running on http://${host}:${port}`)
    fastify.log.info(`🔐 Auth endpoints: http://${host}:${port}/api/auth/`)
    fastify.log.info(`🛡️  Security level: ${process.env.SECURITY_LEVEL || 'medium'}`)

    if (isDevelopment) {
      fastify.log.info(`🧪 Mock auth: http://${host}:${port}/api/dev/mock-login`)
      fastify.log.info(`📊 Health check: http://${host}:${port}/health`)
    }

  } catch (error) {
    fastify.log.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error)
  await auditLogger.log({
    eventType: 'uncaught_exception',
    eventCategory: 'system',
    severity: 'critical',
    outcome: 'error',
    metadata: {
      errorMessage: error.message,
      stack: error.stack
    }
  })
  process.exit(1)
})

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  await auditLogger.log({
    eventType: 'unhandled_rejection',
    eventCategory: 'system',
    severity: 'critical',
    outcome: 'error',
    metadata: {
      reason: reason instanceof Error ? reason.message : String(reason)
    }
  })
  process.exit(1)
})

// Start the server
startServer()

// Initialize Webhook Service (temporarily disabled)
// const webhookService = new StripeWebhookService(stripe, fastify.log)

// Register content type parser for Stripe webhooks
fastify.addContentTypeParser(
  'application/json',
  { parseAs: 'buffer' },
  function (req: any, body, done) {
    try {
      const raw = body.toString('utf8')
      req.rawBody = raw
      const json = JSON.parse(raw)
      done(null, json)
    } catch (error) {
      done(error instanceof Error ? error : new Error('JSON parse error'), undefined)
    }
  }
)// Register plugins
fastify.register(cors, {
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
  credentials: true,
})

// Add security headers middleware
fastify.addHook('onSend', async (_request, reply) => {
  // Set security headers
  reply.header('X-Content-Type-Options', 'nosniff')
  reply.header('X-Frame-Options', 'DENY')
  reply.header('X-XSS-Protection', '1; mode=block')
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Set CSP header that allows Stripe
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network https://q.stripe.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://m.stripe.network",
    "connect-src 'self' https://api.stripe.com https://m.stripe.network https://q.stripe.com http://localhost:5173",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: http:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com"
  ].join('; ')

  reply.header('Content-Security-Policy', csp)
})

// Payment Intent Routes
fastify.post('/api/create-payment-intent', async (request, reply) => {
  try {
    const { amount, currency = 'usd', customerId, productIds } = request.body as {
      amount: number
      currency?: string
      customerId?: string
      productIds?: string[]
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      metadata: {
        productIds: productIds?.join(',') || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    reply.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    fastify.log.error(error)
    reply.status(500).send({ error: 'Failed to create payment intent' })
  }
})

// Customer Routes
fastify.post('/api/customers', async (request, reply) => {
  try {
    const { email, name, phone, address } = request.body as {
      email: string
      name?: string
      phone?: string
      address?: any
    }

    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      address,
    })

    reply.send({ customer })
  } catch (error) {
    fastify.log.error(error)
    reply.status(500).send({ error: 'Failed to create customer' })
  }
})

// Product Routes
fastify.get('/api/products', async (_request, reply) => {
  try {
    // For now, return mock data
    const products = [
      {
        id: '1',
        name: 'Classic Masala Chai',
        price: 14.99,
        originalPrice: 29.99,
        rating: 4.9,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop&crop=center',
        description: 'A harmonious blend of black tea, cardamom, cinnamon, ginger, and cloves',
        tags: ['Bestseller', 'Traditional'],
        isPopular: true,
      },
      {
        id: '2',
        name: 'Royal Saffron Chai',
        price: 19.99,
        rating: 4.8,
        reviews: 127,
        image: 'https://images.unsplash.com/photo-1575397282820-f72467c262e5?w=300&h=300&fit=crop&crop=center',
        description: 'Luxurious blend with premium saffron, rose petals, and aromatic spices',
        tags: ['Premium', 'Limited Edition'],
        isNew: true,
      },
      {
        id: '3',
        name: 'Green Cardamom Chai',
        price: 19.99,
        rating: 4.7,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1512484149279-9751676e56c4?w=300&h=300&fit=crop&crop=center',
        description: 'Refreshing green tea base with whole green cardamom pods',
        tags: ['Organic', 'Light'],
      },
    ]

    reply.send({ products })
  } catch (error) {
    fastify.log.error(error)
    reply.status(500).send({ error: 'Failed to fetch products' })
  }
})

// Webhook endpoint for Stripe events (Temporarily simplified for basic testing)
fastify.post('/api/webhooks/stripe', async (request, reply) => {
  try {
    const signature = request.headers['stripe-signature'] as string
    if (!signature) {
      fastify.log.error('Missing Stripe signature header')
      reply.status(400).send({ error: 'Missing stripe-signature header' })
      return
    }

    // Basic webhook endpoint for testing
    fastify.log.info('Webhook received successfully')
    reply.status(200).send({ received: true })
  } catch (error) {
    fastify.log.error('Webhook processing error:', error)
    reply.status(500).send({ error: 'Internal server error' })
  }
})

// Individual webhook endpoints (Temporarily simplified)
fastify.post('/api/webhooks/stripe/payment-succeeded', async (request, reply) => {
  fastify.log.info('Payment succeeded webhook received')
  reply.status(200).send({ received: true })
})

fastify.post('/api/webhooks/stripe/payment-failed', async (request, reply) => {
  fastify.log.info('Payment failed webhook received')
  reply.status(200).send({ received: true })
})

fastify.post('/api/webhooks/stripe/invoice-paid', async (request, reply) => {
  fastify.log.info('Invoice paid webhook received')
  reply.status(200).send({ received: true })
})

fastify.post('/api/webhooks/stripe/subscription-updated', async (request, reply) => {
  fastify.log.info('Subscription updated webhook received')
  reply.status(200).send({ received: true })
})

// Webhook management endpoints (Temporarily simplified)
fastify.get('/api/webhooks/health', async (_request, reply) => {
  reply.send({ status: 'ok', timestamp: new Date().toISOString() })
})

fastify.get('/api/webhooks/failed', async (request, reply) => {
  reply.send({ failedWebhooks: [] })
})

fastify.post('/api/webhooks/retry/:eventId', async (request, reply) => {
  reply.send({ retried: true })
})

fastify.get('/api/webhooks/events/supported', async (_request, reply) => {
  const supportedEvents = [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'payment_intent.requires_action',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.paid',
    'invoice.payment_failed'
  ]
  reply.send({ supportedEvents })
})

// Health check
fastify.get('/api/health', async (_request, reply) => {
  reply.send({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001')
    await fastify.listen({ port, host: '0.0.0.0' })
    fastify.log.info(`Server listening on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()