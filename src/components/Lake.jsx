import React from 'react';
import './Lake.css';
import { useLanguage } from '../context/LanguageContext';

function Lake() {
  const { t } = useLanguage();

  return (
    <section className="lake-section" id="lake">
      <div className="lake-overlay"></div>
      <div className="container lake-content">
        <h2 className="section-title animate-on-scroll" style={{ color: 'var(--gold)' }}>{t('lake', 'title')}</h2>
        
        <div className="lake-info glass-card animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
          <p className="lake-description">
            {t('lake', 'p1')}
          </p>
          <p>
            {t('lake', 'p2_1')}<strong>{t('lake', 'p2_strong')}</strong>{t('lake', 'p2_2')}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Lake;
