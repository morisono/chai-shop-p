import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/css/global.css'

// Import components
import { Header } from './components/sections/Header'
import { HeroSection } from './components/sections/HeroSection'
import { ProductShowcase } from './components/sections/ProductShowcase'
import { BrandStory } from './components/sections/BrandStory'
import { Footer } from './components/sections/Footer'

function App() {
  return (
    <div className="min-h-screen bg-chai-50">
      <Header />
      <main>
        <HeroSection />
        <ProductShowcase />
        <BrandStory />
      </main>
      <Footer />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
