import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-300 focus:outline-none focus:ring-2
    focus:ring-brand-accent focus:ring-offset-2 disabled:opacity-50
    disabled:cursor-not-allowed
  `

  const variants = {
    primary: `
      bg-brand-primary text-white shadow-lg
      hover:bg-brand-accent hover:shadow-xl hover:scale-105
      active:scale-95
    `,
    secondary: `
      border-2 border-brand-primary text-brand-primary bg-transparent
      hover:bg-brand-primary hover:text-white hover:scale-105
      active:scale-95
    `,
    ghost: `
      text-brand-primary bg-transparent
      hover:bg-brand-secondary hover:scale-105
      active:scale-95
    `,
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
      ) : (
        children
      )}
    </motion.button>
  )
}
