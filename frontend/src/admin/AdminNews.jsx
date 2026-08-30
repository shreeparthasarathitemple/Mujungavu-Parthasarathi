import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, Newspaper, CheckCircle, RefreshCcw } from 'lucide-react';
import './Admin.css';

function AdminNews() {
  const [newsList, setNewsList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: null,
    adminTitle: '',
    adminDescription: '',
    imageUrl: '',
    generatedTitle: '',
    generatedBlurb: '',
    generatedContent: '',
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
      generatedTitle: '',
      generatedBlurb: '',
      generatedContent: '',
      status: 'draft'
    });
    setStep(1);
    setIsFormOpen(false);
  };

  const handleEdit = (newsItem) => {
    setFormData(newsItem);
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
        generatedTitle: data.title || '',
        generatedBlurb: data.blurb || '',
        generatedContent: data.content || ''
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
    const dataToSave = { ...formData, status: publishStatus };
    
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
      <div className="admin-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>News Portal Management</h3>
        {!isFormOpen && (
          <button className="admin-add-btn" onClick={() => setIsFormOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Plus size={18} /> Add News Article
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="admin-card">
          <h4>{formData._id ? 'Edit News Article' : 'Create New Article'}</h4>
          
          <div className="news-stepper" style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ color: step === 1 ? 'var(--saffron)' : '#aaa', fontWeight: step === 1 ? 'bold' : 'normal', cursor: 'pointer' }} onClick={() => setStep(1)}>1. Basic Input</div>
            <div style={{ color: step === 2 ? 'var(--saffron)' : '#aaa', fontWeight: step === 2 ? 'bold' : 'normal' }}>2. AI Generation & Preview</div>
          </div>

          {step === 1 && (
            <div className="step-1-content">
              <div className="admin-form-group">
                <label>Topic / Basic Title</label>
                <input 
                  type="text" 
                  value={formData.adminTitle}
                  onChange={(e) => setFormData({...formData, adminTitle: e.target.value})}
                  className="admin-input" 
                  placeholder="e.g., Annual Chariot Festival Preparations"
                />
              </div>
              
              <div className="admin-form-group">
                <label>Key Information (Short Description)</label>
                <textarea 
                  value={formData.adminDescription}
                  onChange={(e) => setFormData({...formData, adminDescription: e.target.value})}
                  className="admin-input" 
                  rows="3"
                  placeholder="Provide facts or details for the AI to expand on. e.g., The festival starts next Monday. Over 5000 devotees expected. Special poojas at 5 PM."
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label>Image URL</label>
                <input 
                  type="text" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="admin-input" 
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  className="admin-submit-btn" 
                  onClick={generateNewsContent}
                  disabled={isGenerating}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {isGenerating ? <RefreshCcw className="fa-spin" size={18} /> : <Newspaper size={18} />}
                  {isGenerating ? 'Generating with AI...' : 'Generate AI Content'}
                </button>
                <button className="admin-cancel-btn" onClick={resetForm}>Cancel</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-2-content">
              <div className="admin-alert info" style={{ marginBottom: '15px', padding: '10px', background: '#eef2ff', color: '#4338ca', borderRadius: '4px' }}>
                Review and edit the AI-generated content before publishing.
              </div>

              <div className="admin-form-group">
                <label>Generated Title</label>
                <input 
                  type="text" 
                  value={formData.generatedTitle}
                  onChange={(e) => setFormData({...formData, generatedTitle: e.target.value})}
                  className="admin-input" 
                />
              </div>

              <div className="admin-form-group">
                <label>Generated Blurb (Short summary for listing)</label>
                <textarea 
                  value={formData.generatedBlurb}
                  onChange={(e) => setFormData({...formData, generatedBlurb: e.target.value})}
                  className="admin-input" 
                  rows="2"
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label>Full Content (HTML allowed)</label>
                <textarea 
                  value={formData.generatedContent}
                  onChange={(e) => setFormData({...formData, generatedContent: e.target.value})}
                  className="admin-input" 
                  rows="10"
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  className="admin-submit-btn" 
                  onClick={() => saveNews('published')}
                  disabled={isSaving}
                  style={{ background: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <CheckCircle size={18} />
                  {isSaving ? 'Saving...' : 'Publish Now'}
                </button>
                <button 
                  className="admin-submit-btn" 
                  onClick={() => saveNews('draft')}
                  disabled={isSaving}
                  style={{ background: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save as Draft'}
                </button>
                <button className="admin-cancel-btn" onClick={resetForm}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsList.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>No news articles found.</td></tr>
              ) : (
                newsList.map(news => (
                  <tr key={news._id}>
                    <td>
                      <strong>{news.generatedTitle || news.adminTitle}</strong>
                    </td>
                    <td>
                      <span className={`status-badge ${news.status}`} style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '0.8rem', background: news.status === 'published' ? '#dcfce7' : '#f1f5f9', color: news.status === 'published' ? '#166534' : '#475569' }}>
                        {news.status}
                      </span>
                    </td>
                    <td>{new Date(news.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="icon-btn edit" onClick={() => handleEdit(news)}><Edit size={16} /></button>
                        <button className="icon-btn delete" onClick={() => handleDelete(news._id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminNews;
