import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';
import { useLanguage } from '../context/LanguageContext';

function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="logo-wrapper-404">
          <div className="glowing-ring"></div>
          <img src="/logo.png" alt="Temple Logo" className="logo-404" />
        </div>
        
        <h1 className="error-code">404</h1>
        <h2 className="error-title">
          {language === 'en' ? 'Page Not Found' : 'ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ'}
        </h2>
        
        <p className="error-description">
          {language === 'en' 
            ? "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
            : "ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟವನ್ನು ತೆಗೆದುಹಾಕಿರಬಹುದು, ಅದರ ಹೆಸರನ್ನು ಬದಲಾಯಿಸಿರಬಹುದು ಅಥವಾ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲದಿರಬಹುದು."}
        </p>

        <div className="action-buttons">
          <button className="back-btn" onClick={() => window.history.back()}>
            <ArrowLeft size={18} />
            <span>{language === 'en' ? 'Go Back' : 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ'}</span>
          </button>
          <Link to="/" className="home-btn">
            <Home size={18} />
            <span>{language === 'en' ? 'Back to Home' : 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
