import React from 'react';
import './Festivals.css';
import { useLanguage } from '../context/LanguageContext';

function Festivals() {
  const { t } = useLanguage();

  return (
    <section className="section festivals-section" id="festivals">
      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('festivals', 'title')}</h2>
        
        <div className="festivals-grid">
          <div className="festival-card glass-card animate-on-scroll">
            <div className="festival-date">{t('festivals', 'vishuDate')}</div>
            <h3 className="festival-name">{t('festivals', 'vishuTitle')}</h3>
            <p>
              {t('festivals', 'vishuDesc')}
            </p>
          </div>
          
          <div className="festival-card glass-card animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="festival-date">{t('festivals', 'ashtamiDate')}</div>
            <h3 className="festival-name">{t('festivals', 'ashtamiTitle')}</h3>
            <p>
              {t('festivals', 'ashtamiDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Festivals;
