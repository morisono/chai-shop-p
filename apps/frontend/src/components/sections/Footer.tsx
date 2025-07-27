import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Instagram, Facebook, Twitter, MapPin, Phone, Clock } from 'lucide-react'
import { Button } from '../ui/Button'
import { KineticText } from '../ui/KineticText'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const footerLinks = {
    products: [
      { name: 'Classic Blends', href: '#' },
      { name: 'Premium Collection', href: '#' },
      { name: 'Seasonal Specials', href: '#' },
      { name: 'Gift Sets', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Our Story', href: '#' },
      { name: 'Sustainability', href: '#' },
      { name: 'Careers', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Brewing Guide', href: '#' },
      { name: 'Shipping Info', href: '#' },
      { name: 'Returns', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Accessibility', href: '#' },
    ],
  }

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ]

  return (
    <footer className="bg-gradient-to-br from-brand-text via-brand-primary to-brand-accent text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="noble-container py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <KineticText variant="md" className="text-white mb-6">
              Stay Connected with Paramparā
            </KineticText>

            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join our community of chai enthusiasts and be the first to know about
              new blends, brewing tips, and exclusive offers.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
              <Button
                type="submit"
                className="text-brand-primary hover:bg-white/30 min-w-[120px]"
              >
                {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
              </Button>
            </form>

            <p className="text-white/60 text-sm mt-4">
              By subscribing, you agree to receive marketing emails from Paramparā.
              You can unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="noble-container py-16">
        <div className="grid sm:grid-cols-2
        md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-brand-primary font-display font-bold text-xl">प</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl">Paramparā</h3>
                  <p className="text-sm text-white/60">Since 1998</p>
                </div>
              </div>

              <p className="text-white/80 mb-6 leading-relaxed">
                Preserving the authentic tradition of chai making while embracing
                innovation and sustainability for future generations.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white/60" />
                  <span className="text-white/80">Mumbai, Maharashtra, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-white/60" />
                  <span className="text-white/80">+91 22 2345 6789</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-white/60" />
                  <span className="text-white/80">Mon-Fri: 9AM-6PM IST</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="font-display font-semibold text-lg mb-6">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="font-display font-semibold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="font-display font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h4 className="font-display font-semibold text-lg mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex items-center gap-6">
              <p className="text-white/60">Follow us:</p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ y: -2, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-white/60 text-sm">
                Paramparā © {new Date().getFullYear()}
              </p>
              <p className="text-white/40 text-xs mt-1">
                Made with ❤️ for chai lovers
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-brand-secondary via-brand-accent to-brand-primary" />
    </footer>
  )
}
