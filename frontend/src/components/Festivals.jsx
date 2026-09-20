import React, { useState, useEffect } from 'react';
import './Festivals.css';
import { useLanguage } from '../context/LanguageContext';
import { Calendar } from 'lucide-react';

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let time = {};

      if (difference > 0) {
        time = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return time;
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (Object.keys(timeLeft).length === 0) return null;

  return (
    <div className="festival-countdown">
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.hours}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.minutes}</span>
        <span className="countdown-label">Mins</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.seconds}</span>
        <span className="countdown-label">Secs</span>
      </div>
    </div>
  );
};

function Festivals() {
  const { t, language } = useLanguage();
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/festivals`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setFestivals(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (festivals.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      const elements = document.querySelectorAll('#festivals .animate-on-scroll');
      elements.forEach(el => observer.observe(el));

      return () => observer.disconnect();
    }
  }, [festivals]);

  return (
    <section className="section festivals-section" id="festivals">
      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('festivals', 'title')}</h2>
        
        <div className="festivals-grid">
          {festivals.map((f, i) => (
            <div key={f._id} className="festival-card glass-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
              {f.eventDate && (
                <div className="festival-date" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <Calendar size={18} />
                  {new Date(f.eventDate).toLocaleString(language === 'en' ? 'en-IN' : 'kn-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              )}
              <h3 className="festival-name">{language === 'en' ? f.titleEn : f.titleKn}</h3>
              {f.eventDate && <Countdown targetDate={f.eventDate} />}
              <p>
                {language === 'en' ? f.descEn : f.descKn}
              </p>
            </div>
          ))}
          {festivals.length === 0 && (
            <div className="festival-card glass-card">
              <p>No festivals added yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Festivals;
