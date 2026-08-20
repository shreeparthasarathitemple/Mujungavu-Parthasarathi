import React, { useState } from 'react';
import './Gallery.css';
import { useLanguage } from '../context/LanguageContext';
import { Play, Pause } from 'lucide-react';

function Gallery({ onNavigate }) {
  const { t, language } = useLanguage();
  const [playingState, setPlayingState] = useState({});
  const [isInteracting, setIsInteracting] = useState(false);
  const videoRefs = React.useRef([]);
  const scrollContainerRef = React.useRef(null);

  React.useEffect(() => {
    let animationFrameId;
    
    const scroll = () => {
      if (!isInteracting && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollLeft += 1; // Speed of auto-scroll
        
        // Loop back to start smoothly when halfway through (since we duplicated items)
        // Adjust for potential pixel rounding
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInteracting]);

  const togglePlay = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      // Pause all other videos
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index && !v.paused) {
          v.pause();
          setPlayingState(prev => ({ ...prev, [i]: false }));
        }
      });
      video.play();
      setPlayingState(prev => ({ ...prev, [index]: true }));
    } else {
      video.pause();
      setPlayingState(prev => ({ ...prev, [index]: false }));
    }
  };

  const previewImages = [
    '/gallery/mujungavu-temple-entrance.png',
    '/gallery/mujungavu-temple-lord.png',
    '/gallery/mujungavu-temple-lake.jpg',
    '/gallery/mujungavu-temple-entrance-krishna.jpg',
    '/gallery/mujungavu-temple-festival-view.jpg',
    '/gallery/mujungavu-temple-pallapooja.jpg'
  ];

  const reelLinks = [
    'https://aingapwqyhtvjygwtiat.supabase.co/storage/v1/object/sign/videos/Mujungavu1.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZDI3ODZmMS1iNmU5LTRlZGYtOWIzNy0zOWJjM2Q0YmU4MDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvTXVqdW5nYXZ1MS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2ODYzNDM0LCJleHAiOjIxMDIyMjM0MzR9.qkOvfXxBieJlI63wz_Tzpe1QJ7JzYkWdNfB22uPabeA',
    'https://aingapwqyhtvjygwtiat.supabase.co/storage/v1/object/sign/videos/Mujungavu2.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZDI3ODZmMS1iNmU5LTRlZGYtOWIzNy0zOWJjM2Q0YmU4MDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvTXVqdW5nYXZ1Mi5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2ODYzNDYxLCJleHAiOjIxMDIyMjM0NjF9.KDTwGgWDK25Qo7k-3o3r9UpMkpN9We43wfyQeOrQABk',
    'https://aingapwqyhtvjygwtiat.supabase.co/storage/v1/object/sign/videos/Mujungavu3.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZDI3ODZmMS1iNmU5LTRlZGYtOWIzNy0zOWJjM2Q0YmU4MDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvTXVqdW5nYXZ1My5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2ODYzNDc5LCJleHAiOjIxMDIyMjM0Nzl9.RMTf8yMp43vMVkQacjrkGh0USAHHwxGY9VmynsL82fw'
  ];

  return (
    <section className="section gallery-section" id="gallery" style={{ overflowX: 'hidden' }}>
      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('gallery', 'title')}</h2>
        <p className="gallery-subtitle animate-on-scroll text-center" style={{ transitionDelay: '0.1s' }}>
          {t('gallery', 'subtitle')}
        </p>
      </div>

      <div 
        className="gallery-scroll-container animate-on-scroll" 
        ref={scrollContainerRef}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setIsInteracting(false)}
      >
          <div className="gallery-marquee-track">
            {previewImages.map((src, index) => (
              <div key={`set1-${index}`} className="gallery-item flex-item">
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
              <div 
                className="reel-item" 
                style={{ overflow: 'hidden', padding: 0, position: 'relative', cursor: 'pointer' }}
                onClick={() => togglePlay(index)}
              >
                {src ? (
                  <>
                    <video 
                      ref={el => videoRefs.current[index] = el}
                      src={src}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      playsInline
                      onEnded={() => setPlayingState(prev => ({ ...prev, [index]: false }))}
                      title={`Reel ${index + 1}`}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: '50%',
                      padding: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      pointerEvents: 'none',
                      opacity: playingState[index] ? 0 : 1,
                      transition: 'opacity 0.3s ease',
                      zIndex: 10
                    }}>
                      <Play size={40} fill="white" style={{ marginLeft: '4px' }} />
                    </div>
                  </>
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
