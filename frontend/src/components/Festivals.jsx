import React, { useState, useEffect } from 'react';
import './Festivals.css';
import { useLanguage } from '../context/LanguageContext';

function Festivals() {
  const { t, language } = useLanguage();
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/festivals`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setFestivals(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (festivals.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      const elements = document.querySelectorAll('#festivals .animate-on-scroll');
      elements.forEach(el => observer.observe(el));

      return () => observer.disconnect();
    }
  }, [festivals]);

  return (
    <section className="section festivals-section" id="festivals">
      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('festivals', 'title')}</h2>
        
        <div className="festivals-grid">
          {festivals.map((f, i) => (
            <div key={f._id} className="festival-card glass-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
              <h3 className="festival-name">{language === 'en' ? f.titleEn : f.titleKn}</h3>
              <p>
                {language === 'en' ? f.descEn : f.descKn}
              </p>
            </div>
          ))}
          {festivals.length === 0 && (
            <div className="festival-card glass-card">
              <p>No festivals added yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Festivals;
