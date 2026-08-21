import React, { useEffect } from 'react';
import './PrivacyPolicy.css'; // Reusing the same styles
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function DataDeletion() {
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
          <h1 className="privacy-title">Data Deletion Instructions</h1>
        </div>
        
        <div className="privacy-content-box animate-on-scroll">
          <div className="privacy-section">
            <h2>Requesting Data Deletion</h2>
            <p>
              We respect your privacy and provide you with the ability to request the deletion of any personal data we may have collected from you while you use our app or website.
            </p>
          </div>

          <div className="privacy-section">
            <h2>How to Submit a Request</h2>
            <p>
              To request that your data be deleted, please send us an email with the following details:
            </p>
            <ul style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: '1.8', marginLeft: '2rem', marginBottom: '1rem' }}>
              <li><strong>Subject:</strong> Data Deletion Request</li>
              <li><strong>Body:</strong> Please include your name and any relevant details that will help us identify your information in our systems.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>Contact Email</h2>
            <p>
              Please send your data deletion request to:
            </p>
            <address className="privacy-contact">
              <strong>Email:</strong> <a href="mailto:shreeparthasarathitemple@gmail.com">shreeparthasarathitemple@gmail.com</a>
            </address>
          </div>
          
          <div className="privacy-section">
            <h2>Processing Your Request</h2>
            <p>
              Once we receive your request, we will process it promptly and ensure all your personal data is permanently removed from our active databases. We will notify you via email once the deletion is complete.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DataDeletion;
