import React, { useState, useEffect } from 'react';
import { Globe, Save, Edit, Trash2 } from 'lucide-react';
import './Admin.css';

function AdminSEO() {
  const [seoList, setSeoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ pageRoute: '', title: '', description: '', keywords: '', imageUrl: '' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSEO();
  }, []);

  const fetchSEO = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/seo`);
      const data = await res.json();
      if (res.ok) setSeoList(data);
    } catch (err) {
      console.error('Failed to fetch SEO settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seo) => {
    setEditingId(seo._id);
    setFormData({
      pageRoute: seo.pageRoute,
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords || '',
      imageUrl: seo.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ pageRoute: '', title: '', description: '', keywords: '', imageUrl: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete these SEO settings?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/seo/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setSeoList(seoList.filter(s => s._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete SEO', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('SEO settings saved successfully!');
        if (editingId) {
          setSeoList(seoList.map(s => s._id === data._id ? data : s));
        } else {
          setSeoList([...seoList, data]);
        }
        handleCancelEdit();
      } else {
        setMessage(data.message || 'Failed to save');
      }
    } catch (err) {
      setMessage('Server error during save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-header-inline">
        <h3>SEO Settings</h3>
        <p>Manage dynamic meta tags for better search engine ranking.</p>
      </div>

      <div className="admin-form-section glass-panel" style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1.5rem', color: '#333' }}>{editingId ? 'Edit Page SEO' : 'Add New Page SEO'}</h4>
        {message && <div className={`admin-alert ${message.includes('Failed') || message.includes('error') ? 'error' : 'success'}`} style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', background: message.includes('Failed') ? '#ffecec' : '#e6ffed', color: message.includes('Failed') ? '#ff4d4f' : '#28a745' }}>{message}</div>}
        
        <form onSubmit={handleSubmit} className="announcement-form">
          <div className="overview-grid" style={{ gap: '1rem', marginBottom: '0' }}>
            <div className="form-group">
              <label>Page Route</label>
              <input 
                type="text" 
                value={formData.pageRoute}
                onChange={(e) => setFormData({...formData, pageRoute: e.target.value})}
                placeholder="e.g. / (for home), /about, /festivals"
                required
                disabled={!!editingId}
              />
            </div>
            <div className="form-group">
              <label>SEO Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Title that appears in search results"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Meta Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="A short, compelling description of the page..."
              required
              rows={3}
            />
          </div>
          <div className="overview-grid" style={{ gap: '1rem', marginBottom: '0' }}>
            <div className="form-group">
              <label>Keywords (Comma separated)</label>
              <input 
                type="text" 
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                placeholder="e.g. temple, pooja, mujungavu"
              />
            </div>
            <div className="form-group">
              <label>Open Graph Image URL (Optional)</label>
              <input 
                type="text" 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://..."
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="submit" className="hero-btn admin-btn" disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: 'auto', padding: '1rem 2rem' }}>
              {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="hero-btn admin-btn" style={{ background: '#666', width: 'auto', padding: '1rem 2rem' }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="seo-list glass-panel">
        <h4 style={{ marginBottom: '1.5rem', color: '#333' }}>Configured Pages</h4>
        {loading ? (
          <p>Loading...</p>
        ) : seoList.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', color: '#64748b' }}>
                  <th style={{ padding: '1rem' }}>Route</th>
                  <th style={{ padding: '1rem' }}>Title</th>
                  <th style={{ padding: '1rem' }}>Description</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {seoList.map((seo) => (
                  <tr key={seo._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--admin-primary)' }}>{seo.pageRoute}</td>
                    <td style={{ padding: '1rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seo.title}</td>
                    <td style={{ padding: '1rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b' }}>
                      {seo.description}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => handleEdit(seo)} className="icon-btn text-primary" style={{ display: 'inline-flex', marginRight: '0.5rem', color: '#4facfe' }} title="Edit">
                        <Edit size={20} />
                      </button>
                      <button onClick={() => handleDelete(seo._id)} className="icon-btn text-danger" style={{ display: 'inline-flex' }} title="Delete">
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
            <Globe size={48} />
            <p>No SEO settings configured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSEO;
