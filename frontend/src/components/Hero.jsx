import React, { useState, useEffect } from 'react';
import './Hero.css';
import { useLanguage } from '../context/LanguageContext';
import TypewriterText from './TypewriterText';
import { ChevronDown } from 'lucide-react';

function Hero() {
  const { t, language } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

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
      >
        <source src={isMobile ? mobileVideo : desktopVideo} type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>
      <div className={`hero-content ${language === 'en' ? 'font-devanagari' : ''}`}>
        <img src="/logo.png" alt="Temple Logo" className="hero-logo animate-on-scroll" />
        <h1 className="hero-title animate-on-scroll">
          <TypewriterText text={t('hero', 'title')} speed={80} />
        </h1>
        <h2 className="hero-subtitle animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
          <TypewriterText text={t('hero', 'subtitle')} speed={80} delay={2200} />
        </h2>
        <p className="hero-tagline animate-on-scroll" style={{ transitionDelay: '0.4s' }}>
          <TypewriterText text={t('hero', 'tagline')} speed={60} delay={3200} />
        </p>
        <a href="#about" className="scroll-indicator animate-on-scroll" style={{ transitionDelay: '0.6s' }}>
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
