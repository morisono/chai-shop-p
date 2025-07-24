import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, User } from 'lucide-react'
import { Button } from '../ui/Button'

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { name: 'Shop', href: '#shop' },
    { name: 'Our Story', href: '#story' },
    { name: 'Blends', href: '#blends' },
    { name: 'Subscriptions', href: '#subscriptions' },
    { name: 'Contact', href: '#contact' },
  ]

  const headerVariants = {
    top: {
      backgroundColor: 'rgba(255, 248, 220, 0.95)',
      backdropFilter: 'blur(0px)',
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    },
    scrolled: {
      backgroundColor: 'rgba(255, 248, 220, 0.98)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 20px rgba(139, 69, 19, 0.1)',
    },
  }

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  }

  return (
    <motion.header
      initial="top"
      animate={isScrolled ? 'scrolled' : 'top'}
      variants={headerVariants}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="noble-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-chai rounded-full flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">प</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-brand-text">
                Paramparā
              </h1>
              <p className="text-xs text-brand-primary font-mono">Since 1998</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ y: -2 }}
                className="text-brand-text hover:text-brand-primary transition-colors duration-300 font-medium"
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-brand-text hover:text-brand-primary transition-colors"
            >
              <User className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-brand-text hover:text-brand-primary transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </motion.button>
            <Button size="sm">Order Now</Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-brand-text"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden absolute top-full left-0 right-0 bg-brand-background border-t border-chai-200 shadow-lg"
            >
              <div className="px-4 py-6 space-y-4">
                {navigationItems.map((item, i) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    custom={i}
                    variants={itemVariants}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-brand-text hover:text-brand-primary transition-colors py-2 font-medium"
                  >
                    {item.name}
                  </motion.a>
                ))}
                <div className="pt-4 border-t border-chai-200 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="p-2 text-brand-text">
                      <User className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-brand-text relative">
                      <ShoppingBag className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent text-white text-xs rounded-full flex items-center justify-center">
                        2
                      </span>
                    </button>
                  </div>
                  <Button size="sm">Order Now</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
