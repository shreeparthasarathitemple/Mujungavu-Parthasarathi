import React, { useState, useEffect } from 'react';
import './Admin.css';
import { Megaphone, Trash2, Edit } from 'lucide-react';

function AdminAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/announcements/all', {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setAnnouncements(data);
      } else {
        setError(data.message || 'Failed to load announcements');
      }
    } catch (err) {
      setError('Server error while fetching announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content })
      });
      const data = await res.json();
      
      if (res.ok) {
        setAnnouncements([data, ...announcements]);
        setTitle('');
        setContent('');
      } else {
        setError(data.message || 'Failed to create announcement');
      }
    } catch (err) {
      setError('Server error during creation');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.ok) {
        setAnnouncements(announcements.filter(a => a._id !== id));
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      setError('Server error during deletion');
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      if (res.ok) {
        const updated = await res.json();
        setAnnouncements(announcements.map(a => a._id === id ? updated : a));
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-header-inline">
        <h3>Announcements</h3>
        <p>Post important updates that will appear on the home page.</p>
      </div>

      {error && <div className="admin-alert error">{error}</div>}

      <div className="admin-form-section glass-panel">
        <h4>Create New Announcement</h4>
        <form onSubmit={handleCreate} className="announcement-form">
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Special Pooja this Friday"
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Details about the announcement..."
              required
              rows={4}
            />
          </div>
          <button type="submit" className="hero-btn admin-btn">Post Announcement</button>
        </form>
      </div>

      <div className="announcements-list mt-5">
        <h4>Current Announcements</h4>
        {loading ? (
          <p>Loading...</p>
        ) : announcements.length > 0 ? (
          <div className="admin-list vertical">
            {announcements.map((item) => (
              <div key={item._id} className={`admin-list-item horizontal ${!item.isActive ? 'inactive' : ''}`}>
                <div className="announcement-icon-wrap">
                  <Megaphone size={24} />
                </div>
                <div className="admin-list-item-content">
                  <div className="announcement-header">
                    <strong>{item.title}</strong>
                    <span className="date-badge">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{item.content}</p>
                </div>
                <div className="announcement-actions">
                  <button 
                    onClick={() => toggleActive(item._id, item.isActive)} 
                    className={`status-toggle ${item.isActive ? 'active' : 'inactive'}`}
                  >
                    {item.isActive ? 'Active' : 'Hidden'}
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="icon-btn text-danger">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Megaphone size={48} />
            <p>No announcements yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAnnouncement;
