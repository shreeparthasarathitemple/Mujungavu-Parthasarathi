import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Eye, EyeOff, Key } from 'lucide-react';
import './Admin.css';

function AdminSettings() {
  const [geminiKey, setGeminiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showKey, setShowKey] = useState(false);

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
      <div className="admin-header-inline">
        <h3>General Settings</h3>
        <p>Configure API integrations and advanced features.</p>
      </div>

      <div className="premium-card" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--admin-primary)' }}>
            <Key size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--admin-sidebar)' }}>AI Integration</h4>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
              Securely store API keys for the AI News Generator.
            </p>
          </div>
        </div>

        {message && (
          <div className={`admin-alert ${message.includes('Error') ? 'error' : 'success'}`} style={{ marginBottom: '2rem', padding: '1rem', borderRadius: '12px', background: message.includes('Error') ? '#fef2f2' : '#f0fdf4', color: message.includes('Error') ? '#dc2626' : '#16a34a', display: 'flex', alignItems: 'center', gap: '10px', border: `1px solid ${message.includes('Error') ? '#fca5a5' : '#bbf7d0'}` }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 500 }}>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="premium-input-group">
            <label>Google Gemini API Key</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showKey ? "text" : "password"}
                placeholder="Enter your Gemini API key (e.g. AIzaSy...)"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="premium-input"
                style={{ paddingRight: '3rem' }}
              />
              <button 
                type="button" 
                onClick={() => setShowKey(!showKey)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                title={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <small style={{ color: '#94a3b8', display: 'block', marginTop: '8px', fontSize: '0.9rem' }}>
              This key is encrypted and stored safely. It allows the system to generate rich, traditional news articles instantly.
            </small>
          </div>

          <div style={{ marginTop: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="premium-btn primary" disabled={loading}>
              {loading ? 'Saving...' : <><Save size={20} /> Save Configuration</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminSettings;
