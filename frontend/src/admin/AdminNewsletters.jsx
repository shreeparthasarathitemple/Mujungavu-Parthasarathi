import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Send } from 'lucide-react';
import './Admin.css';

function AdminNewsletters() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/newsletters/subscribers`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) setSubscribers(data);
    } catch (err) {
      console.error('Failed to fetch subscribers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/newsletters/subscribers/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setSubscribers(subscribers.filter(s => s._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete subscriber', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !content) return;
    
    setSending(true);
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/newsletters/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subject, htmlContent: content })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setSubject('');
        setContent('');
      } else {
        setMessage(data.message || 'Failed to send');
      }
    } catch (err) {
      setMessage('Server error during send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-header-inline">
        <h3>Newsletters</h3>
        <p>Manage subscribers and send updates to your devotees.</p>
      </div>

      <div className="overview-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Mail size={24} />
          </div>
          <div className="stat-details">
            <h4>Total Subscribers</h4>
            <span className="stat-number">{loading ? '...' : subscribers.length}</span>
          </div>
        </div>
      </div>

      <div className="admin-form-section glass-panel" style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1.5rem', color: '#333' }}>Compose Newsletter</h4>
        {message && <div className={`admin-alert ${message.includes('Failed') || message.includes('error') ? 'error' : 'success'}`} style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', background: message.includes('Failed') ? '#ffecec' : '#e6ffed', color: message.includes('Failed') ? '#ff4d4f' : '#28a745' }}>{message}</div>}
        
        <form onSubmit={handleSend} className="announcement-form">
          <div className="form-group">
            <label>Subject Line</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Upcoming Festival Updates"
              required
            />
          </div>
          <div className="form-group">
            <label>Message Content (HTML Supported)</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your newsletter here..."
              required
              rows={8}
            />
          </div>
          <button type="submit" className="hero-btn admin-btn" disabled={sending || subscribers.length === 0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {sending ? 'Sending...' : <>Send Newsletter <Send size={18} /></>}
          </button>
        </form>
      </div>

      <div className="subscribers-list glass-panel">
        <h4 style={{ marginBottom: '1.5rem', color: '#333' }}>Subscriber List</h4>
        {loading ? (
          <p>Loading...</p>
        ) : subscribers.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', color: '#64748b' }}>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Subscribed On</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{sub.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`status-toggle ${sub.isActive ? 'active' : 'inactive'}`}>
                        {sub.isActive ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => handleDelete(sub._id)} className="icon-btn text-danger" title="Delete">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Mail size={48} />
            <p>No subscribers yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNewsletters;
