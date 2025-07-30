import Fastify from 'fastify'
import cors from '@fastify/cors'
import Stripe from 'stripe'
import dotenv from 'dotenv'
// import { StripeWebhookService } from './webhooks/webhook-service'

// Load environment variables
dotenv.config()

const fastify = Fastify({
  logger: true,
  // Enable raw body parsing for webhooks
  disableRequestLogging: false,
  bodyLimit: 1048576, // 1MB
})

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

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