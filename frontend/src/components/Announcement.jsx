import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Announcement.css';

function Announcement({ onAnnouncementClick }) {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setAnnouncements(data);
          setHasUnread(true);
        }
      })
      .catch(err => console.error('Failed to fetch announcements', err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const handleItemClick = (ann) => {
    setIsOpen(false);
    if (onAnnouncementClick) {
      onAnnouncementClick(ann);
    } else {
      window.location.href = `/a/${ann._id.slice(-6)}`;
    }
  };

  // Always render the bell icon, even if empty
  return (
    <div className="announcement-dropdown-container" ref={dropdownRef}>
      <button className="announcement-bell-btn" onClick={handleToggle} aria-label="Announcements">
        <Bell size={20} />
        {hasUnread && <span className="announcement-badge"></span>}
      </button>

      {isOpen && (
        <div className="announcement-dropdown">
          <div className="announcement-header">
            <h4>{t('announcements', 'title')}</h4>
          </div>
          <div className="announcement-list">
            {announcements.length > 0 ? (
              announcements.slice(0, 5).map((ann, i) => (
                <div 
                  key={i} 
                  className="announcement-item" 
                  onClick={() => handleItemClick(ann)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{ann.title}</strong>
                  <p>{ann.content}</p>
                </div>
              ))
            ) : (
              <div className="announcement-item" style={{ textAlign: 'center', opacity: 0.7 }}>
                <p>No recent announcements</p>
              </div>
            )}
          </div>
          <div className="announcement-footer">
            <button 
              className="view-all-btn"
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/announcements';
              }}
            >
              {t('announcements', 'readMore')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcement;
