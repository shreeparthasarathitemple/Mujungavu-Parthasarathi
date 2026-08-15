import React, { useState } from 'react';
import './Admin.css';

function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        onLoginSuccess();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server error. Is backend running?');
    }
  };

  return (
    <div className="admin-login-container admin-modal-container">
      <form onSubmit={handleLogin} className="admin-login-form">
        <h2>Admin Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="hero-btn admin-btn" style={{marginTop: '1rem'}}>Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
