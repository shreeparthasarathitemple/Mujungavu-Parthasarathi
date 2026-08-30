import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, Newspaper, CheckCircle, RefreshCcw, UploadCloud, X } from 'lucide-react';
import './Admin.css';

function AdminNews() {
  const [newsList, setNewsList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    _id: null,
    adminTitle: '',
    adminDescription: '',
    imageUrl: '',
    generatedTitle: { en: '', kn: '' },
    generatedBlurb: { en: '', kn: '' },
    generatedContent: { en: '', kn: '' },
    status: 'draft'
  });

  const [step, setStep] = useState(1); // 1: Input, 2: Preview & Edit

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news/all`, {
        credentials: 'include'
      });
      const data = await res.json();
      setNewsList(data);
    } catch (err) {
      console.error('Failed to load news:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      adminTitle: '',
      adminDescription: '',
      imageUrl: '',
      generatedTitle: { en: '', kn: '' },
      generatedBlurb: { en: '', kn: '' },
      generatedContent: { en: '', kn: '' },
      status: 'draft'
    });
    setImageFile(null);
    setImagePreview(null);
    setStep(1);
    setIsFormOpen(false);
  };

  const handleEdit = (newsItem) => {
    // Ensure backwards compatibility with old string data
    const prepareBilingual = (field) => {
      if (typeof field === 'string') return { en: field, kn: '' };
      return field || { en: '', kn: '' };
    };

    setFormData({
      ...newsItem,
      generatedTitle: prepareBilingual(newsItem.generatedTitle),
      generatedBlurb: prepareBilingual(newsItem.generatedBlurb),
      generatedContent: prepareBilingual(newsItem.generatedContent),
    });

    if (newsItem.imageUrl) {
      setImagePreview(newsItem.imageUrl);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
    setStep(2);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        fetchNews();
      } catch (err) {
        console.error('Failed to delete news:', err);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
    if (document.getElementById('newsImageUpload')) {
      document.getElementById('newsImageUpload').value = '';
    }
  };

  const generateNewsContent = async () => {
    if (!formData.adminTitle || !formData.adminDescription) {
      alert("Please enter a basic title and description.");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          adminTitle: formData.adminTitle,
          adminDescription: formData.adminDescription
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.message || 'Error generating content');
        return;
      }
      
      setFormData({
        ...formData,
        generatedTitle: data.title || { en: '', kn: '' },
        generatedBlurb: data.blurb || { en: '', kn: '' },
        generatedContent: data.content || { en: '', kn: '' }
      });
      setStep(2);
    } catch (err) {
      console.error('Generation error', err);
      alert('Failed to connect to the server for generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveNews = async (publishStatus = 'draft') => {
    setIsSaving(true);
    let finalImageUrl = formData.imageUrl;

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);

      try {
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
          method: 'POST',
          credentials: 'include',
          body: uploadData
        });
        const uploadResult = await uploadRes.json();
        if (uploadRes.ok) {
          finalImageUrl = uploadResult.imageUrl;
        } else {
          alert(uploadResult.message || 'Image upload failed');
          setIsSaving(false);
          return;
        }
      } catch (err) {
        console.error('Upload error', err);
        alert('Server error during image upload');
        setIsSaving(false);
        return;
      }
    }

    const dataToSave = { ...formData, imageUrl: finalImageUrl, status: publishStatus };
    
    try {
      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news`;
      let method = 'POST';
      
      if (formData._id) {
        url = `${url}/${formData._id}`;
        method = 'PUT';
      }
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSave)
      });
      
      if (res.ok) {
        fetchNews();
        resetForm();
      } else {
        alert('Failed to save news article.');
      }
    } catch (err) {
      console.error('Save error', err);
      alert('Error saving news article.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-header-inline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <div>
          <h3>News & Portal</h3>
          <p>Create and manage AI-generated bilingual temple news articles.</p>
        </div>
        {!isFormOpen && (
          <button className="premium-btn primary" onClick={() => setIsFormOpen(true)}>
            <Plus size={20} /> Create New Article
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="premium-card">
          <h4 style={{ margin: '0 0 2rem 0', fontSize: '1.4rem', color: 'var(--admin-sidebar)' }}>
            {formData._id ? 'Edit News Article' : 'Draft New Article'}
          </h4>
          
          <div className="premium-stepper">
            <div className={`premium-stepper-item ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: step === 1 ? 'var(--admin-primary)' : '#e2e8f0', color: step === 1 ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>1</span>
              Raw Details
            </div>
            <div className={`premium-stepper-item ${step === 2 ? 'active' : ''}`}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: step === 2 ? 'var(--admin-primary)' : '#e2e8f0', color: step === 2 ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>2</span>
              AI Generation & Review
            </div>
          </div>

          {step === 1 && (
            <div className="step-1-content" style={{ animation: 'fadeIn 0.3s ease' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                <div>
                  <div className="premium-input-group">
                    <label>Article Topic / Main Subject</label>
                    <input 
                      type="text" 
                      value={formData.adminTitle}
                      onChange={(e) => setFormData({...formData, adminTitle: e.target.value})}
                      className="premium-input" 
                      placeholder="e.g., Annual Chariot Festival Preparations"
                    />
                  </div>
                  
                  <div className="premium-input-group">
                    <label>Key Information & Facts</label>
                    <textarea 
                      value={formData.adminDescription}
                      onChange={(e) => setFormData({...formData, adminDescription: e.target.value})}
                      className="premium-input" 
                      rows="6"
                      placeholder="Provide facts or details for the AI to expand on. e.g., The festival starts next Monday. Over 5000 devotees expected. Special poojas at 5 PM."
                    ></textarea>
                  </div>
                </div>

                <div>
                  <div className="premium-input-group">
                    <label>Featured Image</label>
                    <input 
                      type="file" 
                      id="newsImageUpload"
                      className="hidden-input"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    
                    {!imagePreview ? (
                      <label htmlFor="newsImageUpload" className="upload-zone">
                        <UploadCloud size={40} className="upload-icon" />
                        <div className="upload-prompt">
                          <span>Click to upload image</span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PNG, JPG, WEBP (Max 5MB)</span>
                        </div>
                      </label>
                    ) : (
                      <div className="upload-zone has-file" style={{ padding: 0, position: 'relative', overflow: 'hidden', border: 'none', borderRadius: '16px' }}>
                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                        <button 
                          onClick={clearImage}
                          style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <button 
                  className="premium-btn primary" 
                  onClick={generateNewsContent}
                  disabled={isGenerating}
                >
                  {isGenerating ? <RefreshCcw className="fa-spin" size={20} /> : <Newspaper size={20} />}
                  {isGenerating ? 'AI is drafting article...' : 'Generate with AI'}
                </button>
                <button className="premium-btn secondary" onClick={resetForm}>Discard Draft</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-2-content" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} />
                <span style={{ fontWeight: 500 }}>AI Draft Generated successfully. Please review and edit both languages below before publishing.</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* English Column */}
                <div>
                  <h5 style={{ color: 'var(--admin-sidebar)', marginBottom: '1.5rem', fontSize: '1.1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>🇬🇧 English Version</h5>
                  <div className="premium-input-group">
                    <label>Headline</label>
                    <input 
                      type="text" 
                      value={formData.generatedTitle?.en || ''}
                      onChange={(e) => setFormData({...formData, generatedTitle: { ...formData.generatedTitle, en: e.target.value }})}
                      className="premium-input" 
                      style={{ fontWeight: 'bold' }}
                    />
                  </div>
                  <div className="premium-input-group">
                    <label>Summary Blurb</label>
                    <textarea 
                      value={formData.generatedBlurb?.en || ''}
                      onChange={(e) => setFormData({...formData, generatedBlurb: { ...formData.generatedBlurb, en: e.target.value }})}
                      className="premium-input" 
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="premium-input-group">
                    <label>Full Article Body (HTML)</label>
                    <textarea 
                      value={formData.generatedContent?.en || ''}
                      onChange={(e) => setFormData({...formData, generatedContent: { ...formData.generatedContent, en: e.target.value }})}
                      className="premium-input" 
                      rows="10"
                      style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                    ></textarea>
                  </div>
                </div>

                {/* Kannada Column */}
                <div>
                  <h5 style={{ color: 'var(--admin-sidebar)', marginBottom: '1.5rem', fontSize: '1.1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>🇮🇳 Kannada Version</h5>
                  <div className="premium-input-group">
                    <label>Headline</label>
                    <input 
                      type="text" 
                      value={formData.generatedTitle?.kn || ''}
                      onChange={(e) => setFormData({...formData, generatedTitle: { ...formData.generatedTitle, kn: e.target.value }})}
                      className="premium-input" 
                      style={{ fontWeight: 'bold' }}
                    />
                  </div>
                  <div className="premium-input-group">
                    <label>Summary Blurb</label>
                    <textarea 
                      value={formData.generatedBlurb?.kn || ''}
                      onChange={(e) => setFormData({...formData, generatedBlurb: { ...formData.generatedBlurb, kn: e.target.value }})}
                      className="premium-input" 
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="premium-input-group">
                    <label>Full Article Body (HTML)</label>
                    <textarea 
                      value={formData.generatedContent?.kn || ''}
                      onChange={(e) => setFormData({...formData, generatedContent: { ...formData.generatedContent, kn: e.target.value }})}
                      className="premium-input" 
                      rows="10"
                      style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button className="premium-btn secondary" onClick={resetForm}>Cancel</button>
                <button 
                  className="premium-btn" 
                  onClick={() => saveNews('draft')}
                  disabled={isSaving}
                  style={{ background: '#f1f5f9', color: '#475569', border: '2px solid #cbd5e1' }}
                >
                  <Save size={20} />
                  {isSaving ? 'Saving...' : 'Save as Draft'}
                </button>
                <button 
                  className="premium-btn primary" 
                  onClick={() => saveNews('published')}
                  disabled={isSaving}
                  style={{ background: '#10b981' }}
                >
                  <CheckCircle size={20} />
                  {isSaving ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Article Title</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Published Date</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsList.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No news articles created yet.</td></tr>
              ) : (
                newsList.map(news => {
                  const displayTitle = news.generatedTitle?.en || news.generatedTitle || news.adminTitle;
                  return (
                    <tr key={news._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1.2rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          {news.imageUrl ? (
                            <img src={news.imageUrl} alt="thumbnail" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                              <Newspaper size={20} />
                            </div>
                          )}
                          <strong style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                            {typeof displayTitle === 'string' ? displayTitle : displayTitle.en}
                          </strong>
                        </div>
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '0.85rem', 
                          fontWeight: 600,
                          background: news.status === 'published' ? '#dcfce7' : '#f1f5f9', 
                          color: news.status === 'published' ? '#166534' : '#475569' 
                        }}>
                          {news.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', color: '#64748b' }}>
                        {new Date(news.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button className="icon-btn" onClick={() => handleEdit(news)} style={{ color: '#3b82f6', background: '#eff6ff', padding: '8px', borderRadius: '8px' }}>
                            <Edit size={18} />
                          </button>
                          <button className="icon-btn" onClick={() => handleDelete(news._id)} style={{ color: '#ef4444', background: '#fef2f2', padding: '8px', borderRadius: '8px' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminNews;
