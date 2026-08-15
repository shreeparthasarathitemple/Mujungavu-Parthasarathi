import React from 'react';
import './Footer.css';
import { useLanguage } from '../context/LanguageContext';

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

function Footer() {
  const { t } = useLanguage();

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
            <li><a href="#about">{t('nav', 'history')}</a></li>
            <li><a href="#lake">{t('nav', 'lake')}</a></li>
            <li><a href="#services">{t('nav', 'rituals')}</a></li>
            <li><a href="#festivals">{t('festivals', 'title')}</a></li>
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
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {t('footer', 'copyright')}</p>
      </div>
    </footer>
  );
}

export default Footer;
