import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../../contexts'

export const CartIcon: React.FC = () => {
  const { getTotalItems, toggleCart } = useCart()
  const itemCount = getTotalItems()

  return (
    <motion.button
      onClick={toggleCart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2 bg-white rounded-lg shadow-md border border-chai-200 hover:border-brand-primary transition-colors"
    >
      <ShoppingCart className="w-6 h-6 text-brand-text" />
      
      {itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </motion.span>
      )}
    </motion.button>
  )
}