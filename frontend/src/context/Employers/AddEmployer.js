import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEmployer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get existing companies from localStorage
    const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    
    // Create new company
    const newCompany = {
      _id: Date.now().toString(),
      companyName: formData.companyName,
      description: formData.description,
      verificationStatus: 'pending',
      averageRating: 0,
      totalReviews: 0
    };
    
    // Save to localStorage
    localStorage.setItem('companies', JSON.stringify([...existingCompanies, newCompany]));
    
    alert('Company added successfully!');
    navigate('/employers');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        Add New Company
      </h2>
      
      <form onSubmit={handleSubmit} style={{
        background: '#f9f9f9',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{
            padding: '12px 30px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Add Company
          </button>
          
          <button type="button" onClick={() => navigate('/')} style={{
            padding: '12px 30px',
            background: '#e74a3b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployer;