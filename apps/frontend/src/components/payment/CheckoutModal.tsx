import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { PaymentForm } from './PaymentForm'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const [step, setStep] = useState<'cart' | 'payment'>('cart')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 50 ? 0 : 5.99 // Free shipping over $50
  const total = subtotal + tax + shipping

  const createPaymentIntent = async () => {
    setIsCreatingPaymentIntent(true)
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'usd',
          productIds: cartItems.map(item => item.id),
        }),
      })

      const data = await response.json()
      setClientSecret(data.clientSecret)
      setStep('payment')
    } catch (error) {
      console.error('Error creating payment intent:', error)
    } finally {
      setIsCreatingPaymentIntent(false)
    }
  }

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment succeeded:', paymentIntent)
    // TODO: Clear cart, show success message, redirect
    onClose()
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error)
    // TODO: Show error message
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-chai-200">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-brand-primary" />
              <h2 className="text-xl font-semibold text-brand-text">
                {step === 'cart' ? 'Your Cart' : 'Payment'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-chai-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-brand-text" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {step === 'cart' ? (
              <div className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="flex items-center gap-4 p-4 bg-chai-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-brand-text">{item.name}</h3>
                        <p className="text-brand-primary font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1 hover:bg-chai-200 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-chai-200 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-chai-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-brand-text">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-brand-text">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-brand-text">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-chai-200 pt-2 flex justify-between font-semibold text-brand-text">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Proceed to Payment Button */}
                <Button
                  onClick={createPaymentIntent}
                  disabled={cartItems.length === 0 || isCreatingPaymentIntent}
                  className="w-full"
                  size="lg"
                >
                  {isCreatingPaymentIntent ? (
                    'Setting up payment...'
                  ) : (
                    <>
                      Proceed to Payment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <PaymentForm
                clientSecret={clientSecret!}
                amount={total}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}