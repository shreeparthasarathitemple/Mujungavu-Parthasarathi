import React, { useEffect, useState } from 'react';
import './GalleryPage.css';
import { useLanguage } from '../context/LanguageContext';

function GalleryPage({ onNavigate }) {
  const { t } = useLanguage();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery`);
      const data = await res.json();
      if (res.ok) {
        setMedia(data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery media', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gallery-page">
      <div className="container">
        <h1 className="section-title">{t('gallery', 'title')}</h1>
        <p className="gallery-subtitle">{t('gallery', 'subtitle')}</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p>Loading gallery...</p>
          </div>
        ) : media.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p>Gallery is currently empty.</p>
          </div>
        ) : (
          <div className="masonry-layout">
            {media.map((item) => (
              <div key={item._id} className="gallery-item">
                {item.mediaType === 'video' ? (
                  <video 
                    src={item.imageUrl} 
                    controls 
                    className="gallery-img" 
                    style={{ background: '#000' }}
                    preload="metadata"
                  />
                ) : (
                  <img 
                    src={item.imageUrl} 
                    alt="Temple Gallery" 
                    className="gallery-img" 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "/logo.png";
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryPage;
