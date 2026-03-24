import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    fontSize: '1rem'
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '15px 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🏢 Company Reviews
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/employers" style={linkStyle}>Companies</Link>
          <Link to="/add-employer" style={linkStyle}>Add Company</Link>
          <Link to="/analytics" style={linkStyle}>Analytics</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;