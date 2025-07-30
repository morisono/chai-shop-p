# Checkout Page UI/UX Component Design Specifications

## Responsive Layout Architecture

### Layout Structure Based on Stripe Subscription Form Pattern

```typescript
interface CheckoutPageLayout {
  container: {
    maxWidth: '1200px'
    padding: 'responsive' // 16px mobile, 24px tablet, 32px desktop
    margin: '0 auto'
    minHeight: '100vh'
  }

  grid: {
    mobile: 'single-column'
    tablet: 'two-column-60-40'
    desktop: 'two-column-60-40'
    gap: '32px'
  }

  sections: {
    leftColumn: {
      content: ['checkout_form', 'user_identification', 'guest_info', 'addresses', 'shipping', 'payment']
      width: '60%' // Desktop
      order: 1 // Mobile first
    }
    rightColumn: {
      content: ['order_summary', 'cart_items', 'promotions', 'totals']
      width: '40%' // Desktop
      order: 2 // Mobile second
      sticky: true // Desktop only
    }
  }
}
```

### Mobile-First Responsive Breakpoints
```css
/* Tailwind CSS Classes to Use */
.checkout-container {
  @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.checkout-grid {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12;
}

.checkout-form-section {
  @apply lg:col-span-2 space-y-8;
}

.order-summary-section {
  @apply lg:col-span-1 lg:sticky lg:top-8 lg:self-start;
}

/* Mobile: Stack vertically */
@media (max-width: 1023px) {
  .order-summary-section {
    @apply order-first mb-8;
  }

  .checkout-form-section {
    @apply order-last;
  }
}
```

## Component Hierarchy and Specifications

### 1. Main Checkout Container Component

```typescript
interface CheckoutPageProps {
  initialCartId?: string
  redirectPath?: string
  theme?: 'light' | 'dark'
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  initialCartId,
  redirectPath = '/order-confirmation',
  theme = 'light'
}) => {
  // Component implementation
}

// Component Structure
<CheckoutPage>
  <CheckoutHeader />
  <CheckoutProgressBar />
  <div className="checkout-grid">
    <CheckoutFormSection>
      <UserIdentificationStep />
      <GuestInformationStep />
      <ShippingAddressStep />
      <BillingAddressStep />
      <ShippingMethodStep />
      <PaymentMethodStep />
      <OrderReviewStep />
    </CheckoutFormSection>

    <OrderSummarySection>
      <OrderSummaryHeader />
      <CartItemsList />
      <PromotionInput />
      <OrderTotals />
      <SecurityBadges />
    </OrderSummarySection>
  </div>
  <CheckoutFooter />
</CheckoutPage>
```

### 2. Checkout Header Component

```typescript
interface CheckoutHeaderProps {
  showBackButton?: boolean
  onBack?: () => void
  showLogo?: boolean
  logoUrl?: string
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({
  showBackButton = true,
  onBack,
  showLogo = true,
  logoUrl = '/logo.svg'
}) => (
  <header className="sticky top-0 z-50 bg-white border-b border-chai-200 px-4 py-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <button
            onClick={onBack}
            className="p-2 text-brand-text hover:bg-chai-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        {showLogo && (
          <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center text-sm text-brand-text/70">
          <Lock className="w-4 h-4 mr-1" />
          Secure Checkout
        </div>
        <CustomerSupport />
      </div>
    </div>
  </header>
)
```

### 3. Progress Bar Component

```typescript
interface CheckoutProgressBarProps {
  currentStep: CheckoutStep
  completedSteps: CheckoutStep[]
  onStepClick?: (step: CheckoutStep) => void
}

const CheckoutProgressBar: React.FC<CheckoutProgressBarProps> = ({
  currentStep,
  completedSteps,
  onStepClick
}) => {
  const steps = [
    { id: 'cart_review', label: 'Cart', icon: ShoppingBag },
    { id: 'information', label: 'Information', icon: User },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: CheckCircle }
  ]

  return (
    <div className="hidden sm:block bg-chai-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Checkout progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id as CheckoutStep)
              const isCurrent = currentStep === step.id
              const isClickable = isCompleted && onStepClick

              return (
                <li key={step.id} className="relative flex-1">
                  <div className="flex items-center">
                    <button
                      onClick={isClickable ? () => onStepClick!(step.id as CheckoutStep) : undefined}
                      disabled={!isClickable}
                      className={cn(
                        'relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                        {
                          'border-brand-primary bg-brand-primary text-white': isCompleted || isCurrent,
                          'border-chai-300 bg-white text-chai-500': !isCompleted && !isCurrent,
                          'cursor-pointer hover:border-brand-primary/70': isClickable,
                          'cursor-default': !isClickable
                        }
                      )}
                      aria-current={isCurrent ? 'step' : undefined}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </button>
                    <span className={cn(
                      'ml-2 text-sm font-medium transition-colors',
                      {
                        'text-brand-primary': isCompleted || isCurrent,
                        'text-chai-500': !isCompleted && !isCurrent
                      }
                    )}>
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="absolute top-4 left-8 w-full h-0.5 bg-chai-200">
                      <div
                        className={cn(
                          'h-full bg-brand-primary transition-all duration-300',
                          isCompleted ? 'w-full' : 'w-0'
                        )}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </div>
  )
}
```

### 4. User Identification Step Component

```typescript
interface UserIdentificationStepProps {
  onUserTypeSelect: (type: 'guest' | 'registered') => void
  isAuthenticated: boolean
  currentUser?: User
  onLogin: () => void
  onSignUp: () => void
}

const UserIdentificationStep: React.FC<UserIdentificationStepProps> = ({
  onUserTypeSelect,
  isAuthenticated,
  currentUser,
  onLogin,
  onSignUp
}) => {
  if (isAuthenticated && currentUser) {
    return (
      <div className="bg-white rounded-lg border border-chai-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-brand-text">
            Welcome back, {currentUser.name}!
          </h2>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-brand-text/70 text-sm mb-4">
          You're signed in as {currentUser.email}
        </p>
        <div className="flex space-x-3">
          <Button
            onClick={() => onUserTypeSelect('registered')}
            className="flex-1"
          >
            Continue as {currentUser.name}
          </Button>
          <Button
            variant="outline"
            onClick={onLogin}
            className="text-sm"
          >
            Switch Account
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-chai-200 p-6">
      <h2 className="text-lg font-semibold text-brand-text mb-6">
        How would you like to checkout?
      </h2>

      <div className="space-y-4">
        {/* Guest Checkout Option */}
        <div className="relative">
          <button
            onClick={() => onUserTypeSelect('guest')}
            className="w-full text-left p-4 border-2 border-chai-200 rounded-lg hover:border-brand-primary transition-colors group"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-4 h-4 border-2 border-chai-300 rounded-full group-hover:border-brand-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-brand-text">Guest Checkout</h3>
                <p className="text-sm text-brand-text/70 mt-1">
                  Continue without an account. You can create one later.
                </p>
                <div className="flex items-center mt-2 text-xs text-brand-text/60">
                  <Clock className="w-3 h-3 mr-1" />
                  Faster checkout
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Registered User Options */}
        <div className="relative">
          <div className="border-2 border-chai-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-chai-50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-4 h-4 border-2 border-chai-300 rounded-full" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-brand-text">Create Account or Sign In</h3>
                  <p className="text-sm text-brand-text/70 mt-1">
                    Save your information for faster future checkouts
                  </p>
                  <div className="flex items-center mt-2 text-xs text-brand-text/60">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure account benefits
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={onLogin}
                  className="text-sm"
                >
                  Sign In
                </Button>
                <Button
                  onClick={onSignUp}
                  className="text-sm"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800">
            Your personal information is encrypted and secure. We never store payment details.
          </p>
        </div>
      </div>
    </div>
  )
}
```

### 5. Guest Information Form Component

```typescript
interface GuestInformationStepProps {
  onSubmit: (data: GuestInformation) => void
  initialData?: Partial<GuestInformation>
  isLoading?: boolean
  errors?: FieldErrors<GuestInformation>
}

const GuestInformationStep: React.FC<GuestInformationStepProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  errors
}) => {
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm<GuestInformation>({
    defaultValues: initialData,
    resolver: zodResolver(guestInformationSchema)
  })

  return (
    <div className="bg-white rounded-lg border border-chai-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-brand-text">
          Contact Information
        </h2>
        <div className="text-sm text-brand-text/70">
          Already have an account?
          <button className="text-brand-primary hover:underline ml-1">
            Sign in
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-1">
            Email address
          </label>
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              id="email"
              autoComplete="email"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                'disabled:bg-chai-100 disabled:cursor-not-allowed',
                formErrors.email || errors?.email
                  ? 'border-red-300 bg-red-50'
                  : 'border-chai-300 hover:border-chai-400'
              )}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            <Mail className="absolute right-3 top-2.5 w-4 h-4 text-chai-400" />
          </div>
          {(formErrors.email || errors?.email) && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {formErrors.email?.message || errors?.email?.message}
            </p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-brand-text mb-1">
              First name
            </label>
            <input
              {...register('firstName')}
              type="text"
              id="firstName"
              autoComplete="given-name"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                'disabled:bg-chai-100 disabled:cursor-not-allowed',
                formErrors.firstName || errors?.firstName
                  ? 'border-red-300 bg-red-50'
                  : 'border-chai-300 hover:border-chai-400'
              )}
              placeholder="First name"
              disabled={isLoading}
            />
            {(formErrors.firstName || errors?.firstName) && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {formErrors.firstName?.message || errors?.firstName?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-brand-text mb-1">
              Last name
            </label>
            <input
              {...register('lastName')}
              type="text"
              id="lastName"
              autoComplete="family-name"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                'disabled:bg-chai-100 disabled:cursor-not-allowed',
                formErrors.lastName || errors?.lastName
                  ? 'border-red-300 bg-red-50'
                  : 'border-chai-300 hover:border-chai-400'
              )}
              placeholder="Last name"
              disabled={isLoading}
            />
            {(formErrors.lastName || errors?.lastName) && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {formErrors.lastName?.message || errors?.lastName?.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone Field (Optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-brand-text mb-1">
            Phone number <span className="text-chai-500 text-xs">(optional)</span>
          </label>
          <div className="relative">
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              autoComplete="tel"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                'disabled:bg-chai-100 disabled:cursor-not-allowed',
                formErrors.phone || errors?.phone
                  ? 'border-red-300 bg-red-50'
                  : 'border-chai-300 hover:border-chai-400'
              )}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
            <Phone className="absolute right-3 top-2.5 w-4 h-4 text-chai-400" />
          </div>
          {(formErrors.phone || errors?.phone) && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {formErrors.phone?.message || errors?.phone?.message}
            </p>
          )}
        </div>

        {/* Marketing Consent */}
        <div className="flex items-start space-x-3">
          <input
            {...register('marketingConsent')}
            type="checkbox"
            id="marketingConsent"
            className="mt-1 h-4 w-4 text-brand-primary focus:ring-brand-primary border-chai-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="marketingConsent" className="text-sm text-brand-text">
            Keep me updated with special offers and news
            <span className="block text-xs text-brand-text/70 mt-1">
              You can unsubscribe at any time. See our privacy policy.
            </span>
          </label>
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Shipping
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
```

### 6. Address Form Component (Reusable)

```typescript
interface AddressFormProps {
  type: 'shipping' | 'billing'
  onSubmit: (data: Address) => void
  initialData?: Partial<Address>
  isLoading?: boolean
  errors?: FieldErrors<Address>
  showCopyOption?: boolean
  onCopyFromShipping?: () => void
  showSaveOption?: boolean
}

const AddressForm: React.FC<AddressFormProps> = ({
  type,
  onSubmit,
  initialData,
  isLoading = false,
  errors,
  showCopyOption = false,
  onCopyFromShipping,
  showSaveOption = false
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors: formErrors } } = useForm<Address>({
    defaultValues: initialData,
    resolver: zodResolver(addressSchema)
  })

  const [isValidatingAddress, setIsValidatingAddress] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([])

  const handleAddressValidation = async (data: Address) => {
    setIsValidatingAddress(true)
    try {
      const validation = await validateAddress(data)
      if (validation.suggestions.length > 0) {
        setAddressSuggestions(validation.suggestions)
      } else {
        onSubmit(data)
      }
    } catch (error) {
      onSubmit(data) // Proceed even if validation fails
    } finally {
      setIsValidatingAddress(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-chai-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-brand-text">
          {type === 'shipping' ? 'Shipping Address' : 'Billing Address'}
        </h2>
        {showCopyOption && (
          <button
            type="button"
            onClick={onCopyFromShipping}
            className="text-sm text-brand-primary hover:underline"
          >
            Same as shipping
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(handleAddressValidation)} className="space-y-4">
        {/* Country/Region */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-brand-text mb-1">
            Country/Region
          </label>
          <select
            {...register('country')}
            id="country"
            autoComplete="country"
            className={cn(
              'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
              'disabled:bg-chai-100 disabled:cursor-not-allowed',
              formErrors.country || errors?.country
                ? 'border-red-300 bg-red-50'
                : 'border-chai-300 hover:border-chai-400'
            )}
            disabled={isLoading}
          >
            <option value="">Select country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            {/* Add more countries */}
          </select>
          {(formErrors.country || errors?.country) && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {formErrors.country?.message || errors?.country?.message}
            </p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-brand-text mb-1">
              First name
            </label>
            <input
              {...register('firstName')}
              type="text"
              id="firstName"
              autoComplete="given-name"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                'disabled:bg-chai-100 disabled:cursor-not-allowed',
                formErrors.firstName || errors?.firstName
                  ? 'border-red-300 bg-red-50'
                  : 'border-chai-300 hover:border-chai-400'
              )}
              placeholder="First name"
              disabled={isLoading}
            />
            {(formErrors.firstName || errors?.firstName) && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {formErrors.firstName?.message || errors?.firstName?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-brand-text mb-1">
              Last name
            </label>
            <input
              {...register('lastName')}
              type="text"
              id="lastName"
              autoComplete="family-name"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                'disabled:bg-chai-100 disabled:cursor-not-allowed',
                formErrors.lastName || errors?.lastName
                  ? 'border-red-300 bg-red-50'
                  : 'border-chai-300 hover:border-chai-400'
              )}
              placeholder="Last name"
              disabled={isLoading}
            />
            {(formErrors.lastName || errors?.lastName) && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {formErrors.lastName?.message || errors?.lastName?.message}
              </p>
            )}
          </div>
        </div>

        {/* Address Line 1 */}
        <div>
          <label htmlFor="street1" className="block text-sm font-medium text-brand-text mb-1">
            Address
          </label>
          <input
            {...register('street1')}
            type="text"
            id="street1"
            autoComplete="address-line1"
            className={cn(
              'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
              'disabled:bg-chai-100 disabled:cursor-not-allowed',
              formErrors.street1 || errors?.street1
                ? 'border-red-300 bg-red-50'
                : 'border-chai-300 hover:border-chai-400'
            )}
            placeholder="Street address"
            disabled={isLoading}
          />
          {(formErrors.street1 || errors?.street1) && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {formErrors.street1?.message || errors?.street1?.message}
            </p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label htmlFor="street2" className="block text-sm font-medium text-brand-text mb-1">
            Apartment, suite, etc. <span className="text-chai-500 text-xs">(optional)</span>
          </label>
          <input
            {...register('street2')}
            type="text"
            id="street2"
            autoComplete="address-line2"
            className={cn(
              'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
              'disabled:bg-chai-100 disabled:cursor-not-allowed',
              'border-chai-300 hover:border-chai-400'
            )}
            placeholder="Apartment, suite, unit, etc."
            disabled={isLoading}
          />
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-brand-text mb-1">
              City
            </label>
            <input
              {...register('city')}
              type="text"
              id="city"
              autoComplete="address-level2"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                'disabled:bg-chai-100 disabled:cursor-not-allowed',
                formErrors.city || errors?.city
                  ? 'border-red-300 bg-red-50'
                  : 'border-chai-300 hover:border-chai-400'
              )}
              placeholder="City"
              disabled={isLoading}
            />
            {(formErrors.city || errors?.city) && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {formErrors.city?.message || errors?.city?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-brand-text mb-1">
              State
            </label>
            <select
              {...register('state')}
              id="state"
              autoComplete="address-level1"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                'disabled:bg-chai-100 disabled:cursor-not-allowed',
                formErrors.state || errors?.state
                  ? 'border-red-300 bg-red-50'
                  : 'border-chai-300 hover:border-chai-400'
              )}
              disabled={isLoading}
            >
              <option value="">Select state</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              {/* Add more states */}
            </select>
            {(formErrors.state || errors?.state) && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {formErrors.state?.message || errors?.state?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-brand-text mb-1">
              ZIP Code
            </label>
            <input
              {...register('zipCode')}
              type="text"
              id="zipCode"
              autoComplete="postal-code"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                'disabled:bg-chai-100 disabled:cursor-not-allowed',
                formErrors.zipCode || errors?.zipCode
                  ? 'border-red-300 bg-red-50'
                  : 'border-chai-300 hover:border-chai-400'
              )}
              placeholder="ZIP Code"
              disabled={isLoading}
            />
            {(formErrors.zipCode || errors?.zipCode) && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {formErrors.zipCode?.message || errors?.zipCode?.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-brand-text mb-1">
            Phone number
          </label>
          <div className="relative">
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              autoComplete="tel"
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                'disabled:bg-chai-100 disabled:cursor-not-allowed',
                formErrors.phone || errors?.phone
                  ? 'border-red-300 bg-red-50'
                  : 'border-chai-300 hover:border-chai-400'
              )}
              placeholder="Phone number"
              disabled={isLoading}
            />
            <Phone className="absolute right-3 top-2.5 w-4 h-4 text-chai-400" />
          </div>
          {(formErrors.phone || errors?.phone) && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {formErrors.phone?.message || errors?.phone?.message}
            </p>
          )}
        </div>

        {/* Save Address Option */}
        {showSaveOption && (
          <div className="flex items-start space-x-3">
            <input
              {...register('saveAddress')}
              type="checkbox"
              id="saveAddress"
              className="mt-1 h-4 w-4 text-brand-primary focus:ring-brand-primary border-chai-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="saveAddress" className="text-sm text-brand-text">
              Save this address for future orders
            </label>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading || isValidatingAddress}
            className="w-full"
            size="lg"
          >
            {isValidatingAddress ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating address...
              </>
            ) : isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Address Suggestions Modal */}
      {addressSuggestions.length > 0 && (
        <AddressSuggestionsModal
          suggestions={addressSuggestions}
          onSelect={(address) => {
            onSubmit(address)
            setAddressSuggestions([])
          }}
          onUseOriginal={() => {
            onSubmit(watch())
            setAddressSuggestions([])
          }}
          onClose={() => setAddressSuggestions([])}
        />
      )}
    </div>
  )
}
```

This comprehensive UI/UX specification provides a complete foundation for implementing the checkout page components with accessibility, responsive design, and user-friendly interactions. The components follow the Stripe subscription form pattern while integrating seamlessly with the existing design system.
