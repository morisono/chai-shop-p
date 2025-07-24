import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Chai Brand Palette
        brand: {
          primary: '#8B4513',     // Saddle Brown - chai richness
          secondary: '#F5DEB3',   // Beige - warmth and comfort
          accent: '#D2691E',      // Chocolate - premium spice tones
          background: '#FFF8DC',  // Cornsilk - soft, paper-like warmth
          text: '#2F1B14',        // Dark Brown - sophisticated readability
        },
        // Semantic color extensions
        chai: {
          50: '#FFF8DC',   // Cornsilk
          100: '#F5DEB3',  // Beige
          200: '#DEB887',  // Burlywood
          300: '#D2B48C',  // Tan
          400: '#CD853F',  // Peru
          500: '#D2691E',  // Chocolate
          600: '#A0522D',  // Sienna
          700: '#8B4513',  // Saddle Brown
          800: '#654321',  // Dark Brown
          900: '#2F1B14',  // Deep Brown
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Kinetic Typography Scale
        'kinetic-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'kinetic-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'kinetic-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'kinetic-sm': ['1.875rem', { lineHeight: '1.25', letterSpacing: '0.01em' }],
      },
      spacing: {
        // Premium spacing scale
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      animation: {
        'kinetic-fade-in': 'kineticFadeIn 0.8s ease-out',
        'kinetic-slide-up': 'kineticSlideUp 0.8s ease-out',
        'kinetic-scale': 'kineticScale 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        kineticFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        kineticSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        kineticScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 69, 19, 0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 69, 19, 0.2)' },
        },
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}

export default config
