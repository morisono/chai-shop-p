import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'
import { KineticText, AnimatedWords, Typewriter } from '../ui/KineticText'
import { Button } from '../ui/Button'

export const HeroSection: React.FC = () => {
  const [showTypewriter, setShowTypewriter] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypewriter(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const backgroundVariants = {
    hidden: { scale: 1.1, opacity: 0.8 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: 'easeOut',
      },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 from-chai-50 via-chai-100 to-chai-200 bg-[url(/public/images/top.png)] bg-cover bg-center" />
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 1, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-10 right-10 w-96 h-96 bg-brand-accent opacity-5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -1, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-10 left-10 w-80 h-80 bg-brand-primary opacity-5 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-1">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-brand-accent opacity-20 rounded-full"
            animate={{
              y: [-20, -120, -20],
              x: [0, 30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${60 + i * 5}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 noble-container text-center px-4"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <motion.p
            className="text-brand-primary font-mono text-sm uppercase tracking-wider"
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.2em' }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Established 1998 • Premium Chai Heritage
          </motion.p>
        </motion.div>

        <div className="mb-8">
          <KineticText
            variant="xl"
            className="text-brand-text mb-4"
            delay={0.5}
          >
            Artisanal Chai
          </KineticText>

          <AnimatedWords
            text="Crafted with Ancient Wisdom"
            className="text-sm text-kinetic-lg text-brand-primary"
            staggerDelay={0.15}
          />
        </div>

        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-lg text-brand-text/80 max-w-2xl mx-auto leading-relaxed">
            Experience the noble tradition of authentic Indian chai, where each blend
            tells a story of heritage, passion, and the finest spices carefully sourced
            from across the subcontinent.
          </p>
        </motion.div>

        {showTypewriter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <Typewriter
              text="Every sip. Every moment. Pure tradition."
              className="text-xl text-brand-accent"
              speed={80}
            />
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button size="lg" className="min-w-[200px]">
            Explore Our Blends
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="min-w-[200px] group"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Watch Our Story
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="font-display font-semibold text-lg text-brand-text mb-2">
              100% Natural
            </h3>
            <p className="text-brand-text/70">
              Organic spices and premium tea leaves
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏺</span>
            </div>
            <h3 className="font-display font-semibold text-lg text-brand-text mb-2">
              Traditional Blend
            </h3>
            <p className="text-brand-text/70">
              Time-honored recipes passed down generations
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-display font-semibold text-lg text-brand-text mb-2">
              Fresh Delivered
            </h3>
            <p className="text-brand-text/70">
              Daily roasted and shipped worldwide
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-brand-primary/60" />
      </motion.div>
    </section>
  )
}
