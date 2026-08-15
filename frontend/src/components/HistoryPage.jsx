import React from 'react';
import './HistoryPage.css';
import { useLanguage } from '../context/LanguageContext';

function HistoryPage({ onNavigate }) {
  const { t, language } = useLanguage();

  return (
    <section className="section history-page-section">
      <div className="container">
        <div className="text-center mb-4 animate-on-scroll">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            ← {language === 'en' ? 'Back to Home' : 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ'}
          </button>
        </div>
        
        <h1 className="history-title animate-on-scroll text-center">
          {t('about', 'fullHistoryTitle')}
        </h1>
        
        <div className="history-content-box animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
          <p className="text-lg leading-relaxed history-paragraph">
            {t('about', 'fullHistoryContent')}
          </p>
        </div>
      </div>
    </section>
  );
}

export default HistoryPage;
