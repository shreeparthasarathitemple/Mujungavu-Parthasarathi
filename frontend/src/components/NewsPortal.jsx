import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, ChevronRight } from 'lucide-react';
import './AnnouncementsGrid.css'; // Reusing similar styling for grids

function NewsPortal() {
  const { t, language } = useLanguage();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="announcements-page">
      <div className="container" style={{ paddingTop: '100px' }}>
        <h1 className="section-title text-center" style={{ marginBottom: '2rem' }}>
          {language === 'en' ? 'Temple News & Updates' : 'ದೇವಾಲಯದ ಸುದ್ದಿಗಳು ಮತ್ತು ನವೀಕರಣಗಳು'}
        </h1>

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
                      <img src={news.imageUrl} alt={news.generatedTitle || news.adminTitle} />
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
                    <h3 className="announcement-card-title">{news.generatedTitle || news.adminTitle}</h3>
                    <p className="announcement-card-desc" style={{ flexGrow: 1 }}>{news.generatedBlurb || news.adminDescription}</p>
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
