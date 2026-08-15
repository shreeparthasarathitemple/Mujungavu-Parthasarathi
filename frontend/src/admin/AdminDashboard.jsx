import React, { useState } from 'react';
import AdminFestivals from './AdminFestivals';
import './Admin.css';

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('festivals');

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>Temple Admin Dashboard</h2>
        <button onClick={onLogout} className="logout-btn">Log Out</button>
      </header>
      <div className="admin-body">
        <aside className="admin-sidebar">
          <ul>
            <li className={activeTab === 'festivals' ? 'active' : ''} onClick={() => setActiveTab('festivals')}>
              Manage Festivals
            </li>
            <li onClick={onLogout} style={{ color: '#ff4d4d', cursor: 'pointer', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              Log Out
            </li>
          </ul>
        </aside>
        <main className="admin-content">
          {activeTab === 'festivals' && <AdminFestivals />}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;