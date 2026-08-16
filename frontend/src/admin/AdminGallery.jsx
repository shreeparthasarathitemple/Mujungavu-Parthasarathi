import React, { useState, useEffect } from 'react';
import './Admin.css';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setImages(data);
      } else {
        setError(data.message || 'Failed to load images');
      }
    } catch (err) {
      setError('Server error while fetching images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      
      if (res.ok) {
        setImages([data, ...images]);
        setFile(null);
        setPreview(null);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Server error during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.ok) {
        setImages(images.filter(img => img._id !== id));
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      setError('Server error during deletion');
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-header-inline">
        <h3>Gallery Management</h3>
        <p>Upload and manage images for the public gallery.</p>
      </div>

      {error && <div className="admin-alert error">{error}</div>}

      <div className="admin-upload-section glass-panel">
        <h4>Upload New Photo</h4>
        <form onSubmit={handleUpload} className="upload-form">
          <div className="file-input-wrapper">
            <input 
              type="file" 
              id="gallery-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden-input"
            />
            <label htmlFor="gallery-upload" className="upload-placeholder">
              {preview ? (
                <img src={preview} alt="Preview" className="upload-preview" />
              ) : (
                <div className="upload-prompt">
                  <Upload size={40} className="upload-icon" />
                  <span>Click to select an image or drag & drop here</span>
                </div>
              )}
            </label>
          </div>
          
          <button 
            type="submit" 
            className="hero-btn admin-btn upload-btn" 
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      <div className="admin-gallery-grid mt-4">
        {loading ? (
          <p>Loading images...</p>
        ) : images.length > 0 ? (
          images.map((img) => (
            <div key={img._id} className="admin-gallery-card">
              <img src={img.imageUrl} alt="Gallery item" />
              <div className="gallery-card-overlay">
                <button 
                  onClick={() => handleDelete(img._id)} 
                  className="icon-btn delete-btn-circle"
                  title="Delete Image"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <ImageIcon size={48} />
            <p>No images found in the gallery.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGallery;
