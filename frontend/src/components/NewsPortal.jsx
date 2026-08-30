import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, ChevronRight, ArrowLeft } from 'lucide-react';
import './AnnouncementPage.css'; // Reusing styling

function NewsPortal() {
  const { t, language } = useLanguage();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news`);
        const data = await res.json();
        setNewsList(data);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const getLocalizedContent = (field, fallback) => {
    if (!field) return fallback;
    if (typeof field === 'string') return field;
    return field[language] || field.en || fallback;
  };

  return (
    <div className="announcements-page">
      <div className="container" style={{ paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'nowrap' }}>
            <button 
              onClick={() => navigate('/')} 
              className="back-btn icon-only" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(204, 85, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', margin: 0, flexShrink: 0, cursor: 'pointer', border: 'none', color: 'var(--saffron-dark)' }}
              title="Back to Home"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="section-title text-center" style={{ margin: 0, paddingBottom: 0, fontSize: 'clamp(1.2rem, 5vw, 2.5rem)', color: 'var(--saffron-dark)', whiteSpace: 'nowrap' }}>
              {language === 'en' ? 'Temple News & Updates' : 'ದೇವಾಲಯದ ಸುದ್ದಿಗಳು ಮತ್ತು ನವೀಕರಣಗಳು'}
            </h1>
          </div>
          <div style={{ width: '60px', height: '3px', background: 'var(--gold)', margin: '1rem auto' }}></div>
        </div>

        {loading ? (
          <div className="text-center" style={{ padding: '3rem' }}>Loading...</div>
        ) : (
          <div className="announcements-grid">
            {newsList.length === 0 ? (
              <div className="no-announcements text-center" style={{ gridColumn: '1 / -1' }}>
                {language === 'en' ? 'No news available at the moment.' : 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ.'}
              </div>
            ) : (
              newsList.map((news) => (
                <div key={news._id} className="announcement-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="announcement-image-wrapper">
                    {news.imageUrl ? (
                      <img src={news.imageUrl} alt={getLocalizedContent(news.generatedTitle, news.adminTitle)} />
                    ) : (
                      <div className="placeholder-image">
                        <img src="/logo.png" alt="Logo" style={{ opacity: 0.2 }} />
                      </div>
                    )}
                  </div>
                  <div className="announcement-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="announcement-date" style={{ color: 'var(--saffron)' }}>
                      <Calendar size={14} />
                      {new Date(news.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'kn-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="announcement-card-title">{getLocalizedContent(news.generatedTitle, news.adminTitle)}</h3>
                    <p className="announcement-card-desc" style={{ flexGrow: 1 }}>{getLocalizedContent(news.generatedBlurb, news.adminDescription)}</p>
                    <Link to={`/news/${news._id}`} className="read-more-btn" style={{ marginTop: '15px' }}>
                      {language === 'en' ? 'Read Full Article' : 'ಪೂರ್ಣ ಲೇಖನವನ್ನು ಓದಿ'} <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsPortal;
