# Checkout Integration and Testing Specifications

## Integration with Existing UI Components

### CartSidebar Integration

```typescript
// Enhanced CartSidebar with checkout integration
interface EnhancedCartSidebarProps {
  onCheckout: (cartId: string) => void
  checkoutUrl?: string
  isCheckoutLoading?: boolean
  checkoutError?: string
}

const EnhancedCartSidebar: React.FC<EnhancedCartSidebarProps> = ({
  onCheckout,
  checkoutUrl = '/checkout',
  isCheckoutLoading = false,
  checkoutError
}) => {
  const { state, removeItem, updateQuantity, closeCart, getTotalPrice } = useCart()
  const { items, isOpen } = state
  const totalPrice = getTotalPrice()

  const handleCheckoutClick = async () => {
    if (items.length === 0) return

    try {
      // Create checkout session
      const response = await fetch('/api/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': await getCSRFToken()
        },
        body: JSON.stringify({
          cartId: state.cartId,
          userType: 'unknown' // Will be determined in checkout flow
        })
      })

      const data = await response.json()

      if (data.success) {
        // Navigate to checkout page with session
        window.location.href = `${checkoutUrl}?session=${data.data.id}`
      } else {
        throw new Error(data.error.message)
      }
    } catch (error) {
      console.error('Failed to start checkout:', error)
      onCheckout?.(state.cartId)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Existing sidebar content... */}

          {/* Enhanced Footer with better checkout integration */}
          {items.length > 0 && (
            <div className="border-t border-chai-200 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-brand-text">
                  Total:
                </span>
                <span className="text-lg font-bold text-brand-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Error Display */}
              {checkoutError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-800">{checkoutError}</p>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Button
                onClick={handleCheckoutClick}
                disabled={isCheckoutLoading || items.length === 0}
                className="w-full"
                size="lg"
              >
                {isCheckoutLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Starting Checkout...
                  </>
                ) : (
                  <>
                    Secure Checkout
                    <Shield className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Security Badges */}
              <div className="flex items-center justify-center space-x-4 text-xs text-brand-text/60">
                <div className="flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>256-bit Encryption</span>
                </div>
              </div>

              {/* Continue Shopping */}
              <Button
                variant="secondary"
                className="w-full"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
```

### Header "Order Now" Button Integration

```typescript
// Enhanced header component with checkout integration
interface HeaderOrderButtonProps {
  productId?: string
  variantId?: string
  quantity?: number
  customizations?: CartItemCustomization[]
  onOrderNow?: (product: QuickOrderProduct) => void
}

const HeaderOrderButton: React.FC<HeaderOrderButtonProps> = ({
  productId,
  variantId,
  quantity = 1,
  customizations,
  onOrderNow
}) => {
  const { addItem, openCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleOrderNow = async () => {
    if (!productId) {
      // Open product selection modal or navigate to products
      return
    }

    setIsLoading(true)

    try {
      // Get product details
      const product = await fetchProduct(productId, variantId)

      // Add to cart
      await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        description: product.description,
        variantId,
        customizations
      })

      // Open cart sidebar for immediate checkout
      openCart()

      // Optional: Auto-proceed to checkout after short delay
      setTimeout(() => {
        const checkoutButton = document.querySelector('[data-checkout-button]') as HTMLButtonElement
        checkoutButton?.click()
      }, 1000)

    } catch (error) {
      console.error('Failed to add product:', error)
      // Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleOrderNow}
      disabled={isLoading}
      className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          Order Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  )
}
```

### Cart Icon Integration

```typescript
// Enhanced cart icon with checkout integration
const CartIcon: React.FC = () => {
  const { state, openCart } = useCart()
  const { items } = state
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="relative">
      <button
        onClick={openCart}
        className="p-2 text-brand-text hover:bg-chai-100 rounded-lg transition-colors relative"
        aria-label={`Shopping cart with ${totalItems} items`}
      >
        <ShoppingBag className="w-6 h-6" />

        {/* Item count badge */}
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </motion.span>
        )}
      </button>

      {/* Quick preview on hover */}
      <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-chai-200 rounded-lg shadow-lg z-50 opacity-0 pointer-events-none hover:opacity-100 hover:pointer-events-auto transition-opacity">
        <div className="p-4">
          <h3 className="font-semibold text-brand-text mb-3">Cart Preview</h3>

          {items.length === 0 ? (
            <p className="text-brand-text/70 text-sm">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center space-x-3 text-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-brand-text">{item.name}</p>
                      <p className="text-brand-text/70">{item.quantity} × ${item.price}</p>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-brand-text/70">
                    +{items.length - 3} more items
                  </p>
                )}
              </div>

              <Button onClick={openCart} className="w-full" size="sm">
                View Cart & Checkout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
```

## Unit Tests for Checkout Components

### React Component Tests

```typescript
// CheckoutPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CheckoutPage } from '../CheckoutPage'
import { CartProvider } from '../../contexts/CartContext'
import { AuthProvider } from '../../contexts/AuthContext'

const mockCartItems = [
  {
    id: '1',
    name: 'Chai Latte',
    price: 4.99,
    quantity: 2,
    image: '/chai-latte.jpg'
  }
]

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <CartProvider initialItems={mockCartItems}>
      {children}
    </CartProvider>
  </AuthProvider>
)

describe('CheckoutPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  test('renders checkout page with cart items', () => {
    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    )

    expect(screen.getByText('Chai Latte')).toBeInTheDocument()
    expect(screen.getByText('$9.98')).toBeInTheDocument() // 2 × $4.99
  })

  test('shows user identification step for unauthenticated user', () => {
    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    )

    expect(screen.getByText('How would you like to checkout?')).toBeInTheDocument()
    expect(screen.getByText('Guest Checkout')).toBeInTheDocument()
    expect(screen.getByText('Create Account or Sign In')).toBeInTheDocument()
  })

  test('handles guest checkout flow', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({
      success: true,
      data: { id: 'session-123' }
    }))

    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    )

    // Select guest checkout
    fireEvent.click(screen.getByText('Guest Checkout'))

    await waitFor(() => {
      expect(screen.getByText('Contact Information')).toBeInTheDocument()
    })

    // Fill guest information
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: 'John' }
    })
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: 'Doe' }
    })

    // Submit guest info
    fireEvent.click(screen.getByText('Continue to Shipping'))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/checkout/sessions/session-123/guest-info', {
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          marketingConsent: false
        })
      })
    })
  })

  test('validates form inputs', async () => {
    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    )

    fireEvent.click(screen.getByText('Guest Checkout'))

    await waitFor(() => {
      expect(screen.getByText('Contact Information')).toBeInTheDocument()
    })

    // Try to submit without required fields
    fireEvent.click(screen.getByText('Continue to Shipping'))

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('First name is required')).toBeInTheDocument()
      expect(screen.getByText('Last name is required')).toBeInTheDocument()
    })
  })

  test('handles API errors gracefully', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'))

    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    )

    fireEvent.click(screen.getByText('Guest Checkout'))

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument()
    })
  })
})

// AddressForm.test.tsx
describe('AddressForm', () => {
  test('validates address fields', async () => {
    const onSubmit = jest.fn()

    render(
      <AddressForm
        type="shipping"
        onSubmit={onSubmit}
      />
    )

    // Submit empty form
    fireEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(screen.getByText('Street address is required')).toBeInTheDocument()
      expect(screen.getByText('City is required')).toBeInTheDocument()
      expect(screen.getByText('State is required')).toBeInTheDocument()
      expect(screen.getByText('ZIP code is required')).toBeInTheDocument()
    })

    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('submits valid address data', async () => {
    const onSubmit = jest.fn()

    render(
      <AddressForm
        type="shipping"
        onSubmit={onSubmit}
      />
    )

    // Fill valid address
    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: 'John' }
    })
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: 'Doe' }
    })
    fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: '123 Main St' }
    })
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'San Francisco' }
    })
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'CA' }
    })
    fireEvent.change(screen.getByLabelText('ZIP Code'), {
      target: { value: '94105' }
    })
    fireEvent.change(screen.getByLabelText('Country/Region'), {
      target: { value: 'US' }
    })

    fireEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        street1: '123 Main St',
        street2: '',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'US',
        phone: undefined
      })
    })
  })
})
```

### API Endpoint Tests

```typescript
// checkout.api.test.ts
import request from 'supertest'
import { app } from '../app'
import { createTestDatabase, cleanupTestDatabase } from '../test-utils'

describe('Checkout API', () => {
  beforeAll(async () => {
    await createTestDatabase()
  })

  afterAll(async () => {
    await cleanupTestDatabase()
  })

  describe('POST /api/checkout/sessions', () => {
    test('creates checkout session with valid cart', async () => {
      // Create test cart first
      const cartResponse = await request(app)
        .post('/api/cart')
        .send({ sessionId: 'test-session' })
        .expect(200)

      const cartId = cartResponse.body.data.id

      // Add item to cart
      await request(app)
        .post(`/api/cart/${cartId}/items`)
        .send({
          productId: 'product-1',
          quantity: 2
        })
        .expect(200)

      // Create checkout session
      const response = await request(app)
        .post('/api/checkout/sessions')
        .send({
          cartId,
          userType: 'guest'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        cartId,
        userType: 'guest',
        status: 'cart_review'
      })
    })

    test('returns error for empty cart', async () => {
      const cartResponse = await request(app)
        .post('/api/cart')
        .send({ sessionId: 'test-session-empty' })
        .expect(200)

      const cartId = cartResponse.body.data.id

      const response = await request(app)
        .post('/api/checkout/sessions')
        .send({
          cartId,
          userType: 'guest'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error.code).toBe('EMPTY_CART')
    })

    test('validates required fields', async () => {
      const response = await request(app)
        .post('/api/checkout/sessions')
        .send({})
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('PUT /api/checkout/sessions/:id/guest-info', () => {
    test('updates guest information', async () => {
      // Create checkout session
      const session = await createTestCheckoutSession()

      const response = await request(app)
        .put(`/api/checkout/sessions/${session.id}/guest-info`)
        .send({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          marketingConsent: true
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.guestInfo).toMatchObject({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        marketingConsent: true
      })
    })

    test('validates email format', async () => {
      const session = await createTestCheckoutSession()

      const response = await request(app)
        .put(`/api/checkout/sessions/${session.id}/guest-info`)
        .send({
          email: 'invalid-email',
          firstName: 'John',
          lastName: 'Doe'
        })
        .expect(400)

      expect(response.body.error.code).toBe('VALIDATION_ERROR')
      expect(response.body.error.details).toContainEqual({
        field: 'email',
        code: 'invalid_email',
        message: 'Please enter a valid email address'
      })
    })
  })

  describe('POST /api/payment/create-intent', () => {
    test('creates payment intent for valid checkout', async () => {
      const session = await createCompleteCheckoutSession()

      const response = await request(app)
        .post('/api/payment/create-intent')
        .send({
          checkoutSessionId: session.id
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.paymentIntent).toMatchObject({
        id: expect.any(String),
        amount: expect.any(Number),
        currency: 'usd',
        status: 'requires_payment_method',
        clientSecret: expect.any(String)
      })
    })

    test('returns error for incomplete checkout', async () => {
      const session = await createTestCheckoutSession()

      const response = await request(app)
        .post('/api/payment/create-intent')
        .send({
          checkoutSessionId: session.id
        })
        .expect(400)

      expect(response.body.error.code).toBe('INCOMPLETE_CHECKOUT')
    })
  })
})

// Helper functions
async function createTestCheckoutSession() {
  const cartResponse = await request(app)
    .post('/api/cart')
    .send({ sessionId: 'test-session-' + Date.now() })

  const cartId = cartResponse.body.data.id

  await request(app)
    .post(`/api/cart/${cartId}/items`)
    .send({
      productId: 'product-1',
      quantity: 1
    })

  const sessionResponse = await request(app)
    .post('/api/checkout/sessions')
    .send({
      cartId,
      userType: 'guest'
    })

  return sessionResponse.body.data
}

async function createCompleteCheckoutSession() {
  const session = await createTestCheckoutSession()

  // Add guest info
  await request(app)
    .put(`/api/checkout/sessions/${session.id}/guest-info`)
    .send({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    })

  // Add shipping address
  await request(app)
    .put(`/api/checkout/sessions/${session.id}/shipping-address`)
    .send({
      firstName: 'John',
      lastName: 'Doe',
      street1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'US'
    })

  // Add shipping method
  await request(app)
    .put(`/api/checkout/sessions/${session.id}/shipping-method`)
    .send({
      shippingMethodId: 'standard-shipping'
    })

  return session
}
```

## Integration Tests for API Endpoints

### End-to-End Checkout Flow Tests

```typescript
// e2e-checkout.test.ts
import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test data
    await page.goto('/test-setup')
    await page.waitForLoadState('networkidle')
  })

  test('guest user can complete full checkout flow', async ({ page }) => {
    // Add item to cart
    await page.goto('/products/chai-latte')
    await page.click('[data-testid="add-to-cart"]')

    // Verify cart sidebar opens
    await expect(page.locator('[data-testid="cart-sidebar"]')).toBeVisible()

    // Start checkout
    await page.click('[data-testid="checkout-button"]')

    // User identification step
    await expect(page.locator('h1')).toContainText('Checkout')
    await page.click('[data-testid="guest-checkout"]')

    // Guest information step
    await page.fill('[data-testid="guest-email"]', 'test@example.com')
    await page.fill('[data-testid="guest-first-name"]', 'John')
    await page.fill('[data-testid="guest-last-name"]', 'Doe')
    await page.click('[data-testid="continue-to-shipping"]')

    // Shipping address step
    await page.fill('[data-testid="shipping-street1"]', '123 Main St')
    await page.fill('[data-testid="shipping-city"]', 'San Francisco')
    await page.selectOption('[data-testid="shipping-state"]', 'CA')
    await page.fill('[data-testid="shipping-zip"]', '94105')
    await page.selectOption('[data-testid="shipping-country"]', 'US')
    await page.click('[data-testid="continue-to-shipping-method"]')

    // Shipping method step
    await page.click('[data-testid="shipping-method-standard"]')
    await page.click('[data-testid="continue-to-payment"]')

    // Payment step
    await page.click('[data-testid="payment-method-card"]')

    // Fill Stripe test card
    const cardNumberFrame = page.frameLocator('[data-testid="card-number-frame"]')
    await cardNumberFrame.fill('[name="cardnumber"]', '4242424242424242')

    const expiryFrame = page.frameLocator('[data-testid="card-expiry-frame"]')
    await expiryFrame.fill('[name="exp-date"]', '1225')

    const cvcFrame = page.frameLocator('[data-testid="card-cvc-frame"]')
    await cvcFrame.fill('[name="cvc"]', '123')

    // Complete payment
    await page.click('[data-testid="complete-payment"]')

    // Wait for payment processing
    await page.waitForSelector('[data-testid="payment-success"]', { timeout: 30000 })

    // Verify order confirmation
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible()
    await expect(page.locator('[data-testid="order-number"]')).toContainText(/ORD-\d+/)
  })

  test('shows appropriate errors for invalid payment', async ({ page }) => {
    // Navigate through checkout to payment step
    await completeCheckoutToPayment(page)

    // Use declined card
    const cardNumberFrame = page.frameLocator('[data-testid="card-number-frame"]')
    await cardNumberFrame.fill('[name="cardnumber"]', '4000000000000002')

    const expiryFrame = page.frameLocator('[data-testid="card-expiry-frame"]')
    await expiryFrame.fill('[name="exp-date"]', '1225')

    const cvcFrame = page.frameLocator('[data-testid="card-cvc-frame"]')
    await cvcFrame.fill('[name="cvc"]', '123')

    // Attempt payment
    await page.click('[data-testid="complete-payment"]')

    // Verify error message
    await expect(page.locator('[data-testid="payment-error"]')).toContainText('Your card was declined')

    // Verify user can try again
    await expect(page.locator('[data-testid="retry-payment"]')).toBeVisible()
  })

  test('handles inventory issues during checkout', async ({ page }) => {
    // Add item to cart
    await page.goto('/products/limited-edition-chai')
    await page.click('[data-testid="add-to-cart"]')

    // Start checkout
    await page.click('[data-testid="checkout-button"]')

    // Simulate inventory depletion during checkout
    await page.evaluate(() => {
      window.mockInventoryUpdate({
        productId: 'limited-edition-chai',
        available: 0
      })
    })

    // Proceed through checkout
    await page.click('[data-testid="guest-checkout"]')

    // Should show inventory warning
    await expect(page.locator('[data-testid="inventory-warning"]')).toContainText('no longer available')

    // Provide options to remove item or suggest alternatives
    await expect(page.locator('[data-testid="remove-item"]')).toBeVisible()
    await expect(page.locator('[data-testid="suggested-alternatives"]')).toBeVisible()
  })

  test('persists checkout data across page reloads', async ({ page }) => {
    // Start checkout and fill guest info
    await completeGuestInfo(page)

    // Reload page
    await page.reload()

    // Verify guest info is preserved
    await expect(page.locator('[data-testid="guest-email"]')).toHaveValue('test@example.com')
    await expect(page.locator('[data-testid="guest-first-name"]')).toHaveValue('John')
    await expect(page.locator('[data-testid="guest-last-name"]')).toHaveValue('Doe')
  })
})

// Helper functions
async function completeGuestInfo(page) {
  await page.goto('/products/chai-latte')
  await page.click('[data-testid="add-to-cart"]')
  await page.click('[data-testid="checkout-button"]')
  await page.click('[data-testid="guest-checkout"]')

  await page.fill('[data-testid="guest-email"]', 'test@example.com')
  await page.fill('[data-testid="guest-first-name"]', 'John')
  await page.fill('[data-testid="guest-last-name"]', 'Doe')
  await page.click('[data-testid="continue-to-shipping"]')
}

async function completeCheckoutToPayment(page) {
  await completeGuestInfo(page)

  // Complete shipping address
  await page.fill('[data-testid="shipping-street1"]', '123 Main St')
  await page.fill('[data-testid="shipping-city"]', 'San Francisco')
  await page.selectOption('[data-testid="shipping-state"]', 'CA')
  await page.fill('[data-testid="shipping-zip"]', '94105')
  await page.click('[data-testid="continue-to-shipping-method"]')

  // Select shipping method
  await page.click('[data-testid="shipping-method-standard"]')
  await page.click('[data-testid="continue-to-payment"]')
}
```

## End-to-End Testing Scenarios

### Performance Testing

```typescript
// performance.test.ts
import { test, expect } from '@playwright/test'

test.describe('Checkout Performance', () => {
  test('checkout page loads within performance budget', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/checkout?session=test-session')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Performance budget: 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('payment processing completes within timeout', async ({ page }) => {
    await completeCheckoutToPayment(page)

    const startTime = Date.now()

    // Fill valid payment info
    const cardNumberFrame = page.frameLocator('[data-testid="card-number-frame"]')
    await cardNumberFrame.fill('[name="cardnumber"]', '4242424242424242')

    const expiryFrame = page.frameLocator('[data-testid="card-expiry-frame"]')
    await expiryFrame.fill('[name="exp-date"]', '1225')

    const cvcFrame = page.frameLocator('[data-testid="card-cvc-frame"]')
    await cvcFrame.fill('[name="cvc"]', '123')

    await page.click('[data-testid="complete-payment"]')

    await page.waitForSelector('[data-testid="payment-success"]', { timeout: 15000 })

    const processingTime = Date.now() - startTime

    // Payment should complete within 15 seconds
    expect(processingTime).toBeLessThan(15000)
  })

  test('handles high load scenarios', async ({ page }) => {
    // Simulate multiple concurrent requests
    const promises = Array.from({ length: 10 }, () =>
      page.goto('/checkout?session=concurrent-test-' + Math.random())
    )

    const results = await Promise.allSettled(promises)

    // All requests should succeed
    const failed = results.filter(result => result.status === 'rejected')
    expect(failed.length).toBe(0)
  })
})
```

### Security Testing

```typescript
// security.test.ts
import { test, expect } from '@playwright/test'

test.describe('Checkout Security', () => {
  test('prevents CSRF attacks', async ({ page }) => {
    // Navigate to checkout
    await page.goto('/checkout')

    // Try to submit form without CSRF token
    const response = await page.evaluate(async () => {
      return fetch('/api/checkout/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: 'test-cart' })
      })
    })

    expect(response.status).toBe(403)
  })

  test('validates all input fields', async ({ page }) => {
    await page.goto('/checkout')
    await page.click('[data-testid="guest-checkout"]')

    // Try XSS in email field
    await page.fill('[data-testid="guest-email"]', '<script>alert("xss")</script>')
    await page.click('[data-testid="continue-to-shipping"]')

    // Should show validation error, not execute script
    await expect(page.locator('[data-testid="email-error"]')).toContainText('valid email')
  })

  test('enforces rate limiting', async ({ page }) => {
    // Make multiple rapid requests
    const requests = Array.from({ length: 10 }, async (_, i) => {
      return page.evaluate(async (index) => {
        return fetch('/api/checkout/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': await window.getCSRFToken()
          },
          body: JSON.stringify({ cartId: `test-cart-${index}` })
        })
      }, i)
    })

    const results = await Promise.all(requests)

    // Some requests should be rate limited
    const rateLimited = results.filter(response => response.status === 429)
    expect(rateLimited.length).toBeGreaterThan(0)
  })
})
```

## Performance Monitoring and Error Tracking

### Metrics Collection

```typescript
// metrics.ts
interface CheckoutMetrics {
  stepCompletionTime: Record<CheckoutStep, number>
  errorRates: Record<CheckoutStep, number>
  abandonmentRates: Record<CheckoutStep, number>
  paymentSuccessRate: number
  averageOrderValue: number
  conversionRate: number
}

class CheckoutMetricsCollector {
  private readonly analytics: AnalyticsService

  constructor(analytics: AnalyticsService) {
    this.analytics = analytics
  }

  trackStepCompletion(step: CheckoutStep, duration: number, sessionId: string) {
    this.analytics.track('checkout_step_completed', {
      step,
      duration,
      sessionId,
      timestamp: Date.now()
    })
  }

  trackStepAbandonment(step: CheckoutStep, sessionId: string) {
    this.analytics.track('checkout_step_abandoned', {
      step,
      sessionId,
      timestamp: Date.now()
    })
  }

  trackPaymentResult(success: boolean, amount: number, method: string, sessionId: string) {
    this.analytics.track('payment_result', {
      success,
      amount,
      method,
      sessionId,
      timestamp: Date.now()
    })
  }

  trackError(error: CheckoutError, step: CheckoutStep, sessionId: string) {
    this.analytics.track('checkout_error', {
      errorCode: error.code,
      errorMessage: error.message,
      step,
      sessionId,
      timestamp: Date.now()
    })
  }

  async getMetrics(timeRange: { start: Date; end: Date }): Promise<CheckoutMetrics> {
    const events = await this.analytics.query({
      eventTypes: [
        'checkout_step_completed',
        'checkout_step_abandoned',
        'payment_result',
        'checkout_error'
      ],
      timeRange
    })

    return this.calculateMetrics(events)
  }

  private calculateMetrics(events: AnalyticsEvent[]): CheckoutMetrics {
    // Calculate completion times, error rates, etc.
    // Implementation depends on analytics service
    return {
      stepCompletionTime: {},
      errorRates: {},
      abandonmentRates: {},
      paymentSuccessRate: 0,
      averageOrderValue: 0,
      conversionRate: 0
    }
  }
}
```

### Real-time Monitoring Dashboard

```typescript
// monitoring-dashboard.tsx
const CheckoutMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<CheckoutMetrics | null>(null)
  const [realTimeEvents, setRealTimeEvents] = useState<AnalyticsEvent[]>([])

  useEffect(() => {
    // Subscribe to real-time events
    const eventStream = new EventSource('/api/analytics/stream')

    eventStream.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setRealTimeEvents(prev => [data, ...prev.slice(0, 99)]) // Keep last 100 events
    }

    return () => eventStream.close()
  }, [])

  useEffect(() => {
    // Load historical metrics
    fetch('/api/analytics/checkout-metrics?timeRange=24h')
      .then(res => res.json())
      .then(data => setMetrics(data))
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout Monitoring Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Conversion Rate"
          value={`${(metrics?.conversionRate || 0).toFixed(1)}%`}
          trend={+2.3}
        />
        <MetricCard
          title="Payment Success Rate"
          value={`${(metrics?.paymentSuccessRate || 0).toFixed(1)}%`}
          trend={+0.5}
        />
        <MetricCard
          title="Average Order Value"
          value={`$${(metrics?.averageOrderValue || 0).toFixed(2)}`}
          trend={+5.2}
        />
        <MetricCard
          title="Active Checkouts"
          value={realTimeEvents.filter(e => e.type === 'checkout_started').length.toString()}
          trend={0}
        />
      </div>

      {/* Funnel Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Checkout Funnel</h2>
        <CheckoutFunnelChart metrics={metrics} />
      </div>

      {/* Real-time Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Real-time Events</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {realTimeEvents.map(event => (
            <div key={event.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
              <span className="font-medium">{event.type}</span>
              <span className="text-gray-500">{formatTime(event.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Tracking */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Error Rates by Step</h2>
        <ErrorRateChart metrics={metrics} />
      </div>
    </div>
  )
}
```

This comprehensive integration and testing specification provides a complete framework for implementing, testing, and monitoring the checkout system with proper integration into existing UI components, comprehensive test coverage, and real-time performance monitoring.
