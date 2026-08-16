import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import './Announcement.css';

function Announcement({ onAnnouncementClick }) {
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
    }
  };

  if (announcements.length === 0) return null;

  return (
    <div className="announcement-dropdown-container" ref={dropdownRef}>
      <button className="announcement-bell-btn" onClick={handleToggle} aria-label="Announcements">
        <Bell size={20} />
        {hasUnread && <span className="announcement-badge"></span>}
      </button>

      {isOpen && (
        <div className="announcement-dropdown">
          <div className="announcement-header">
            <h4>Announcements</h4>
          </div>
          <div className="announcement-list">
            {announcements.map((ann, i) => (
              <div 
                key={i} 
                className="announcement-item" 
                onClick={() => handleItemClick(ann)}
                style={{ cursor: 'pointer' }}
              >
                <strong>{ann.title}</strong>
                <p>{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcement;
