import React, { useEffect, useState } from 'react'
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
import { useLanguage } from './context/LanguageContext'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import { urlBase64ToUint8Array } from './utils/push'
import { Helmet } from 'react-helmet-async'

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
  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaysStar, setTodaysStar] = useState('');
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

    // Register Service Worker for Push Notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub) setPushSubscribed(true);
        });
      }).catch(err => console.error('Service Worker Registration Error:', err));
    }

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    // Live Clock & Nakshatra
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    try {
      import('panchang-ts').then(({ getDailyPanchang }) => {
        const result = getDailyPanchang(new Date(), { latitude: 12.5102, longitude: 74.9852 }, { timezone: 330 });
        if (result && result.angas && result.angas.nakshatras && result.angas.nakshatras.length > 0) {
          setTodaysStar(result.angas.nakshatras[0].name);
        }
      });
    } catch(e) {
      console.error("Panchang Error:", e);
    }
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleSubscribe = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push notifications are not supported by your browser.');
      return;
    }
    
    setSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Permission denied');
        setSubscribing(false);
        return;
      }
      
      const reg = await navigator.serviceWorker.ready;
      const pubKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!pubKey) throw new Error("VAPID public key not found");

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pubKey)
      });

      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      setPushSubscribed(true);
      alert('Successfully subscribed to notifications!');
    } catch (err) {
      console.error(err);
      alert('Failed to subscribe: ' + err.message);
    }
    setSubscribing(false);
  };

  // Analytics Tracking
  useEffect(() => {
    if (currentPage && currentPage !== 'admin') {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentPage })
      }).catch(err => console.error('Failed to track page view', err));
    }
  }, [currentPage]);

  // Preloading & Loading Screen Logic
  useEffect(() => {
    // If not starting on home page, hide loading screen immediately
    if (currentPage !== 'home') {
      setFadeOut(true);
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
    
    // Fallback: If Hero hasn't signaled ready within 8 seconds, force load
    const fallbackTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 800);
    }, 8000);

    return () => clearTimeout(fallbackTimer);
  }, [currentPage]);

  const handleHeroReady = () => {
    setFadeOut(true);
    setTimeout(() => setLoading(false), 800);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      setShowScrollTop(window.scrollY > window.innerHeight)

      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(winScroll / height);
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

  const getSEOMetadata = () => {
    const baseTitle = language === 'en' ? "Mujungavu Parthasarathi | Official Website" : "ಮುಜುಂಗಾವು ಪಾರ್ಥಸಾರಥಿ | ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್";
    let description = language === 'en' 
      ? "Official website of Mujungavu Parthasarathi."
      : "ಮುಜುಂಗಾವು ಪಾರ್ಥಸಾರಥಿಯ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್.";
    let title = baseTitle;
    
    if (currentPage === 'history') title = `${language === 'en' ? 'History' : 'ಇತಿಹಾಸ'} | ${baseTitle}`;
    if (currentPage === 'gallery_page') title = `${language === 'en' ? 'Gallery' : 'ಗ್ಯಾಲರಿ'} | ${baseTitle}`;
    if (currentPage === 'announcement_page' && activeAnnouncement) {
      title = `${activeAnnouncement.title} | ${baseTitle}`;
      if (activeAnnouncement.description) {
        // Create a short text description from HTML content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = activeAnnouncement.description;
        description = tempDiv.textContent || tempDiv.innerText || "";
        description = description.substring(0, 150) + '...';
      }
    }
    
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const imageUrl = `${origin}/logo.png`;

    const schemaOrgJSONLD = {
      "@context": "http://schema.org",
      "@type": "HinduTemple",
      "name": "Mujungavu Parthasarathi",
      "url": origin,
      "logo": imageUrl,
      "image": imageUrl,
      "description": "Official website of Mujungavu Parthasarathi.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mujungavu",
        "addressRegion": "Kerala",
        "addressCountry": "IN"
      }
    };

    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={currentUrl} />
        
        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={imageUrl} />

        {/* Schema.org for Google Rich Results */}
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSONLD)}
        </script>
      </Helmet>
    );
  };

  return (
    <>
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ transform: `scaleX(${scrollProgress})` }}></div>
        <img src="/diya.svg" className="scroll-progress-diya" style={{ left: `${scrollProgress * 100}%` }} alt="Diya" />
      </div>

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

      {(currentPage !== 'admin' && !showLoginPopup) && (
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
                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setIsMenuOpen(false); }} aria-label="Back to Home">
                  <Home size={20} />
                </a>
              )}
            </div>

            <div className="nav-actions">
              <div className="nav-time-star" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '15px', color: 'var(--gold)', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: '600' }}>{formatTime(currentTime)}</span>
              </div>

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
            {Array(10).fill(language === 'en' ? 'Om Namo Bhagavathe Vasudevaya' : 'ಓಂ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ').map((text, i) => (
              <span key={i} className={`marquee-text ${language === 'en' ? '' : 'font-kannada-attractive'}`}>{text}</span>
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
          <Hero onReady={handleHeroReady} />
          <About onNavigate={setCurrentPage} />
          <Lake />
          <Services />
          <Festivals />
          <Gallery onNavigate={setCurrentPage} />
          <Reviews />
        </main>
      )}

      {currentPage !== 'admin' && <Footer onAdminClick={() => setShowLoginPopup(true)} onSubscribe={handleSubscribe} pushSubscribed={pushSubscribed} subscribing={subscribing} />}

      
      
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
