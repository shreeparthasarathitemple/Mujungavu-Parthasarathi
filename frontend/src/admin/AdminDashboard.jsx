import React, { useState, useEffect } from 'react';
import AdminFestivals from './AdminFestivals';
import AdminGallery from './AdminGallery';
import AdminAnnouncement from './AdminAnnouncement';
import AdminOverview from './AdminOverview';
import './Admin.css';
import { Calendar, Image as ImageIcon, Megaphone, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="admin-header-left">
          <button className="admin-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2>Admin Dashboard</h2>
        </div>
        <div className="admin-user-info">
          <span>Logged in as Admin</span>
        </div>
      </header>
      <div className="admin-body">
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <ul>
            <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}>
              <LayoutDashboard size={20} className="sidebar-icon" />
              Overview
            </li>
            <li className={activeTab === 'announcements' ? 'active' : ''} onClick={() => { setActiveTab('announcements'); setMobileMenuOpen(false); }}>
              <Megaphone size={20} className="sidebar-icon" />
              Announcements
            </li>
            <li className={activeTab === 'festivals' ? 'active' : ''} onClick={() => { setActiveTab('festivals'); setMobileMenuOpen(false); }}>
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
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'announcements' && <AdminAnnouncement />}
          {activeTab === 'festivals' && <AdminFestivals />}
          {/* {activeTab === 'gallery' && <AdminGallery />} */}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;