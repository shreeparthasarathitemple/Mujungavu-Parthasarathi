import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import './Admin.css';

function AdminSettings() {
  const [geminiKey, setGeminiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings/geminiApiKey`);
      const data = await res.json();
      if (data && data.value) {
        setGeminiKey(data.value);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ key: 'geminiApiKey', value: geminiKey }),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Error saving settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>General Settings</h3>
      </div>

      <div className="admin-card">
        <h4>AI Integration</h4>
        <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Configure API keys for AI features such as the News Portal's automated article generation.
        </p>

        {message && (
          <div className={`admin-alert ${message.includes('Error') ? 'error' : 'success'}`} style={{ marginBottom: '1rem', padding: '10px', borderRadius: '4px', background: message.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: message.includes('Error') ? '#ef4444' : '#22c55e', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            {message}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="admin-form-group">
            <label>Google Gemini API Key</label>
            <input 
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="admin-input"
            />
            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
              Used for generating news titles, blurbs, and articles automatically. Get an API key from Google AI Studio.
            </small>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
            {loading ? 'Saving...' : <><Save size={18} /> Save Settings</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSettings;
