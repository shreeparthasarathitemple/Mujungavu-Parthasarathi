import React from 'react';
import './AnnouncementPage.css';
import { Megaphone, Calendar } from 'lucide-react';

function AnnouncementPage({ announcement, onBack }) {
  if (!announcement) return null;

  return (
    <div className="announcement-page-container">
      <div className="announcement-page-header glass-panel">
        <button onClick={onBack} className="back-btn">&larr; Back to Home</button>
        <div className="announcement-title-section">
          <div className="announcement-icon-badge">
            <Megaphone size={32} />
          </div>
          <h1>{announcement.title}</h1>
          <div className="announcement-meta">
            <Calendar size={16} />
            <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="announcement-page-content glass-panel">
        {announcement.imageUrl && (
          <div className="announcement-featured-image">
            <img src={announcement.imageUrl} alt={announcement.title} />
          </div>
        )}
        <div className="announcement-body">
          {announcement.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementPage;
