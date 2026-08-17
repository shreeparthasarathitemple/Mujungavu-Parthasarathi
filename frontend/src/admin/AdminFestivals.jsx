import React, { useState, useEffect } from 'react';

function AdminFestivals() {
  const [festivals, setFestivals] = useState([]);
  const [formData, setFormData] = useState({ titleEn: '', titleKn: '', descEn: '', descKn: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleEdit = (f) => {
    setEditingId(f._id);
    setFormData({ titleEn: f.titleEn, titleKn: f.titleKn, descEn: f.descEn, descKn: f.descKn });
    setImageFile(null);
    if (document.getElementById('festivalImage')) {
      document.getElementById('festivalImage').value = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ titleEn: '', titleKn: '', descEn: '', descKn: '' });
    setImageFile(null);
    if (document.getElementById('festivalImage')) {
      document.getElementById('festivalImage').value = '';
    }
  };

  const fetchFestivals = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/festivals`);
      const data = await res.json();
      setFestivals(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalImageUrl = '';
    
    if (imageFile) {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append('image', imageFile);

      try {
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
          method: 'POST',
          credentials: 'include',
          body: fd
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          finalImageUrl = uploadData.imageUrl;
        } else {
          console.error(uploadData.message || 'Image upload failed');
          setUploadingImage(false);
          return;
        }
      } catch (err) {
        console.error('Server error during image upload');
        setUploadingImage(false);
        return;
      }
    }

    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/festivals/${editingId}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/festivals`;
      const method = editingId ? 'PUT' : 'POST';
      
      const payload = { ...formData };
      if (finalImageUrl) payload.imageUrl = finalImageUrl;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        handleCancelEdit();
        fetchFestivals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this festival?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/festivals/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      fetchFestivals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>{editingId ? 'Edit Festival' : 'Add New Festival'}</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Title (English)</label>
          <input type="text" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Title (Kannada)</label>
          <input type="text" value={formData.titleKn} onChange={e => setFormData({...formData, titleKn: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Description (English)</label>
          <textarea value={formData.descEn} onChange={e => setFormData({...formData, descEn: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Description (Kannada)</label>
          <textarea value={formData.descKn} onChange={e => setFormData({...formData, descKn: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Image Upload</label>
          <input 
            type="file" 
            id="festivalImage"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])} 
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="hero-btn admin-btn" disabled={uploadingImage}>
            {uploadingImage ? 'Saving...' : editingId ? 'Update Festival' : 'Add Festival'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="hero-btn admin-btn" style={{ background: '#666' }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h3 style={{marginTop: '3rem'}}>Current Festivals</h3>
      <ul className="admin-list">
        {festivals.map(f => (
          <li key={f._id} className="admin-list-item">
            {f.imageUrl && <img src={f.imageUrl} className="admin-list-item-img" alt="Festival" />}
            <div className="admin-list-item-content">
              <strong>{f.titleEn} / {f.titleKn}</strong>
              <p>{f.descEn.substring(0, 80)}...</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={() => handleEdit(f)} className="hero-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Edit</button>
              <button onClick={() => handleDelete(f._id)} className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminFestivals;
