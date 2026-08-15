import React from 'react';
import "./About.css";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function About({ onNavigate }) {
  const { t } = useLanguage();

  return (
    <section className="section about-section" id="about">
      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('about', 'title')}</h2>

        <div className="about-grid">
          <div className="about-text">
            <p className="animate-on-scroll">
              {t('about', 'p1')}
            </p>
            <p className="animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
              {t('about', 'p2')}
            </p>
            <p className="animate-on-scroll" style={{ transitionDelay: '0.3s' }}>
              {t('about', 'p3')}
            </p>

            <div className="animate-on-scroll" style={{ transitionDelay: '0.4s', marginTop: '1.5rem' }}>
              <button className="text-link-btn" onClick={() => onNavigate('history')}>
                {t('about', 'knowMore')} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
            </div>

            <div className="info-cards">
              <a href="https://share.google/taQFmTFhUgqruyo9X" target="_blank" rel="noopener noreferrer" className="info-card map-link-card animate-on-scroll" style={{ transitionDelay: '0.5s' }}>
                <MapPin className="info-icon" />
                <div className="info-content">
                  <h3>{t('about', 'locationTitle')}</h3>
                  <p>{t('about', 'locationDesc')}</p>
                </div>
              </a>

              <div className="info-card animate-on-scroll" style={{ transitionDelay: '0.6s' }}>
                <Clock className="info-icon" />
                <div className="info-content">
                  <h3>{t('about', 'timingTitle')}</h3>
                  <div className="timing-list">
                    <p>{t('about', 'timingMorning')}</p>
                    <p>{t('about', 'timingNoon')}</p>
                    <p>{t('about', 'timingNight')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="about-image-wrapper animate-on-scroll"
            style={{ transitionDelay: "0.2s" }}
          >
            <div className="about-image-placeholder">
              {/* This could be a picture of the deity or the temple interior */}
              <img
                src="/lord.png"
                alt="Lord Parthasarathi"
                className="about-img"
              />
              <div className="image-border"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
