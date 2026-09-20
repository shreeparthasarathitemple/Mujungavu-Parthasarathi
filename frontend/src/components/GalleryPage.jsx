import React, { useEffect, useState } from 'react';
import './GalleryPage.css';
import { useLanguage } from '../context/LanguageContext';

function GalleryPage({ onNavigate }) {
  const { t } = useLanguage();

  const staticImages = [
    { _id: 'static3', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-lake.jpg' },
    { _id: 'static4', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-entrance-krishna.jpg' },
    { _id: 'static5', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-festival-view.jpg' },
    { _id: 'static6', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-ranga-pooje.jpg' },
    { _id: 'static7', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-pallapooja.jpg' },
    { _id: 'static8', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-kaveri-teertha.jpg' },
    { _id: 'static9', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-old-bramhakalasha.jpg' },
    { _id: 'static10', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-annual-festival-program.jpg' },
    { _id: 'static11', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-avabruta.jpg' },
    { _id: 'static12', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-festival-lighting.jpg' },
    { _id: 'static13', mediaType: 'image', imageUrl: '/gallery/mujungavu-temple-tulabara.jpg' }
  ];

  const [media, setMedia] = useState(staticImages);
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
        setMedia([...staticImages, ...data]);
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
                    src={item.imageUrl || item.url} 
                    controls 
                    className="gallery-img" 
                    style={{ background: '#000' }}
                    preload="metadata"
                  />
                ) : (
                  <img 
                    src={item.imageUrl || item.url} 
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
