import React, { useState, useEffect } from 'react';

function AdminLake() {
  const [lakeBg, setLakeBg] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings/lake_bg`)
      .then(res => res.json())
      .then(data => {
        if (data && data.value) setLakeBg(data.value);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalUrl = lakeBg;
    if (finalUrl.includes('drive.google.com/file/d/')) {
      const match = finalUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        finalUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ key: 'lake_bg', value: finalUrl })
      });
      if (res.ok) {
        alert('Lake background updated successfully!');
        setLakeBg(finalUrl);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating background');
    }
  };

  return (
    <div>
      <h3>Lake Section Settings</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Background Image URL (Google Drive link works too!)</label>
          <input type="text" value={lakeBg} onChange={e => setLakeBg(e.target.value)} placeholder="Paste URL here..." />
        </div>
        <button type="submit" className="hero-btn" style={{marginTop: '1rem'}}>Save Settings</button>
      </form>
      
      {lakeBg && (
        <div style={{marginTop: '2rem'}}>
          <h4>Current Background Preview:</h4>
          <img src={lakeBg} alt="Lake Background" style={{width: '100%', maxWidth: '600px', borderRadius: '10px', marginTop: '1rem'}} />
        </div>
      )}
    </div>
  );
}

export default AdminLake;
