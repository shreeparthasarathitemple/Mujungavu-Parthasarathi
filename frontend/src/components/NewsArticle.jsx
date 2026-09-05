import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import './AnnouncementPage.css'; // Reusing styling

function NewsArticle() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news/${id}`);
        if (!res.ok) throw new Error('News not found');
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  const getLocalizedContent = (field, fallback) => {
    if (!field) return fallback;
    if (typeof field === 'string') return field;
    return field[language] || field.en || fallback;
  };

  const handleShare = () => {
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const shareUrl = `${frontendUrl}/news/${id}`;
    
    if (navigator.share) {
      navigator.share({
        title: getLocalizedContent(news?.generatedTitle, news?.adminTitle),
        text: getLocalizedContent(news?.generatedBlurb, news?.adminDescription),
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <div className="text-center" style={{ paddingTop: '100px', minHeight: '60vh' }}>Loading...</div>;
  if (!news) return <div className="text-center" style={{ paddingTop: '100px', minHeight: '60vh' }}>News article not found.</div>;

  const title = getLocalizedContent(news.generatedTitle, news.adminTitle);
  const blurb = getLocalizedContent(news.generatedBlurb, news.adminDescription);
  const content = getLocalizedContent(news.generatedContent, `<p>${news.adminDescription}</p>`);

  return (
    <>
      <Helmet>
        <title>{title} | Sri Parthasarathi Temple</title>
        <meta name="description" content={blurb} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={blurb} />
        {news.imageUrl && <meta property="og:image" content={news.imageUrl} />}
        <meta property="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="announcement-page-wrapper">
        <div className="container" style={{ maxWidth: '800px', paddingTop: '100px', paddingBottom: '60px' }}>
          
          <Link to="/news" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--saffron)', marginBottom: '20px', textDecoration: 'none' }}>
            <ArrowLeft size={20} />
            {language === 'en' ? 'Back to News' : 'ಸುದ್ದಿಗಳಿಗೆ ಹಿಂತಿರುಗಿ'}
          </Link>

          <article className="announcement-detail-card">
            {news.imageUrl && (
              <div className="detail-image-wrapper">
                <img src={news.imageUrl} alt={title} className="detail-image" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
              </div>
            )}
            
            <div className="detail-content" style={{ padding: '2rem' }}>
              <div className="detail-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div className="detail-date" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666', fontSize: '0.95rem' }}>
                  <Calendar size={18} color="var(--saffron)" />
                  {new Date(news.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'kn-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                <button onClick={handleShare} className="share-btn" style={{ background: 'none', border: '1px solid #eee', padding: '8px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <Share2 size={16} /> Share
                </button>
              </div>

              <h1 className="detail-title" style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>
                {title}
              </h1>

              {news.generatedBlurb && (
                <div className="detail-blurb" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#555', borderLeft: '4px solid var(--saffron)', paddingLeft: '15px', marginBottom: '2rem' }}>
                  {blurb}
                </div>
              )}

              <div 
                className="detail-body html-content" 
                style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#333' }}
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

export default NewsArticle;
