import React from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { Button } from '../ui/Button'
import { KineticText } from '../ui/KineticText'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  description: string
  tags: string[]
  isPopular?: boolean
  isNew?: boolean
}

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Masala Chai',
    price: 14.99,
    originalPrice: 29.99,
    rating: 4.9,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop&crop=center',
    description: 'A harmonious blend of black tea, cardamom, cinnamon, ginger, and cloves',
    tags: ['Bestseller', 'Traditional'],
    isPopular: true,
  },
  {
    id: '2',
    name: 'Royal Saffron Chai',
    price: 19.99,
    rating: 4.8,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1575397282820-f72467c262e5?w=300&h=300&fit=crop&crop=center',
    description: 'Luxurious blend with premium saffron, rose petals, and aromatic spices',
    tags: ['Premium', 'Limited Edition'],
    isNew: true,
  },
  {
    id: '3',
    name: 'Green Cardamom Chai',
    price: 19.99,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1512484149279-9751676e56c4?w=300&h=300&fit=crop&crop=center',
    description: 'Refreshing green tea base with whole green cardamom pods',
    tags: ['Organic', 'Light'],
  },
]

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isFavorited, setIsFavorited] = React.useState(false)

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl shadow-lg border border-chai-200 overflow-hidden"
    >
      {/* Badge */}
      {(product.isPopular || product.isNew) && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            product.isPopular
              ? 'bg-brand-accent text-white'
              : 'bg-green-500 text-white'
          }`}>
            {product.isPopular ? 'Bestseller' : 'New'}
          </span>
        </div>
      )}

      {/* Favorite button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsFavorited(!isFavorited)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'
          }`}
        />
      </motion.button>

      {/* Product Image */}
      <div className="relative overflow-hidden bg-gradient-warm p-8">
        <motion.img
          variants={imageVariants}
          animate={isHovered ? 'hover' : 'rest'}
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-2xl"
        />

        {/* Floating elements on hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="absolute inset-0 bg-brand-primary/10 rounded-2xl flex items-center justify-center"
        >
          <Button size="sm" className="shadow-xl">
            Quick View
          </Button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-display font-semibold text-xl text-brand-text mb-2 group-hover:text-brand-primary transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-brand-text/70 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-chai-100 text-brand-primary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl text-brand-text">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export const ProductShowcase: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-br from-chai-50 to-white">
      <div className="noble-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-brand-primary font-mono text-sm uppercase tracking-wider mb-4"
          >
            Featured Collection
          </motion.p>

          <KineticText variant="lg" className="text-brand-text mb-6">
            Premium Chai Blends
          </KineticText>

          <p className="text-lg text-brand-text/80 max-w-2xl mx-auto leading-relaxed">
            Discover our signature collection of artisanal chai blends, each crafted
            with the finest spices and time-honored traditions passed down through generations.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Button size="lg" variant="secondary" className="min-w-[200px]">
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
