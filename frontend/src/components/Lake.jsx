import React, { useEffect, useRef, useState } from 'react';
import './Lake.css';
import { useLanguage } from '../context/LanguageContext';

function Lake() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [loadVideo, setLoadVideo] = useState(false);

  // Only download the background video when the lake section is about to scroll into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadVideo(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="lake-section" id="lake" ref={sectionRef}>
      <video 
        key={loadVideo ? 'video' : 'poster'}
        className="lake-video-bg" 
        autoPlay 
        loop 
        muted 
        playsInline
        preload="none"
        poster="/gallery/mujungavu-temple-lake.jpg"
      >
        {loadVideo && <source src="https://aingapwqyhtvjygwtiat.supabase.co/storage/v1/object/sign/videos/lake.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZDI3ODZmMS1iNmU5LTRlZGYtOWIzNy0zOWJjM2Q0YmU4MDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvbGFrZS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2ODk3OTQxLCJleHAiOjIxMDIyNTc5NDF9.ehXOZeRjB-aOnDuqctcP59ki5Pj0h5nHUlcbo4nOTKI" type="video/mp4" />}
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
