import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AnnouncementPage.css';
import { Megaphone, Calendar, ArrowLeft, Heart, Share2 } from 'lucide-react';

const WhatsAppIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

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
      text: `${announcement.title}\n\nFor more details, click here:\n`,
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

  const handleWhatsAppShare = () => {
    if (!announcement) return;
    const text = `${announcement.title}\n\nFor more details, click here:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
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
          <button className="action-btn share-btn whatsapp-btn" onClick={handleWhatsAppShare} title="Share on WhatsApp" style={{ color: '#25D366' }}>
            <WhatsAppIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementPage;
