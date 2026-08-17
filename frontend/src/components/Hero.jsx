import React, { useState, useEffect } from 'react';
import './Hero.css';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown } from 'lucide-react';

function Hero({ onReady }) {
  const { t, language } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    if (videoLoaded && logoLoaded && onReady) {
      onReady();
    }
  }, [videoLoaded, logoLoaded, onReady]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const desktopVideo = "https://aingapwqyhtvjygwtiat.supabase.co/storage/v1/object/sign/videos/hero-lap.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZDI3ODZmMS1iNmU5LTRlZGYtOWIzNy0zOWJjM2Q0YmU4MDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvaGVyby1sYXAubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4Njg5Mjk0MCwiZXhwIjoyMTAyMjUyOTQwfQ.Tcw1fdflPVB-S7QPppbrymOuhhbEXKaIubBON8P01Og";
  const mobileVideo = "https://aingapwqyhtvjygwtiat.supabase.co/storage/v1/object/sign/videos/hero-mbl.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZDI3ODZmMS1iNmU5LTRlZGYtOWIzNy0zOWJjM2Q0YmU4MDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvaGVyby1tYmwubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4Njg5MzA3NywiZXhwIjoyMTAyMjUzMDc3fQ.WUgNtRcS9ynOMeMevXIkdmi3268s3YfVDV9YPhPuAug"; 

  return (
    <section className="hero" id="home">
      <video 
        className="hero-video-bg" 
        autoPlay 
        loop 
        muted 
        playsInline
        key={isMobile ? 'mobile' : 'desktop'}
        onLoadedData={() => setVideoLoaded(true)}
        onCanPlayThrough={() => setVideoLoaded(true)}
      >
        <source src={isMobile ? mobileVideo : desktopVideo} type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>
      <div className={`hero-content ${language === 'en' ? 'font-devanagari' : ''}`}>
        <img 
          src="/logo.png" 
          alt="Temple Logo" 
          className="hero-logo animate-on-scroll" 
          onLoad={() => setLogoLoaded(true)}
          onError={() => setLogoLoaded(true)}
        />
        <h1 className="hero-title reveal-text" style={{ animationDelay: '0.2s' }}>
          {t('hero', 'title')}
        </h1>
        <h2 className="hero-subtitle reveal-text" style={{ animationDelay: '0.6s' }}>
          {t('hero', 'subtitle')}
        </h2>
        <p className="hero-tagline reveal-text" style={{ animationDelay: '1.0s' }}>
          {t('hero', 'tagline')}
        </p>
        <a href="#about" className="scroll-indicator reveal-text" style={{ animationDelay: '1.4s' }}>
          <span className="scroll-text">{t('hero')}</span>
          <div className="scroll-chevron">
            <ChevronDown size={32} />
          </div>
        </a>
      </div>
    </section>
  );
}

export default Hero;
