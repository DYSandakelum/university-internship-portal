import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function EmployerList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    
    const defaultCompanies = [
      {
        "_id": "1",
        "companyName": "Tech Solutions Lanka",
        "description": "Leading software development company in Sri Lanka specializing in enterprise applications.",
        "verificationStatus": "verified",
        "averageRating": 4.5,
        "totalReviews": 128,
        "industry": "Software Development",
        "location": "Colombo",
        "website": "https://techsolutions.lk",
        "founded": 2015,
        "employees": "50-100"
      },
      {
        "_id": "2",
        "companyName": "Eco Farms",
        "description": "Sustainable agriculture company focused on organic farming and export of fresh produce.",
        "verificationStatus": "verified",
        "averageRating": 4.2,
        "totalReviews": 56,
        "industry": "Agriculture",
        "location": "Kandy",
        "website": "https://ecofarms.lk",
        "founded": 2010,
        "employees": "100-200"
      },
      {
        "_id": "3",
        "companyName": "Rapid Travels",
        "description": "Premier travel agency offering customized tour packages and visa assistance.",
        "verificationStatus": "pending",
        "averageRating": 3.8,
        "totalReviews": 23,
        "industry": "Travel & Tourism",
        "location": "Colombo",
        "website": "https://rapidtravels.lk",
        "founded": 2018,
        "employees": "20-50"
      },
      {
        "_id": "4",
        "companyName": "CodeGen Innovations",
        "description": "AI and machine learning startup developing solutions for healthcare.",
        "verificationStatus": "verified",
        "averageRating": 4.8,
        "totalReviews": 92,
        "industry": "AI/ML",
        "location": "Negombo",
        "website": "https://codegen.lk",
        "founded": 2020,
        "employees": "10-20"
      }
    ];

    const allCompanies = [...defaultCompanies, ...savedCompanies];
    setCompanies(allCompanies);
    setLoading(false);
  };

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return <span style={{ color: '#f1c40f' }}>{'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}</span>;
  };

  const getStatusBadge = (status) => {
    if (status === 'verified') {
      return { background: '#d4edda', color: '#155724', text: 'Verified' };
    }
    return { background: '#fff3cd', color: '#856404', text: 'Pending' };
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading companies...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>Companies</h1>
          <p style={{ margin: '5px 0 0', color: '#666' }}>{companies.length} companies registered</p>
        </div>
        <Link to="/add-employer" style={{
          padding: '12px 24px',
          background: '#4CAF50',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          + Add Company
        </Link>
      </div>

      {/* Companies Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px'
      }}>
        {companies.map(company => {
          const status = getStatusBadge(company.verificationStatus);
          
          return (
            <div key={company._id} style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#333', fontSize: '1.2rem' }}>{company.companyName}</h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    background: status.background,
                    color: status.color
                  }}>
                    {status.text}
                  </span>
                </div>
                
                <p style={{ color: '#666', lineHeight: '1.5', fontSize: '0.9rem', marginBottom: '15px' }}>
                  {company.description.length > 100 ? company.description.substring(0, 100) + '...' : company.description}
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                  marginBottom: '15px',
                  fontSize: '0.85rem',
                  color: '#555'
                }}>
                  {company.industry && <div><strong>Industry:</strong><br />{company.industry}</div>}
                  {company.location && <div><strong>Location:</strong><br />{company.location}</div>}
                  {company.founded && <div><strong>Founded:</strong><br />{company.founded}</div>}
                  {company.employees && <div><strong>Employees:</strong><br />{company.employees}</div>}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 0',
                  borderTop: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0',
                  marginBottom: '15px'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>{getRatingStars(company.averageRating)}</span>
                  <span style={{ fontWeight: 'bold' }}>{company.averageRating}</span>
                  <span style={{ color: '#999', fontSize: '0.85rem' }}>({company.totalReviews} reviews)</span>
                </div>
                
                <Link to={`/employer/${company._id}`} style={{
                  display: 'block',
                  padding: '10px',
                  background: '#667eea',
                  color: 'white',
                  textDecoration: 'none',
                  textAlign: 'center',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  transition: 'background 0.3s'
                }}>
                  View Details →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {companies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <p>No companies found. Add your first company!</p>
          <Link to="/add-employer" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 30px', background: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>+ Add Company</Link>
        </div>
      )}
    </div>
  );
}

export default EmployerList;