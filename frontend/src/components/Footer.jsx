import React, { useState } from 'react';
import './Footer.css';
import { useLanguage } from '../context/LanguageContext';
import { Bell, X, Video, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const MapPinIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const InstagramIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);


const LockIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

function Footer({ onAdminClick }) {
  const { t } = useLanguage();
  const [showCredits, setShowCredits] = useState(false);

  return (
    <footer className="footer" id="contact">
      <div className="container footer-content">
        <div className="footer-brand">
          <h3>{t('nav', 'brand')}</h3>
          <p>{t('footer', 'brandSubtitle')}</p>
          <div className="social-links">
            <a 
              href="https://share.google/taQFmTFhUgqruyo9X"
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Location"
              className="social-icon"
            >
              <MapPinIcon />
            </a>
            <a 
              href="https://www.instagram.com/mujungavu.parthasarathi.temple/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-icon"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>{t('footer', 'linksTitle')}</h4>
          <ul>
            <li><Link to="/#about">{t('nav', 'history')}</Link></li>
            <li><Link to="/#lake">{t('nav', 'lake')}</Link></li>
            <li><Link to="/#services">{t('nav', 'rituals')}</Link></li>
            <li><Link to="/#festivals">{t('festivals', 'title')}</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h4>{t('footer', 'visitTitle')}</h4>
          <address style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontStyle: 'normal' }}>
            <a href="mailto:shreeparthasarathitemple@gmail.com" style={{ color: 'var(--bg-light)', textDecoration: 'none' }}>
              shreeparthasarathitemple@gmail.com
            </a>
            <a href="tel:9495545642" style={{ color: 'var(--bg-light)', textDecoration: 'none' }}>
              +91 9495545642
            </a>
          </address>
        </div>
      </div>
      
      <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <button 
          onClick={onAdminClick}
          title="Admin Login"
          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0', transition: 'color 0.3s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold, #FFA500)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </button>
        <p style={{ cursor: 'pointer' }} onClick={() => setShowCredits(true)}>&copy; {new Date().getFullYear()} {t('footer', 'copyright')}</p>

        {showCredits && (
          <div className="credits-modal-overlay" onClick={() => setShowCredits(false)}>
            <div className="credits-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="credits-modal-close" onClick={() => setShowCredits(false)}>
                <X size={20} />
              </button>
              <h4>Credits</h4>
              <div className="credits-list">
                <p>
                  <Video size={20} color="white" />
                  Video Credit <a href="https://www.instagram.com/kiran_skyscapes/" target="_blank" rel="noopener noreferrer">kiran_skyscapes</a>
                </p>
                <p>
                  <Video size={20} color="white" />
                  History Video <a href="https://www.instagram.com/i_anwesh_kumble/" target="_blank" rel="noopener noreferrer">Anwesh Kumble</a>
                </p>
                <p>
                  <Code size={20} color="white" />
                  Developed By <a href="https://harikiranap.vercel.app/" target="_blank" rel="noopener noreferrer">Harikiran</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;

