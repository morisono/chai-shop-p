import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, Leaf, Award } from 'lucide-react'
import { KineticText } from '../ui/KineticText'
import { Button } from '../ui/Button'

export const BrandStory: React.FC = () => {
  const achievements = [
    {
      icon: Clock,
      title: '25+ Years',
      description: 'Of crafting authentic chai',
    },
    {
      icon: Users,
      title: '50,000+',
      description: 'Happy customers worldwide',
    },
    {
      icon: Leaf,
      title: '100%',
      description: 'Organic & sustainable sourcing',
    },
    {
      icon: Award,
      title: '15+',
      description: 'International awards',
    },
  ]

  const timeline = [
    {
      year: '1998',
      title: 'The Beginning',
      description: 'Founded by Rajesh Patel in Mumbai with a vision to share authentic chai traditions.',
    },
    {
      year: '2005',
      title: 'First Export',
      description: 'Expanded internationally, bringing Indian chai culture to global markets.',
    },
    {
      year: '2012',
      title: 'Organic Certification',
      description: 'Achieved full organic certification for all our tea gardens and spice sources.',
    },
    {
      year: '2018',
      title: 'Sustainability Initiative',
      description: 'Launched our carbon-neutral packaging and fair trade partnerships.',
    },
    {
      year: '2023',
      title: 'Digital Innovation',
      description: 'Introduced AI-powered personalized chai recommendations and subscription service.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-chai-50 to-chai-100 overflow-hidden">
      <div className="noble-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-brand-primary font-mono text-sm uppercase tracking-wider mb-4"
          >
            Our Heritage
          </motion.p>

          <KineticText variant="lg" className="text-brand-text mb-4">
            A Legacy of Tradition
          </KineticText>

          <p className="text-md text-brand-text/80 max-w-3xl mx-auto leading-relaxed">
            From a small tea stall in Mumbai to a global brand, our journey has been
            guided by one unwavering principle: honoring the sacred tradition of chai
            while embracing the future with sustainability and innovation.
          </p>
        </motion.div>

        {/* Main Story Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Story Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h3 className="font-display font-bold text-2xl text-brand-text mb-3">
                The Paramparā Promise
              </h3>
              <p className="text-brand-text/80 leading-relaxed mb-3">
                Paramparā (परम्परा) means "tradition" in Sanskrit—a word that embodies
                our commitment to preserving the authentic art of chai making while
                ensuring every cup tells the story of our heritage.
              </p>
              <p className="text-brand-text/80 leading-relaxed">
                Our master tea blenders work closely with local farmers across India,
                sourcing the finest leaves and spices through sustainable partnerships
                that support entire communities.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4">
              <Button>Learn Our Process</Button>
              <Button variant="ghost">Meet Our Farmers</Button>
            </motion.div>
          </motion.div>

          {/* Story Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1624186670515-82047cefd635?w=600&h=400&fit=crop&crop=center"
                alt="Chai preparation process"
                className="w-full h-[24rem] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent" />

              {/* Floating stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <p className="text-brand-text font-semibold text-lg">
                    "Every blend is a celebration of culture, tradition, and craftsmanship."
                  </p>
                  <p className="text-brand-primary text-sm mt-2">
                    — Rajesh Patel, Founder
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-brand-accent/10 rounded-full blur-xl"
            />
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-chai-200"
            >
              <div className="w-16 h-16 bg-gradient-chai rounded-full flex items-center justify-center mx-auto mb-4">
                <achievement.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-display font-bold text-2xl text-brand-text mb-2">
                {achievement.title}
              </h4>
              <p className="text-brand-text/70 text-sm">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="font-display font-bold text-3xl text-brand-text text-center mb-12">
            Our Journey Through Time
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-brand-primary to-brand-accent" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-chai-200">
                      <span className="font-display font-bold text-3xl text-brand-primary">
                        {item.year}
                      </span>
                      <h4 className="font-display font-semibold text-xl text-brand-text mt-2">
                        {item.title}
                      </h4>
                      <p className="text-brand-text/70 mt-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="w-2/12 flex justify-center">
                    <div className="w-6 h-6 bg-brand-accent rounded-full border-4 border-white shadow-lg" />
                  </div>

                  <div className="w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
