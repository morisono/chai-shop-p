import React from 'react'
import { motion } from 'framer-motion'

interface KineticTextProps {
  children: React.ReactNode
  variant?: 'xl' | 'lg' | 'md' | 'sm'
  className?: string
  delay?: number
  duration?: number
}

export const KineticText: React.FC<KineticTextProps> = ({
  children,
  variant = 'lg',
  className = '',
  delay = 0,
  duration = 0.8,
}) => {
  const variants = {
    xl: 'text-kinetic-xl',
    lg: 'text-kinetic-lg',
    md: 'text-kinetic-md',
    sm: 'text-kinetic-sm',
  }

  const motionVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={motionVariants}
      className={`font-display ${variants[variant]} ${className}`}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedWordProps {
  text: string
  className?: string
  staggerDelay?: number
}

export const AnimatedWords: React.FC<AnimatedWordProps> = ({
  text,
  className = '',
  staggerDelay = 0.1,
}) => {
  const words = text.split(' ')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`font-display ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="inline-block mr-2"
          style={{ transformOrigin: '50% 50%' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

interface TypewriterProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  className = '',
  onComplete,
}) => {
  const [displayText, setDisplayText] = React.useState('')
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={`font-display ${className}`}>
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  )
}
