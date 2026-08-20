import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, User } from 'lucide-react';
import './ContactPage.css';

function ContactPage() {
  const { t } = useLanguage();

  return (
    <section className="section contact-page-section">
      <div className="container">
        <div className="section-header text-center animate-on-scroll">
          <h2 className="section-title">{t('contact', 'title')}</h2>
          <div className="title-underline"></div>
        </div>

        <div className="contact-grid">
          {/* Contact Details Card */}
          <div className="contact-card animate-on-scroll">
            <h3 className="card-title">{t('contact', 'contactTitle')}</h3>
            
            <div className="contact-item">
              <Phone className="contact-icon" size={24} />
              <div>
                <p className="contact-label">Phone</p>
                <a href={`tel:${t('contact', 'phone')}`} className="contact-value link">{t('contact', 'phone')}</a>
              </div>
            </div>
            
            <div className="contact-item">
              <Mail className="contact-icon" size={24} />
              <div>
                <p className="contact-label">Email</p>
                <a href={`mailto:${t('contact', 'email')}`} className="contact-value link">{t('contact', 'email')}</a>
              </div>
            </div>

            <div className="contact-item">
              <MapPin className="contact-icon" size={24} />
              <div>
                <p className="contact-label">{t('contact', 'locationTitle')}</p>
                <p className="contact-value">{t('contact', 'address')}</p>
              </div>
            </div>
          </div>

          {/* Management Trustee Card */}
          <div className="contact-card animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <h3 className="card-title">{t('contact', 'managementTitle')}</h3>
            <div className="trustee-info">
              <User className="trustee-icon" size={48} />
              <h4 className="trustee-name">{t('contact', 'managementName')}</h4>
              <p className="trustee-desc">{t('contact', 'managementDesc')}</p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-container animate-on-scroll" style={{ transitionDelay: '0.3s' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15560.892408226462!2d74.9609!3d12.5936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba3636270b22a01%3A0xcf95b5c7774c1537!2sMujungavu%20Shri%20Parthasarathi%20Temple!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Temple Location Map"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
