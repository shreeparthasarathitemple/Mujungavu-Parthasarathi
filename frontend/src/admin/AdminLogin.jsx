import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-react';
import './Admin.css';

function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container admin-modal-container">
      <div className="login-wrapper">
        <div className="login-visual">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <img src="/logo.png" alt="Temple Logo" className="login-logo" />
            <h2>Sri Parthasarathi Temple</h2>
            <p>Admin Portal</p>
          </div>
        </div>
        
        <div className="login-form-container">
          <form onSubmit={handleLogin} className="admin-login-form-premium">
            <div className="login-header">
              <h3>Welcome Back</h3>
              <p>Sign in to manage the temple portal</p>
            </div>
            
            {error && <div className="login-error-alert">{error}</div>}
            
            <div className="login-input-group">
              <label>Username</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Enter admin username"
                  required 
                />
              </div>
            </div>
            
            <div className="login-input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <span className="loading-spinner-small"></span>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
            
            <div className="login-footer">
              <p>Protected area. Authorized personnel only.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
