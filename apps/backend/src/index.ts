import Fastify from 'fastify'
import cors from '@fastify/cors'
import Stripe from 'stripe'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const fastify = Fastify({
  logger: true
})

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Register plugins
fastify.register(cors, {
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
  credentials: true,
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

// Webhook endpoint for Stripe events
fastify.post('/api/webhooks/stripe', async (request, reply) => {
  const sig = request.headers['stripe-signature'] as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      request.body as string,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    fastify.log.error(`Webhook signature verification failed:`, err)
    reply.status(400).send(`Webhook Error: ${err}`)
    return
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      fastify.log.info('PaymentIntent was successful!', paymentIntent.id)
      // TODO: Update order status in database
      break
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      fastify.log.info('PaymentIntent failed!', failedPayment.id)
      // TODO: Handle failed payment
      break
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object
      fastify.log.info('Subscription event:', event.type, subscription.id)
      // TODO: Update subscription in database
      break
    default:
      fastify.log.info(`Unhandled event type ${event.type}`)
  }

  reply.send({ received: true })
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