import React from 'react';
import './Hero.css';
import { useLanguage } from '../context/LanguageContext';
import TypewriterText from './TypewriterText';
import { ChevronDown } from 'lucide-react';

function Hero() {
  const { t, language } = useLanguage();

  return (
    <section className="hero" id="home">
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
