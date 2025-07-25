import React, { useState } from 'react'
import { 
  PaymentElement, 
  useStripe, 
  useElements,
  Elements 
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { motion } from 'framer-motion'
import { CreditCard, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  clientSecret: string
  amount: number
  onSuccess?: (paymentIntent: any) => void
  onError?: (error: string) => void
}

const CheckoutForm: React.FC<Omit<PaymentFormProps, 'clientSecret'> & { onSuccess?: (paymentIntent: any) => void }> = ({ 
  amount, 
  onSuccess, 
  onError 
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/complete`,
      },
      redirect: 'if_required',
    })

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.')
      onError?.(error.message || 'Payment failed')
    } else if (paymentIntent?.status === 'succeeded') {
      setMessage('Payment succeeded!')
      onSuccess?.(paymentIntent)
    }

    setIsProcessing(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg p-6 shadow-lg border border-chai-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-primary/10 rounded-lg">
            <CreditCard className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-brand-text">Payment Details</h3>
            <p className="text-sm text-brand-text/70">
              Total: ${amount.toFixed(2)}
            </p>
          </div>
        </div>

        <PaymentElement 
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                email: '',
              }
            }
          }}
        />

        {message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes('succeeded') 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-brand-text/70">
          <Lock className="w-4 h-4" />
          <span>Secured by Stripe</span>
        </div>

        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="min-w-[140px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              Pay ${amount.toFixed(2)}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.form>
  )
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  clientSecret, 
  amount, 
  onSuccess, 
  onError 
}) => {
  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
        <span className="ml-2 text-brand-text/70">Initializing payment...</span>
      </div>
    )
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#8B4513',
        colorBackground: '#ffffff',
        colorText: '#2D1810',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm 
        amount={amount} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  )
}