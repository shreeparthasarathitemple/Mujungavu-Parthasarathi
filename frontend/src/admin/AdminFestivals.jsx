import React, { useState, useEffect } from 'react';

function AdminFestivals() {
  const [festivals, setFestivals] = useState([]);
  const [formData, setFormData] = useState({ titleEn: '', titleKn: '', descEn: '', descKn: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/festivals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ ...formData, imageUrl: finalImageUrl })
      });
      if (res.ok) {
        setFormData({ titleEn: '', titleKn: '', descEn: '', descKn: '' });
        setImageFile(null);
        document.getElementById('festivalImage').value = '';
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
      <h3>Add New Festival</h3>
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
        <button type="submit" className="hero-btn admin-btn" style={{marginTop: '1rem'}} disabled={uploadingImage}>
          {uploadingImage ? 'Uploading...' : 'Add Festival'}
        </button>
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
            <button onClick={() => handleDelete(f._id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminFestivals;
