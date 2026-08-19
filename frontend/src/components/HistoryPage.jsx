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
      </div>
    </section>
  );
}

export default HistoryPage;
