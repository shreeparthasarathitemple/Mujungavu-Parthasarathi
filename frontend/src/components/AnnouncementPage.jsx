import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AnnouncementPage.css';
import { Megaphone, Calendar, ArrowLeft, Heart, Share2 } from 'lucide-react';

function AnnouncementPage({ announcement: propAnnouncement, onBack }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [fetchedAnnouncement, setFetchedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const announcement = propAnnouncement || fetchedAnnouncement;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (propAnnouncement) {
      setLoading(false);
      return;
    }
    if (id) {
      // Fetch all and find by short ID (last 6 chars) to support short URLs without backend changes
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch announcements');
          return res.json();
        })
        .then(data => {
          const found = data.find(a => a._id.endsWith(id));
          if (!found) throw new Error('Not found');
          setFetchedAnnouncement(found);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, propAnnouncement]);

  useEffect(() => {
    if (announcement) {
      const isLiked = localStorage.getItem(`liked_announcement_${announcement._id}`);
      setLiked(!!isLiked);
      setLikeCount(announcement.likes || 0);
    }
  }, [announcement]);

  const handleLike = () => {
    if (!announcement) return;
    const isLiking = !liked;
    
    // Optimistic UI update
    setLiked(isLiking);
    setLikeCount(prev => isLiking ? prev + 1 : Math.max(0, prev - 1));
    
    if (isLiking) {
      localStorage.setItem(`liked_announcement_${announcement._id}`, 'true');
    } else {
      localStorage.removeItem(`liked_announcement_${announcement._id}`);
    }

    // Call backend API
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements/${announcement._id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: isLiking ? 'like' : 'unlike' })
    }).catch(err => console.error('Failed to update like status', err));
  };

  const handleShare = async () => {
    if (!announcement) return;
    const shareData = {
      title: announcement.title,
      text: announcement.content.substring(0, 100) + '...',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <div style={{ padding: '130px 20px 40px', textAlign: 'center', minHeight: '100vh', color: 'var(--text-dark)' }} className="announcement-page-container">Loading...</div>;
  if (!announcement) return <div style={{ padding: '130px 20px 40px', textAlign: 'center', minHeight: '100vh', color: 'var(--text-dark)' }} className="announcement-page-container">Announcement not found.</div>;

  return (
    <div className="announcement-page-container">
      <div className="announcement-page-header glass-panel">
        <div className="announcement-title-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', width: '100%' }}>
            <button 
              onClick={() => navigate('/announcements')} 
              className="back-btn icon-only"
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(204, 85, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', margin: 0, flexShrink: 0 }}
              title="Back to Announcements"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 style={{ margin: 0, textAlign: 'left', flex: 1, fontSize: 'var(--title-size, 2.5rem)' }}>{announcement.title}</h1>
          </div>
          <div className="announcement-meta" style={{ marginTop: '1rem' }}>
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
        <div className="announcement-actions">
          <button className={`action-btn like-btn ${liked ? 'liked' : ''}`} onClick={handleLike} title={liked ? "Unlike" : "Like"}>
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
            {likeCount > 0 && <span style={{ fontWeight: '600' }}>{likeCount}</span>}
          </button>
          <button className="action-btn share-btn" onClick={handleShare} title="Share">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementPage;
