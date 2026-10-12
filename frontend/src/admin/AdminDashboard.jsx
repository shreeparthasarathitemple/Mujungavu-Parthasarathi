import React, { useState, useEffect } from 'react';
import AdminFestivals from './AdminFestivals';
import AdminGallery from './AdminGallery';
import AdminAnnouncement from './AdminAnnouncement';
import AdminOverview from './AdminOverview';
import AdminSEO from './AdminSEO';
import AdminNews from './AdminNews';
import AdminSettings from './AdminSettings';
import { subscribeToasts } from './adminToast';
import './Admin.css';
import { Calendar, Megaphone, LogOut, LayoutDashboard, Menu, X, Globe, ExternalLink, Settings, Newspaper, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, component: AdminOverview },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, component: AdminAnnouncement },
  { id: 'festivals', label: 'Festivals', icon: Calendar, component: AdminFestivals },
  { id: 'news', label: 'News Portal', icon: Newspaper, component: AdminNews },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon, component: AdminGallery },
  { id: 'seo', label: 'SEO Settings', icon: Globe, component: AdminSEO },
  { id: 'settings', label: 'Settings', icon: Settings, component: AdminSettings },
];

const tabFromHash = () => {
  const id = window.location.hash.replace('#', '');
  return TABS.some(t => t.id === id) ? id : 'overview';
};

function AdminToaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => subscribeToasts((item) => {
    setToasts(prev => [...prev, item]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== item.id)), 3500);
  }), []);

  return (
    <div className="admin-toasts" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`admin-toast ${t.type}`}>
          {t.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  // Active tab lives in the URL hash (#festivals) so a refresh keeps you on the same page
  const [activeTab, setActiveTab] = useState(tabFromHash);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [serverWaking, setServerWaking] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // The free Render server sleeps when idle; tell the admin why the first load is slow
    const wakeTimer = setTimeout(() => setServerWaking(true), 3000);
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/check`, { credentials: 'include' });
        const data = await res.json();
        if (!data.isAuthenticated) onLogout();
      } catch {
        onLogout();
      } finally {
        clearTimeout(wakeTimer);
        setServerWaking(false);
        setCheckingAuth(false);
      }
    };
    checkAuth();
    return () => clearTimeout(wakeTimer);
  }, [onLogout]);

  useEffect(() => {
    const onHashChange = () => setActiveTab(tabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const tab = TABS.find(t => t.id === activeTab);
    document.title = `${tab.label} | Admin · Mujungavu Temple`;
  }, [activeTab]);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const selectTab = (id) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `#${id}`);
    setMobileMenuOpen(false);
    document.querySelector('.admin-content')?.scrollTo({ top: 0 });
  };

  const handleLogout = async () => {
    if (!window.confirm('Log out of the admin panel?')) return;
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout error', err);
    }
    onLogout();
  };

  if (checkingAuth) {
    return (
      <div className="admin-loading">
        <Loader2 size={32} className="admin-spin" />
        <p>{serverWaking ? 'Server is waking up — this can take up to a minute…' : 'Verifying session…'}</p>
      </div>
    );
  }

  const active = TABS.find(t => t.id === activeTab);
  const ActiveComponent = active.component;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-left">
          <button
            type="button"
            className="admin-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <img src="/logo.png" alt="" className="admin-header-logo" />
          <div className="admin-header-titles">
            <h2>{active.label}</h2>
            <span className="admin-header-sub">Mujungavu Temple Admin</span>
          </div>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-visit-btn" aria-label="Visit site">
          <ExternalLink size={16} />
          <span>Visit Site</span>
        </a>
      </header>
      <div className="admin-body">
        {mobileMenuOpen && <div className="admin-backdrop" onClick={() => setMobileMenuOpen(false)} />}
        <nav className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`} aria-label="Admin sections">
          <ul>
            {TABS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === id ? 'active' : ''}`}
                  onClick={() => selectTab(id)}
                  aria-current={activeTab === id ? 'page' : undefined}
                >
                  <Icon size={20} className="sidebar-icon" />
                  {label}
                </button>
              </li>
            ))}
            <li className="logout-item">
              <button type="button" className="admin-nav-btn" onClick={handleLogout}>
                <LogOut size={20} className="sidebar-icon" />
                Log Out
              </button>
            </li>
          </ul>
        </nav>
        <main className="admin-content">
          <ActiveComponent />
        </main>
      </div>
      <AdminToaster />
    </div>
  );
}

export default AdminDashboard;
