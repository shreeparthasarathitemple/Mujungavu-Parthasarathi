import React, { useEffect, useState, Suspense, lazy } from 'react'
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom'
import { Menu, X, Globe, ChevronUp, Home, Bell } from 'lucide-react'
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
import AnnouncementsGrid from './components/AnnouncementsGrid'
import NewsPortal from './components/NewsPortal'
import NewsArticle from './components/NewsArticle'
import SectionWrapper from './components/SectionWrapper'
import ContactPage from './components/ContactPage'
import NotFound from './components/NotFound'
import PrivacyPolicy from './components/PrivacyPolicy'
import DataDeletion from './components/DataDeletion'
import NotificationPrompt from './components/NotificationPrompt'
import { useLanguage } from './context/LanguageContext'
import { Helmet } from 'react-helmet-async'

const AdminLogin = lazy(() => import('./admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))

function HomePage({ handleHeroReady, setCurrentPage }) {
  return (
    <>
      <Hero onReady={handleHeroReady} />
      <About onNavigate={setCurrentPage} />
      <Lake />
      <Services />
      <Festivals />
      <Gallery onNavigate={setCurrentPage} />
      <Reviews />
    </>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [activeAnnouncement, setActiveAnnouncement] = useState(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [seoData, setSeoData] = useState(null)
  
  const { language, toggleLanguage, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    // Dynamically update document.documentElement.lang
    document.documentElement.lang = language === 'kn' ? 'kn' : 'en';
  }, [language]);

  useEffect(() => {
    // Register push service worker and clean up old caching ones
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          // Only unregister if it's not our explicit push service worker
          if (registration.active && !registration.active.scriptURL.endsWith('/sw.js')) {
            registration.unregister();
          }
        }
      });
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service Worker registration failed: ', err);
      });
    }

    // Initial check for admin session
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/check`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated) setIsAdminLoggedIn(true);
      }).catch(() => {});
  }, []);

  useEffect(() => {
    // Live Clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Analytics Tracking & Dynamic SEO
  useEffect(() => {
    if (!isAdmin) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: location.pathname })
      }).catch(() => {}); // Fail silently
      
      // Fetch dynamic SEO for this route
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/seo/page?route=${encodeURIComponent(location.pathname)}`)
        .then(res => {
          if (res.ok) return res.json();
          return null;
        })
        .then(data => {
          if (data) setSeoData(data);
          else setSeoData(null); // Reset if not found
        })
        .catch(() => setSeoData(null));
    }
  }, [location.pathname, isAdmin]);

  // Preloading & Loading Screen Logic
  useEffect(() => {
    if (!isHome) {
      setFadeOut(true);
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
    
    const fallbackTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 800);
    }, 8000);

    return () => clearTimeout(fallbackTimer);
  }, [isHome]);

  const handleHeroReady = () => {
    setFadeOut(true);
    setTimeout(() => setLoading(false), 800);
  };

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
  }, [location.pathname, loading])

  useEffect(() => {
    if (isHome && location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash])

  const getSEOMetadata = () => {
    const baseTitle = language === 'en' ? "Mujungavu Parthasarathi | Official Website" : "ಮುಜುಂಗಾವು ಪಾರ್ಥಸಾರಥಿ | ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್";
    let defaultDesc = language === 'en' 
      ? "Official website of Sri Parthasarathi Temple, Mujungavu, Kumbla, Kasaragod. Find temple timings, poojas, festivals, history, announcements, gallery and location information."
      : "ಮುಜುಂಗಾವು ಪಾರ್ಥಸಾರಥಿಯ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್.";
    let defaultTitle = `Sri Parthasarathi Temple Mujungavu | Mujungavu Temple, Kumbla`;
    
    // Use dynamic SEO data if available, otherwise fallback to defaults
    let title = seoData?.title || defaultTitle;
    let description = seoData?.description || defaultDesc;
    let keywords = seoData?.keywords || "";
    let imageUrl = seoData?.imageUrl || "";

    // Specific static fallbacks if no dynamic SEO is configured
    if (!seoData) {
      if (location.pathname === '/history') title = `${language === 'en' ? 'History' : 'ಇತಿಹಾಸ'} | ${baseTitle}`;
      if (location.pathname === '/about') title = `About | ${baseTitle}`;
      if (location.pathname === '/temple-timings') title = `Temple Timings | ${baseTitle}`;
      if (location.pathname === '/poojas') title = `Poojas | ${baseTitle}`;
      if (location.pathname === '/festivals') title = `Festivals | ${baseTitle}`;
      if (location.pathname === '/contact' || location.pathname === '/location') title = `Contact & Location | ${baseTitle}`;
      if (location.pathname === '/gallery') title = `${language === 'en' ? 'Gallery' : 'ಗ್ಯಾಲರಿ'} | ${baseTitle}`;
      if (location.pathname.startsWith('/announcement') && activeAnnouncement) {
        title = `${activeAnnouncement.title} | ${baseTitle}`;
        if (activeAnnouncement.description) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = activeAnnouncement.description;
          description = tempDiv.textContent || tempDiv.innerText || "";
          description = description.substring(0, 150) + '...';
        }
      }
    }
    
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={currentUrl} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      </Helmet>
    );
  };

  const handleLegacyNavigation = (page) => {
    if (page === 'history') navigate('/history');
    else if (page === 'gallery_page') navigate('/gallery');
    else navigate('/');
  };

  return (
    <>
      {getSEOMetadata()}
      
      {loading && (
        <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
          <div className="loading-content">
            <div className="logo-wrapper">
              <div className="glowing-ring"></div>
              <img src="/logo.png" alt="Temple Logo" className="loading-logo-premium" />
            </div>
            <h2 className="loading-title">ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ಮುಜುಂಗಾವು</h2>
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      )}

      {(!isAdmin && !showLoginPopup) && (
      <nav className={`navbar ${scrolled || !isHome ? 'scrolled' : ''}`}>
        <div className="nav-background">
          <div className="nav-container">
            <Link to="/" className="nav-brand" onClick={() => setIsMenuOpen(false)}>
              <img src="/logo.png" alt="Temple Logo" style={{ height: '40px', width: 'auto', marginRight: '10px' }} />
              {t('nav', 'brand')}
            </Link>
            
            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              {isHome ? (
                <>
                  <a href="#home" onClick={() => setIsMenuOpen(false)} aria-label="Home">
                    <Home size={20} />
                  </a>
                  <a href="#about" onClick={() => setIsMenuOpen(false)}>{t('nav', 'history')}</a>
                  <a href="#lake" onClick={() => setIsMenuOpen(false)}>{t('nav', 'lake')}</a>
                  <a href="#services" onClick={() => setIsMenuOpen(false)}>{t('nav', 'rituals')}</a>
                  <a href="#gallery" onClick={() => setIsMenuOpen(false)}>{t('nav', 'gallery')}</a>
                  <Link to="/news" onClick={() => setIsMenuOpen(false)}>
                    {language === 'en' ? 'News' : 'ಸುದ್ದಿ'}
                  </Link>
                </>
              ) : (
                <Link to="/" onClick={() => setIsMenuOpen(false)} aria-label="Back to Home">
                  <Home size={20} />
                </Link>
              )}
            </div>

            <div className="nav-actions" style={{ marginLeft: '20px' }}>

              {!isAdmin && (
                <>
                  <Announcement onAnnouncementClick={(ann) => {
                    navigate(`/a/${ann._id.slice(-6)}`);
                  }} />
                  <button 
                    className="lang-toggle-btn"
                    onClick={toggleLanguage}
                    aria-label="Toggle language"
                  >
                    <Globe size={18} />
                    <span>{language === 'en' ? 'KN' : 'EN'}</span>
                  </button>
                  <div className="nav-time-star" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px', color: 'var(--gold)', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: '600' }}>{formatTime(currentTime)}</span>
                  </div>
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
            {Array(10).fill(language === 'en' ? 'Om Namo Bhagavathe Vasudevaya' : 'ಓಂ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ').map((text, i) => (
              <span key={i} className={`marquee-text ${language === 'en' ? '' : 'font-kannada-attractive'}`}>{text}</span>
            ))}
          </div>
        </div>
      </nav>
      )}

      <main>
        <Suspense fallback={<div style={{height: '100vh'}} />}>
          <Routes>
            <Route path="/" element={<HomePage handleHeroReady={handleHeroReady} setCurrentPage={handleLegacyNavigation} />} />
            <Route path="/history" element={<HistoryPage onBack={() => navigate('/')} />} />
            <Route path="/gallery" element={<GalleryPage onNavigate={handleLegacyNavigation} />} />
            <Route path="/announcements" element={<AnnouncementsGrid />} />
            <Route path="/news" element={<NewsPortal />} />
            <Route path="/news/:id" element={<NewsArticle />} />
            <Route path="/a/:id" element={<AnnouncementPage />} />
            <Route path="/announcement/:id" element={<AnnouncementPage />} /> {/* Legacy support */}
            
            {/* Standalone SEO Routes */}
            <Route path="/about" element={<SectionWrapper><About onNavigate={handleLegacyNavigation} /></SectionWrapper>} />
            <Route path="/temple-timings" element={<SectionWrapper><About onNavigate={handleLegacyNavigation} /></SectionWrapper>} />
            <Route path="/lake" element={<SectionWrapper><Lake /></SectionWrapper>} />
            <Route path="/services" element={<SectionWrapper><Services /></SectionWrapper>} />
            <Route path="/poojas" element={<SectionWrapper><Services /></SectionWrapper>} />
            <Route path="/festivals" element={<SectionWrapper><Festivals /></SectionWrapper>} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/location" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/data-deletion" element={<DataDeletion />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              isAdminLoggedIn ? (
                <AdminDashboard onLogout={() => { localStorage.removeItem('adminToken'); setIsAdminLoggedIn(false); navigate('/'); }} />
              ) : (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <h2>Access Denied</h2>
                  <button className="hero-btn" onClick={() => setShowLoginPopup(true)}>Login to Admin</button>
                </div>
              )
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdmin && <NotificationPrompt />}
      {!isAdmin && <Footer onAdminClick={() => setShowLoginPopup(true)} />}
      
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <ChevronUp size={24} />
        </button>
      )}

      {showLoginPopup && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target.className === 'admin-modal-overlay') setShowLoginPopup(false); }}>
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button className="close-modal-btn" style={{ position: 'absolute', top: 20, right: 30, zIndex: 100, color: 'var(--admin-sidebar)' }} onClick={() => setShowLoginPopup(false)}>&times;</button>
            <Suspense fallback={<div>Loading...</div>}>
              <AdminLogin onLoginSuccess={() => {
                setIsAdminLoggedIn(true);
                setShowLoginPopup(false);
                navigate('/admin');
              }} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  )
}

export default App
