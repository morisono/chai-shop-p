import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../../contexts'
import { Button } from '../ui/Button'

export const CartSidebar: React.FC = () => {
  const { 
    state, 
    removeItem, 
    updateQuantity, 
    closeCart, 
    getTotalPrice 
  } = useCart()

  const { items, isOpen } = state
  const totalPrice = getTotalPrice()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-chai-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-brand-primary" />
                <h2 className="text-lg font-semibold text-brand-text">
                  Shopping Cart ({items.length})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-chai-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-brand-text" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-chai-300 mb-4" />
                  <h3 className="text-lg font-medium text-brand-text mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-brand-text/70 mb-6">
                    Add some delicious chai to get started!
                  </p>
                  <Button onClick={closeCart} variant="secondary">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 bg-chai-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-brand-text mb-1">
                          {item.name}
                        </h3>
                        <p className="text-brand-primary font-semibold mb-2">
                          ${item.price.toFixed(2)}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-chai-200 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-chai-200 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
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
                
                <Button className="w-full" size="lg">
                  Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full" 
                  onClick={closeCart}
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}