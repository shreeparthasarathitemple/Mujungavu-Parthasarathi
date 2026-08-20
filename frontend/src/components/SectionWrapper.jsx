import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SectionWrapper({ children, title }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '40px' }}>
      <div className="container">
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--saffron-dark)', 
            fontWeight: 600, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '2rem', 
            fontSize: '1rem' 
          }}
        >
          <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          Back to Home
        </button>
        {children}
      </div>
    </div>
  );
}

export default SectionWrapper;
