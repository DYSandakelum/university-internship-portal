import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEmployer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    founded: '',
    employees: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    
    const newCompany = {
      _id: Date.now().toString(),
      companyName: formData.companyName,
      description: formData.description,
      industry: formData.industry,
      location: formData.location,
      website: formData.website,
      founded: formData.founded,
      employees: formData.employees,
      verificationStatus: 'pending',
      averageRating: 0,
      totalReviews: 0,
      createdAt: new Date().toISOString()
    };

    existingCompanies.push(newCompany);
    localStorage.setItem('companies', JSON.stringify(existingCompanies));

    setTimeout(() => {
      setSubmitting(false);
      navigate('/employers');
    }, 500);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '50px auto', padding: '20px' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0 }}>🏢 Add New Company</h1>
          <p style={{ margin: '10px 0 0', opacity: 0.9 }}>Help build our community</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Company Name *
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
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'border-color 0.3s'
              }}
              placeholder="e.g., Tech Solutions Lanka"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              placeholder="Describe what the company does..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
                placeholder="e.g., Software, Agriculture"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
                placeholder="e.g., Colombo, Kandy"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
                placeholder="https://example.com"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Founded Year
              </label>
              <input
                type="number"
                name="founded"
                value={formData.founded}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
                placeholder="e.g., 2015"
              />
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Company Size
            </label>
            <select
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '1rem',
                background: 'white'
              }}
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1,
                padding: '14px',
                background: submitting ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s'
              }}
            >
              {submitting ? 'Adding Company...' : '+ Add Company'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/employers')}
              style={{
                padding: '14px 30px',
                background: '#e74a3b',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployer;