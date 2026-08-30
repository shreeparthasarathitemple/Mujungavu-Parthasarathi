import React, { useState, useEffect } from 'react';
import './Admin.css';
import { Megaphone, Trash2, Edit } from 'lucide-react';

function AdminAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements/all`, {
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

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setContent(item.content);
    if (document.getElementById('announcementImage')) {
      document.getElementById('announcementImage').value = '';
    }
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setImageFile(null);
    if (document.getElementById('announcementImage')) {
      document.getElementById('announcementImage').value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    let finalImageUrl = undefined;

    if (imageFile) {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          finalImageUrl = uploadData.imageUrl;
        } else {
          setError(uploadData.message || 'Image upload failed');
          setUploadingImage(false);
          return;
        }
      } catch (err) {
        setError('Server error during image upload');
        setUploadingImage(false);
        return;
      }
    }

    const payload = { title, content };
    if (finalImageUrl !== undefined) {
      payload.imageUrl = finalImageUrl;
    }

    try {
      setUploadingImage(true);
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements/${editingId}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        if (editingId) {
          setAnnouncements(announcements.map(a => a._id === editingId ? data : a));
        } else {
          setAnnouncements([data, ...announcements]);
        }
        handleCancelEdit();
      } else {
        setError(data.message || 'Failed to save announcement');
      }
    } catch (err) {
      setError('Server error during save');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements/${id}`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements/${id}`, {
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
        <h4>{editingId ? 'Edit Announcement' : 'Create New Announcement'}</h4>
        <form onSubmit={handleSubmit} className="announcement-form">
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
            <label>Image Upload (Optional)</label>
            <input
              type="file"
              id="announcementImage"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
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
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="submit" className="hero-btn admin-btn" disabled={uploadingImage}>
              {uploadingImage ? 'Saving...' : editingId ? 'Update Announcement' : 'Post Announcement'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="hero-btn admin-btn" style={{ background: '#666' }}>
                Cancel Edit
              </button>
            )}
          </div>
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
                  <button onClick={() => handleEdit(item)} className="icon-btn text-primary" title="Edit">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="icon-btn text-danger" title="Delete">
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
//test
export default AdminAnnouncement;
