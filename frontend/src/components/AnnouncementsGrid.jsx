import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import './AnnouncementPage.css'; // We can reuse existing styles or add new ones

function AnnouncementsGrid() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements`)
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch announcements', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="announcement-page-container" style={{ minHeight: '100vh', padding: '130px 20px 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'nowrap' }}>
          <button 
            onClick={() => navigate('/')} 
            className="back-btn icon-only" 
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(204, 85, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', margin: 0, flexShrink: 0 }}
            title="Back to Home"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ margin: 0, paddingBottom: 0, fontSize: 'clamp(1.2rem, 5vw, 2rem)', color: 'var(--saffron-dark)', whiteSpace: 'nowrap' }}>{t('announcements', 'title')}</h2>
        </div>
        <div style={{ width: '60px', height: '3px', background: 'var(--gold)', margin: '0 auto 1rem' }}></div>
        <p className="gallery-subtitle" style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '2rem' }}>{t('announcements', 'subtitle')}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-light)' }}>Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-light)' }}>No announcements available at the moment.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {announcements.map((ann) => (
            <div 
              key={ann._id} 
              className="glass-panel"
              style={{ 
                cursor: 'pointer', 
                transition: 'transform 0.3s', 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
              }}
              onClick={() => navigate(`/a/${ann._id.slice(-6)}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {ann.imageUrl && (
                <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                  <img 
                    src={ann.imageUrl} 
                    alt={ann.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--saffron)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
                  <Calendar size={14} style={{ marginRight: '6px' }} />
                  {new Date(ann.createdAt).toLocaleDateString()}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-light)' }}>{ann.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ann.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 600 }}>
                  {t('announcements', 'readMore')} <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnnouncementsGrid;
