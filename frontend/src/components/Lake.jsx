import React from 'react';
import './Lake.css';
import { useLanguage } from '../context/LanguageContext';

function Lake() {
  const { t } = useLanguage();

  return (
    <section className="lake-section" id="lake">
      <video 
        className="lake-video-bg" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="https://aingapwqyhtvjygwtiat.supabase.co/storage/v1/object/sign/videos/lake.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZDI3ODZmMS1iNmU5LTRlZGYtOWIzNy0zOWJjM2Q0YmU4MDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvbGFrZS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2ODk3OTQxLCJleHAiOjIxMDIyNTc5NDF9.ehXOZeRjB-aOnDuqctcP59ki5Pj0h5nHUlcbo4nOTKI" type="video/mp4" />
      </video>
      <div className="lake-overlay"></div>
      <div className="container lake-content">
        <h2 className="section-title animate-on-scroll" style={{ color: 'var(--gold)' }}>{t('lake', 'title')}</h2>
        
        <div className="lake-info animate-on-scroll" style={{ transitionDelay: '0.2s', padding: '2rem 1rem' }}>
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
