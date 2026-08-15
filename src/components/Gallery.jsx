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

  const handlePlay = (e) => {
    const videos = document.querySelectorAll('.reel-video');
    videos.forEach((vid) => {
      if (vid !== e.target) {
        vid.pause();
      }
    });
  };

  const togglePlay = (e, index) => {
    const video = e.currentTarget.querySelector('video');
    if (video) {
      if (video.paused) {
        video.muted = false;
        video.play().catch(err => console.log("Playback failed:", err));
      } else {
        video.pause();
      }
    }
  };

  return (
    <section className="section gallery-section" id="gallery">
      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('gallery', 'title')}</h2>
        <p className="gallery-subtitle animate-on-scroll text-center" style={{ transitionDelay: '0.1s' }}>
          {t('gallery', 'subtitle')}
        </p>

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
                <h3>{language === 'en' ? 'View Full Gallery' : 'ಸಂಪೂರ್ಣ ಗ್ಯಾಲರಿ ವೀಕ್ಷಿಸಿ'}</h3>
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
                <h3>{language === 'en' ? 'View Full Gallery' : 'ಸಂಪೂರ್ಣ ಗ್ಯಾಲರಿ ವೀಕ್ಷಿಸಿ'}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="reels-grid" style={{ marginTop: '5rem' }}>
          {[1, 2, 3].map((num, index) => (
            <div key={index} className="animate-on-scroll" style={{ transitionDelay: `${0.2 + (index * 0.1)}s`, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div 
                className={`reel-item ${playingState[index] ? 'playing' : ''}`}
                onClick={(e) => togglePlay(e, index)}
              >
                <div className="reel-overlay">
                  <div className="play-pause-btn">
                    {playingState[index] ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
                  </div>
                </div>
                <video 
                  src={`/reel/reel1${num}.mp4`}
                  muted
                  loop
                  playsInline
                  className="reel-video"
                  onPlay={(e) => {
                    setPlayingState(prev => ({ ...prev, [index]: true }));
                    handlePlay(e);
                  }}
                  onPause={() => {
                    setPlayingState(prev => ({ ...prev, [index]: false }));
                  }}
                ></video>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
