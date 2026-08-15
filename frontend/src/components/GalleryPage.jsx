import React, { useEffect } from 'react';
import './GalleryPage.css';
import { useLanguage } from '../context/LanguageContext';

function GalleryPage() {
  const { t, language } = useLanguage();

  const images = [
    '/gallery/gallery1.png',
    '/gallery/gallery2.png',
    '/gallery/gallery3.jpg',
    '/gallery/gallery4.jpg',
    '/gallery/gallery5.jpg',
    '/gallery/gallery6.jpg',
    '/gallery/gallery7.jpg',
    '/gallery/gallery8.jpg',
    '/gallery/gallery9.jpg',
    '/gallery/gallery10.jpg',
    '/gallery/gallery11.jpg',
    '/gallery/gallery12.jpg',
    '/gallery/gallery13.jpg'
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
                  e.target.src = `https://placehold.co/600x${400 + (index % 3) * 100}/1f1105/d4af37?text=Image+${index + 1}`;
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
