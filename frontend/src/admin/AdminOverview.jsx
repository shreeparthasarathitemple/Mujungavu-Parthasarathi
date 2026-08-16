import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Image as ImageIcon, ExternalLink, Users, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Admin.css';

function AdminOverview() {
  const [stats, setStats] = useState({
    announcements: 0,
    festivals: 0,
    gallery: 0,
    totalVisitors: 0,
    visitorsToday: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [annRes, festRes, galRes, analyticsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements/all`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/festivals`),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery`),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analytics/stats`, { credentials: 'include' })
        ]);

        const annData = await annRes.json();
        const festData = await festRes.json();
        const galData = await galRes.json();
        
        let analyticsData = { totalVisitors: 0, visitorsToday: 0, chartData: [] };
        if (analyticsRes.ok) {
          analyticsData = await analyticsRes.json();
        }

        setStats({
          announcements: annData.length || 0,
          festivals: festData.length || 0,
          gallery: galData.length || 0,
          totalVisitors: analyticsData.totalVisitors || 0,
          visitorsToday: analyticsData.visitorsToday || 0
        });
        setChartData(analyticsData.chartData || []);
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

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }}>
            <Users size={24} />
          </div>
          <div className="stat-details">
            <h4>Total Visitors</h4>
            <span className="stat-number">{loading ? '...' : stats.totalVisitors}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}>
            <Activity size={24} />
          </div>
          <div className="stat-details">
            <h4>Visits Today</h4>
            <span className="stat-number">{loading ? '...' : stats.visitorsToday}</span>
          </div>
        </div>
      </div>

      <div className="admin-form-section glass-panel" style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1.5rem', color: '#333' }}>Website Traffic (Last 7 Days)</h4>
        <div style={{ width: '100%', height: 300 }}>
          {loading ? (
            <p>Loading chart data...</p>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ color: '#888', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="visits" name="Visits" stroke="var(--gold)" strokeWidth={3} dot={{ r: 4, fill: "var(--gold)", strokeWidth: 0 }} activeDot={{ r: 6, fill: "var(--gold)", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No traffic data available yet.</p>
          )}
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
