import React, { useEffect, useState } from 'react'
import { Menu, X, Globe, ChevronUp, Home } from 'lucide-react'
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
import Announcement from './components/Announcement'
import AnnouncementPage from './components/AnnouncementPage'
import { useLanguage } from './context/LanguageContext'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [currentPage, setCurrentPage] = useState('home');
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  // Check auth check will happen in AdminDashboard, so we can initialize from true/false here safely or use checking state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    // Initial check for admin session
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/check`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated) setIsAdminLoggedIn(true);
      }).catch(() => {});
      
    const handleHash = () => {
      if (window.location.hash === '#admin') setCurrentPage('admin');
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => setLoading(false), 800)
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

    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el)
      })
    }, 100)

    return () => observer.disconnect()
  }, [currentPage, loading])

  useEffect(() => {
    if (currentPage === 'home' && window.location.hash && window.location.hash !== '#admin') {
      const element = document.getElementById(window.location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState(null, null, window.location.pathname + window.location.search);
        }, 100);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [currentPage])

  return (
    <>
      {loading && (
        <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
          <img src="/logo.png" alt="Temple Logo" className="loading-logo" />
        </div>
      )}



      {currentPage !== 'admin' && (
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
                  <a href="#home" onClick={() => setIsMenuOpen(false)} aria-label="Home">
                    <Home size={20} />
                  </a>
                  <a href="#about" onClick={() => setIsMenuOpen(false)}>{t('nav', 'history')}</a>
                  <a href="#lake" onClick={() => setIsMenuOpen(false)}>{t('nav', 'lake')}</a>
                  <a href="#services" onClick={() => setIsMenuOpen(false)}>{t('nav', 'rituals')}</a>
                  <a href="#gallery" onClick={() => setIsMenuOpen(false)}>{t('nav', 'gallery')}</a>
                </>
              )}
              {(currentPage === 'history' || currentPage === 'gallery_page' || currentPage === 'announcement_page') && (
                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setIsMenuOpen(false); }}>
                  {language === 'en' ? 'Back to Home' : 'ಮರಳಿ ಮನೆಗೆ'}
                </a>
              )}
            </div>

            <div className="nav-actions">
              {currentPage !== 'admin' && (
                <>
                  <Announcement onAnnouncementClick={(ann) => {
                    setActiveAnnouncement(ann);
                    setCurrentPage('announcement_page');
                    window.scrollTo(0, 0);
                  }} />
                  <button 
                    className="lang-toggle-btn"
                    onClick={toggleLanguage}
                    aria-label="Toggle language"
                  >
                    <Globe size={20} />
                    <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
                  </button>
                </>
              )}
              
              <button 
                className="mobile-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        <div className="nav-marquee">
          <div className="nav-marquee-track">
            {Array(10).fill(language === 'en' ? 'Om Namo Bhagavathe Vasudevaya  |  ' : 'ಓಂ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ').map((text, i) => (
              <span key={i} className={`marquee-text ${language === 'en' ? '' : 'font-devanagari'}`}>{text}</span>
            ))}
          </div>
        </div>
      </nav>
      )}

      {currentPage === 'admin' ? (
        <main>
          {isAdminLoggedIn ? (
            <AdminDashboard onLogout={() => { localStorage.removeItem('adminToken'); setIsAdminLoggedIn(false); setCurrentPage('home'); window.location.hash = ''; }} />
          ) : (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <h2>Access Denied</h2>
              <button className="hero-btn" onClick={() => { setCurrentPage('home'); window.location.hash = ''; setShowLoginPopup(true); }}>Login to Admin</button>
            </div>
          )}
        </main>
      ) : currentPage === 'history' ? (
        <main>
          <HistoryPage onBack={() => { setCurrentPage('home'); window.scrollTo(0, 0); }} />
        </main>
      ) : currentPage === 'announcement_page' ? (
        <main>
          <AnnouncementPage announcement={activeAnnouncement} onBack={() => { setCurrentPage('home'); window.scrollTo(0, 0); }} />
        </main>
      ) : currentPage === 'gallery_page' ? (
        <main>
          <GalleryPage onNavigate={setCurrentPage} />
        </main>
      ) : (
        <main>
          <Hero />
          <About onNavigate={setCurrentPage} />
          <Lake />
          <Services />
          <Festivals />
          <Gallery onNavigate={setCurrentPage} />
          <Reviews />
        </main>
      )}

      {currentPage !== 'admin' && <Footer onAdminClick={() => setShowLoginPopup(true)} />}

      
      
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <ChevronUp size={24} />
        </button>
      )}

      {showLoginPopup && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target.className === 'admin-modal-overlay') setShowLoginPopup(false); }}>
          <div className="admin-modal-content">
            <button className="close-modal-btn" onClick={() => setShowLoginPopup(false)}>&times;</button>
            <AdminLogin onLoginSuccess={() => {
              setIsAdminLoggedIn(true);
              setShowLoginPopup(false);
              setCurrentPage('admin');
              window.location.hash = '#admin';
            }} />
          </div>
        </div>
      )}
    </>
  )
}

export default App
