import React, { useState, useEffect } from 'react';
import './Festivals.css';
import { useLanguage } from '../context/LanguageContext';
import { Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { festivalsToEvents } from '../seo/pages';

const Countdown = ({ targetDate }) => {
  const { t } = useLanguage();
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
        <span className="countdown-label">{t('festivals', 'days')}</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.hours}</span>
        <span className="countdown-label">{t('festivals', 'hours')}</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.minutes}</span>
        <span className="countdown-label">{t('festivals', 'mins')}</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.seconds}</span>
        <span className="countdown-label">{t('festivals', 'secs')}</span>
      </div>
    </div>
  );
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CACHE_KEY = 'festivals_cache';

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
  } catch {
    return [];
  }
};

// Upcoming festivals first (soonest at top), then undated, then past (most recent first)
const sortFestivals = (list) => {
  const now = Date.now();
  const rank = (f) => {
    if (!f.eventDate) return 1;
    return new Date(f.eventDate) >= now ? 0 : 2;
  };
  return [...list].sort((a, b) => {
    const r = rank(a) - rank(b);
    if (r !== 0) return r;
    if (!a.eventDate || !b.eventDate) return 0;
    const diff = new Date(a.eventDate) - new Date(b.eventDate);
    return rank(a) === 2 ? -diff : diff;
  });
};

function Festivals() {
  const { t, language } = useLanguage();
  const [festivals, setFestivals] = useState(readCache);
  const [status, setStatus] = useState('loading'); // loading | done | error

  const loadFestivals = () => {
    setStatus('loading');
    // Backend can take up to a minute to wake up, so allow a long timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 70000);
    fetch(`${API_URL}/api/festivals`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setFestivals(list);
        setStatus('done');
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        } catch {
          // ignore storage errors
        }
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      })
      .finally(() => clearTimeout(timeout));
  };

  useEffect(loadFestivals, []);

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
      {festivals.some(f => f.eventDate) && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': festivalsToEvents(festivals),
          })}</script>
        </Helmet>
      )}
      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('festivals', 'title')}</h2>
        
        <div className="festivals-grid">
          {sortFestivals(festivals).map((f, i) => {
            const isPast = f.eventDate && new Date(f.eventDate) < new Date();
            const title = language === 'en' ? f.titleEn : f.titleKn;
            return (
            <div key={f._id} className={`festival-card glass-card animate-on-scroll${isPast ? ' festival-past' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
              {isPast && <span className="festival-badge">{t('festivals', 'completed')}</span>}
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
              <h3 className="festival-name">{title}</h3>
              {f.eventDate && <Countdown targetDate={f.eventDate} />}
              <p>
                {language === 'en' ? f.descEn : f.descKn}
              </p>
            </div>
            );
          })}
          {festivals.length === 0 && (
            <div className="festival-card glass-card festival-status">
              {status === 'loading' && <p><span className="festival-spinner" /> {t('festivals', 'loading')}</p>}
              {status === 'done' && <p>{t('festivals', 'empty')}</p>}
              {status === 'error' && (
                <>
                  <p>{t('festivals', 'error')}</p>
                  <button type="button" className="festival-retry" onClick={loadFestivals}>
                    {t('festivals', 'retry')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Festivals;
