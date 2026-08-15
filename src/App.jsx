import React, { useEffect, useState } from 'react'
import { Menu, X, Globe, ChevronUp } from 'lucide-react'
import Hero from './components/Hero'
import About from './components/About'
import Lake from './components/Lake'
import Services from './components/Services'
import Festivals from './components/Festivals'
import Gallery from './components/Gallery'
import Footer from './components/Footer'
import HistoryPage from './components/HistoryPage'
import GalleryPage from './components/GalleryPage'
import Reviews from './components/Reviews'
import { useLanguage } from './context/LanguageContext'

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => setLoading(false), 800) // wait for css transition
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      setShowScrollTop(window.scrollY > window.innerHeight)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    // Use a small timeout to ensure DOM is rendered before observing
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el)
      })
    }, 100)

    return () => observer.disconnect()
  }, [currentPage, loading]) // Re-run when page changes or loading finishes

  // Auto-close menu when navigating
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage])

  return (
    <>
      {loading && (
        <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
          <img src="/logo.png" alt="Temple Logo" className="loading-logo" />
        </div>
      )}

      <nav className={`navbar ${scrolled || currentPage !== 'home' ? 'scrolled' : ''}`}>
        <div className="nav-background">
          <div className="nav-container">
            <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>
              <img src="/logo.png" alt="Temple Logo" style={{ height: '40px', width: 'auto', marginRight: '10px' }} />
              {t('nav', 'brand')}
            </a>
            
            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              {currentPage === 'home' && (
                <>
                  <a href="#home" onClick={() => setIsMenuOpen(false)}>{language === 'en' ? 'Home' : 'ಮುಖ್ಯಪುಟ'}</a>
                  <a href="#about" onClick={() => setIsMenuOpen(false)}>{t('nav', 'history')}</a>
                  <a href="#lake" onClick={() => setIsMenuOpen(false)}>{t('nav', 'lake')}</a>
                  <a href="#services" onClick={() => setIsMenuOpen(false)}>{t('nav', 'rituals')}</a>
                  <a href="#gallery" onClick={() => setIsMenuOpen(false)}>{t('nav', 'gallery')}</a>
                </>
              )}
              {(currentPage === 'history' || currentPage === 'gallery_page') && (
                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setIsMenuOpen(false); }}>
                  {language === 'en' ? 'Back to Home' : 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ'}
                </a>
              )}
            </div>

            <div className="nav-actions">
              <button className="lang-toggle-btn" onClick={toggleLanguage} style={{ padding: '0.5rem 0.8rem', minWidth: 'auto', fontWeight: 'bold' }}>
                {language === 'en' ? 'ಕ' : 'En'}
              </button>
              <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        <div className="nav-marquee">
          <div className="nav-marquee-track">
            {/* Repeat the text multiple times to create a continuous infinite scrolling effect */}
            {[...Array(10)].map((_, i) => (
              <span key={i} className="marquee-text">
                {language === 'en' ? 'Om Namo Bhagavate Vasudevaya' : 'ಓಂ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ'}
              </span>
            ))}
          </div>
        </div>
      </nav>

      {currentPage === 'home' ? (
        <main>
          <Hero />
          <About onNavigate={setCurrentPage} />
          <Lake />
          <Services />
          <Festivals />
          <Gallery onNavigate={setCurrentPage} />
          <Reviews />
        </main>
      ) : currentPage === 'history' ? (
        <main>
          <HistoryPage onNavigate={setCurrentPage} />
        </main>
      ) : (
        <main>
          <GalleryPage onNavigate={setCurrentPage} />
        </main>
      )}

      <Footer />
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <ChevronUp size={24} />
        </button>
      )}
    </>
  )
}

export default App
