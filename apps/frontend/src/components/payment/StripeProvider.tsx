import React, { createContext, useContext, ReactNode } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'

interface StripeContextType {
  stripe: Stripe | null
  isLoading: boolean
}

const StripeContext = createContext<StripeContextType>({
  stripe: null,
  isLoading: true,
})

interface StripeProviderProps {
  children: ReactNode
}

let stripePromise: Promise<Stripe | null>

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      console.error('Missing VITE_STRIPE_PUBLISHABLE_KEY')
      return Promise.resolve(null)
    }
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const [stripe, setStripe] = React.useState<Stripe | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const initStripe = async () => {
      try {
        const stripeInstance = await getStripe()
        setStripe(stripeInstance)
      } catch (error) {
        console.error('Failed to load Stripe:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initStripe()
  }, [])

  return (
    <StripeContext.Provider value={{ stripe, isLoading }}>
      {children}
    </StripeContext.Provider>
  )
}

export const useStripe = () => {
  const context = useContext(StripeContext)
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider')
  }
  return context
}