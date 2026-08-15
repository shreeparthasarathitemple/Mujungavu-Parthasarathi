import React, { useState } from 'react';
import './Gallery.css';
import { useLanguage } from '../context/LanguageContext';
import { Play, Pause } from 'lucide-react';

function Gallery({ onNavigate }) {
  const { t, language } = useLanguage();
  const [playingState, setPlayingState] = useState({});

  const previewImages = [
    '/gallery/gallery1.png',
    '/gallery/gallery2.png',
    '/gallery/gallery3.jpg',
    '/gallery/gallery4.jpg',
    '/gallery/gallery5.jpg',
    '/gallery/gallery6.jpg'
  ];

  const reelLinks = [
    'https://drive.google.com/file/d/1ercbp7ZGVNzZM1j0xzod5VUuF4VkPLyQ/preview', 
    'https://drive.google.com/file/d/1SsH_g1qgNW-La9BGeBclrW54Rnc5wKTI/preview', 
    'https://drive.google.com/file/d/1f_DLYXgIrokVccMS8sYvmUVAQdNy4uef/preview'
  ];

  return (
    <section className="section gallery-section" id="gallery" style={{ overflowX: 'hidden' }}>
      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('gallery', 'title')}</h2>
        <p className="gallery-subtitle animate-on-scroll text-center" style={{ transitionDelay: '0.1s' }}>
          {t('gallery', 'subtitle')}
        </p>
      </div>

      <div className="gallery-scroll-container animate-on-scroll">
          <div className="gallery-marquee-track">
            {previewImages.map((src, index) => (
              <div key={`set1-${index}`} className="gallery-item flex-item">
                <img 
                  src={src} 
                  alt={`Temple Gallery ${index + 1}`} 
                  className="gallery-img" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = `https://placehold.co/600x400/1f1105/d4af37?text=Image+${index + 1}`;
                  }}
                />
              </div>
            ))}
            
            <div className="gallery-item flex-item view-more-card" onClick={() => onNavigate('gallery_page')}>
              <div className="view-more-content">
                <div className="arrow-circle">
                  <span>&rarr;</span>
                </div>
                <h3>{language === 'en' ? 'View Full Gallery' : 'ಸಂಪೂರ್ಣ ಗ್ಯಾಲರಿಯನ್ನು ವೀಕ್ಷಿಸಿ'}</h3>
              </div>
            </div>

            {previewImages.map((src, index) => (
              <div key={`set2-${index}`} className="gallery-item flex-item">
                <img 
                  src={src} 
                  alt={`Temple Gallery ${index + 1}`} 
                  className="gallery-img" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = `https://placehold.co/600x400/1f1105/d4af37?text=Image+${index + 1}`;
                  }}
                />
              </div>
            ))}
            
            <div className="gallery-item flex-item view-more-card" onClick={() => onNavigate('gallery_page')}>
              <div className="view-more-content">
                <div className="arrow-circle">
                  <span>&rarr;</span>
                </div>
                <h3>{language === 'en' ? 'View Full Gallery' : 'ಸಂಪೂರ್ಣ ಗ್ಯಾಲರಿಯನ್ನು ವೀಕ್ಷಿಸಿ'}</h3>
              </div>
            </div>
          </div>
        </div>

      <div className="container">
        <div className="reels-grid" style={{ marginTop: '5rem' }}>
          {reelLinks.map((src, index) => (
            <div key={index} className="animate-on-scroll" style={{ transitionDelay: `${0.2 + (index * 0.1)}s`, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div className="reel-item" style={{ overflow: 'hidden', padding: 0 }}>
                {src ? (
                  <iframe 
                    src={src}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay"
                    title={`Reel ${index + 1}`}
                  ></iframe>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff' }}>
                    No Video Link
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
