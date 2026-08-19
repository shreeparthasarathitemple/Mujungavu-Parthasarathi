import React from 'react';
import './HistoryPage.css';
import { useLanguage } from '../context/LanguageContext';

import { Home } from 'lucide-react';

function HistoryPage({ onBack }) {
  const { t, language } = useLanguage();

  return (
    <section className="section history-page-section">
      <div className="container">
        <h1 className="history-title animate-on-scroll text-center">
          {t('about', 'fullHistoryTitle')}
        </h1>
        
        <div className="history-content-box animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
          {t('about', 'fullHistoryContent').split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="text-lg leading-relaxed history-paragraph" style={{ marginBottom: '1rem' }}>
                {paragraph}
              </p>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

export default HistoryPage;
