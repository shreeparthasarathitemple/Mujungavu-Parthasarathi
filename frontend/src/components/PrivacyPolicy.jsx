import React, { useEffect } from 'react';
import './PrivacyPolicy.css';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function PrivacyPolicy() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="section privacy-page-section">
      <div className="container">
        <div className="privacy-header">
          <button 
            className="back-btn" 
            onClick={() => navigate(-1)} 
            title={language === 'en' ? 'Back' : 'ಹಿಂದೆ'}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="privacy-title">Privacy Policy</h1>
        </div>
        
        <div className="privacy-content-box animate-on-scroll">
          <div className="privacy-section">
            <h2>What data our app collects</h2>
            <p>
              We collect minimal data to ensure the best experience on our website. This includes basic analytics data (such as pages visited, time spent, and general location) and any contact information you voluntarily provide when reaching out to us (such as your name or email).
            </p>
          </div>

          <div className="privacy-section">
            <h2>Why it is collected</h2>
            <p>
              The data is collected primarily to understand how visitors interact with our website, which helps us improve the user experience, fix technical issues, and provide relevant information about temple timings, rituals, and festivals. Contact information is collected solely to respond to your inquiries.
            </p>
          </div>

          <div className="privacy-section">
            <h2>How we use it</h2>
            <p>
              We use the collected information for internal analytics, tracking website performance, and communicating with devotees who reach out to us. We do not sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </div>

          <div className="privacy-section">
            <h2>How data is protected and deleted</h2>
            <p>
              We implement reasonable security measures to protect your information from unauthorized access or disclosure. If you wish to have any of your personal data deleted from our records, you can submit a request using our contact details below. We will process your request promptly and ensure your data is permanently removed.
            </p>
          </div>

          <div className="privacy-section">
            <h2>How users can contact us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <address className="privacy-contact">
              <strong>Email:</strong> <a href="mailto:shreeparthasarathitemple@gmail.com">shreeparthasarathitemple@gmail.com</a>
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PrivacyPolicy;
