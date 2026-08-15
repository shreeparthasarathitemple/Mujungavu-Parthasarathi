import React from 'react';
import './Services.css';
import { Flower2, Baby, Users, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Services() {
  const { t } = useLanguage();

  const rituals = [
    {
      title: t('services', 'namakarana'),
      desc: t('services', 'namakaranaDesc'),
      icon: <Baby size={32} />
    },
    {
      title: t('services', 'annaprasana'),
      desc: t('services', 'annaprasanaDesc'),
      icon: <Flower2 size={32} />
    },
    {
      title: t('services', 'vivaha'),
      desc: t('services', 'vivahaDesc'),
      icon: <Heart size={32} />
    },
    {
      title: t('services', 'tula'),
      desc: t('services', 'tulaDesc'),
      icon: <Users size={32} />
    }
  ];

  return (
    <section className="section services-section" id="services">
      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('services', 'title')}</h2>
        <p className="services-intro animate-on-scroll text-center">
          {t('services', 'intro')}
        </p>
        
        <div className="services-grid">
          {rituals.map((ritual, index) => (
            <div 
              className="service-card animate-on-scroll" 
              key={index}
              style={{ transitionDelay: `${0.1 * index}s` }}
            >
              <div className="service-icon-wrapper">
                {ritual.icon}
              </div>
              <h3>{ritual.title}</h3>
              <p>{ritual.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
