import React, { useState, useEffect } from 'react';
import AdminFestivals from './AdminFestivals';
import AdminGallery from './AdminGallery';
import AdminAnnouncement from './AdminAnnouncement';
import './Admin.css';
import { Calendar, Image as ImageIcon, Megaphone, LogOut } from 'lucide-react';

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('announcements');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/check`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (!data.isAuthenticated) {
          onLogout();
        }
      } catch (err) {
        onLogout();
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [onLogout]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error', err);
    }
    onLogout();
  };

  if (checkingAuth) {
    return <div className="admin-loading">Verifying session...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>Temple Admin Dashboard</h2>
        <div className="admin-user-info">
          <span>Logged in as Admin</span>
        </div>
      </header>
      <div className="admin-body">
        <aside className="admin-sidebar">
          <ul>
            <li className={activeTab === 'announcements' ? 'active' : ''} onClick={() => setActiveTab('announcements')}>
              <Megaphone size={20} className="sidebar-icon" />
              Announcements
            </li>
            <li className={activeTab === 'festivals' ? 'active' : ''} onClick={() => setActiveTab('festivals')}>
              <Calendar size={20} className="sidebar-icon" />
              Manage Festivals
            </li>
            {/*
            <li className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>
              <ImageIcon size={20} className="sidebar-icon" />
              Manage Gallery
            </li>
            */}
            <li onClick={handleLogout} className="logout-item">
              <LogOut size={20} className="sidebar-icon" />
              Log Out
            </li>
          </ul>
        </aside>
        <main className="admin-content">
          {activeTab === 'announcements' && <AdminAnnouncement />}
          {activeTab === 'festivals' && <AdminFestivals />}
          {/* {activeTab === 'gallery' && <AdminGallery />} */}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;