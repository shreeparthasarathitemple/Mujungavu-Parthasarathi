import React from 'react';
import './HistoryPage.css';
import { useLanguage } from '../context/LanguageContext';

import { ArrowLeft } from 'lucide-react';

function HistoryPage({ onBack }) {
  const { t, language } = useLanguage();

  return (
    <section className="section history-page-section">
      <div className="container">
        <h1 className="history-title animate-on-scroll text-center" style={{ marginTop: 0 }}>
          {t('about', 'fullHistoryTitle')}
        </h1>
        
        <div className="history-content-box animate-on-scroll" style={{ transitionDelay: '0.2s', position: 'relative' }}>
          <button 
            className="back-btn" 
            onClick={onBack} 
            title={language === 'en' ? 'Back to Home' : 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ'}
            style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', margin: 0, padding: '0.5rem' }}
          >
            <ArrowLeft size={24} />
          </button>
          
          <div style={{ paddingTop: '2.5rem' }}>
          {t('about', 'fullHistoryContent').split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="text-lg leading-relaxed history-paragraph" style={{ marginBottom: '1.5rem' }}>
                {paragraph}
              </p>
            )
          ))}
          </div>
        </div>

        <div className="history-videos-section animate-on-scroll" style={{ marginTop: '4rem' }}>
          <h3 className="videos-title">{t('about', 'videosTitle')}</h3>
          <div className="videos-grid">
            <div className="video-wrapper">
              <video 
                src="https://pkwijatqpaejzcoimemn.supabase.co/storage/v1/object/sign/History%20Video%20Temple/history1.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kN2ZkMzIyZS1iODAzLTQxMzQtYjRhNC1mNTJiZGEwZmZiZDkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJIaXN0b3J5IFZpZGVvIFRlbXBsZS9oaXN0b3J5MS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg3MjQ2NjA4LCJleHAiOjIxMDI2MDY2MDh9.PTdD2jwhy2uxEeQlEtBp-dlUtxEQmsUJo3_t6HzCXwk" 
                controls 
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                preload="metadata" 
                playsInline 
                onPlay={(e) => {
                  document.querySelectorAll('video').forEach(v => {
                    if (v !== e.target) v.pause();
                  });
                }}
              />
            </div>
            <div className="video-wrapper">
              <video 
                src="https://pkwijatqpaejzcoimemn.supabase.co/storage/v1/object/sign/History%20Video%20Temple/history2.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kN2ZkMzIyZS1iODAzLTQxMzQtYjRhNC1mNTJiZGEwZmZiZDkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJIaXN0b3J5IFZpZGVvIFRlbXBsZS9oaXN0b3J5Mi5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg3MjQ2NjIyLCJleHAiOjIxMDI2MDY2MjJ9.p8JvkOpVTYEh2lq03FgnnuZhEqEYMMjZkebSyHew-48" 
                controls 
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                preload="metadata" 
                playsInline 
                onPlay={(e) => {
                  document.querySelectorAll('video').forEach(v => {
                    if (v !== e.target) v.pause();
                  });
                }}
              />
            </div>
            <div className="video-wrapper">
              <video 
                src="https://pkwijatqpaejzcoimemn.supabase.co/storage/v1/object/sign/History%20Video%20Temple/history3.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kN2ZkMzIyZS1iODAzLTQxMzQtYjRhNC1mNTJiZGEwZmZiZDkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJIaXN0b3J5IFZpZGVvIFRlbXBsZS9oaXN0b3J5My5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg3MjQ2NjU5LCJleHAiOjIxMDI2MDY2NTl9.rVSbAG2sAVb65Wn-DElL4kI40_XY6dFp0AqRwA8cHjY" 
                controls 
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                preload="metadata" 
                playsInline 
                onPlay={(e) => {
                  document.querySelectorAll('video').forEach(v => {
                    if (v !== e.target) v.pause();
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HistoryPage;
