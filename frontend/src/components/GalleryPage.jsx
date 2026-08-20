import React, { useEffect } from 'react';
import './GalleryPage.css';
import { useLanguage } from '../context/LanguageContext';

import { Home } from 'lucide-react';

function GalleryPage({ onNavigate }) {
  const { t, language } = useLanguage();

  const images = [
    '/gallery/mujungavu-temple-entrance.png',
    '/gallery/mujungavu-temple-lord.png',
    '/gallery/mujungavu-temple-lake.jpg',
    '/gallery/mujungavu-temple-entrance-krishna.jpg',
    '/gallery/mujungavu-temple-festival-view.jpg',
    '/gallery/mujungavu-temple-ranga-pooje.jpg',
    '/gallery/mujungavu-temple-pallapooja.jpg',
    '/gallery/mujungavu-temple-kaveri-teertha.jpg',
    '/gallery/mujungavu-temple-old-bramhakalasha.jpg',
    '/gallery/mujungavu-temple-annual-festival-program.jpg',
    '/gallery/mujungavu-temple-avabruta.jpg',
    '/gallery/mujungavu-temple-festival-lighting.jpg',
    '/gallery/mujungavu-temple-tulabara.jpg'
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="gallery-page">
      <div className="container">
        <h1 className="section-title">{t('gallery', 'title')}</h1>
        <p className="gallery-subtitle">{t('gallery', 'subtitle')}</p>

        <div className="masonry-layout">
          {images.map((src, index) => (
            <div key={index} className="gallery-item">
              <img 
                src={src} 
                alt={`Temple Gallery ${index + 1}`} 
                className="gallery-img" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/logo.png";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GalleryPage;
