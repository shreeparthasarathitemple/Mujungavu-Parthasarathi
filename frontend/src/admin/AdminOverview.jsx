import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Image as ImageIcon, ExternalLink, Users } from 'lucide-react';
import './Admin.css';

function AdminOverview() {
  const [stats, setStats] = useState({
    announcements: 0,
    festivals: 0,
    gallery: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [annRes, festRes, galRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements/all`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/festivals`),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery`)
        ]);

        const annData = await annRes.json();
        const festData = await festRes.json();
        const galData = await galRes.json();

        setStats({
          announcements: annData.length || 0,
          festivals: festData.length || 0,
          gallery: galData.length || 0
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-tab-content">
      <div className="admin-header-inline">
        <h3>Overview</h3>
        <p>Live snapshot of your temple website.</p>
      </div>

      <div className="overview-grid">
        <div className="stat-card">
          <div className="stat-icon announcements">
            <Megaphone size={24} />
          </div>
          <div className="stat-details">
            <h4>Announcements</h4>
            <span className="stat-number">{loading ? '...' : stats.announcements}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon festivals">
            <Calendar size={24} />
          </div>
          <div className="stat-details">
            <h4>Festivals</h4>
            <span className="stat-number">{loading ? '...' : stats.festivals}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon gallery">
            <ImageIcon size={24} />
          </div>
          <div className="stat-details">
            <h4>Gallery Images</h4>
            <span className="stat-number">{loading ? '...' : stats.gallery}</span>
          </div>
        </div>
      </div>

      <div className="live-view-section glass-panel">
        <div className="live-view-content">
          <h4>View Live Website</h4>
          <p>See how your website looks to visitors right now.</p>
          <a href="/" target="_blank" rel="noopener noreferrer" className="hero-btn admin-btn">
            Open Website <ExternalLink size={18} style={{ marginLeft: '8px' }} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
