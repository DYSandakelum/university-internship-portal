import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function EmployerList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    // Default companies
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

    // Get from localStorage
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    
    // Combine default + saved
    const allCompanies = [...defaultCompanies, ...savedCompanies];
    setCompanies(allCompanies);
    setLoading(false);
  };

  // Get rating stars
  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <span style={{ color: '#f1c40f' }}>
        {'★'.repeat(fullStars)}
        {halfStar ? '½' : ''}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const styles = {
      verified: { background: '#d4edda', color: '#155724', text: 'Verified' },
      pending: { background: '#fff3cd', color: '#856404', text: 'Pending' },
      rejected: { background: '#f8d7da', color: '#721c24', text: 'Rejected' }
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
        <p>Loading companies...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', color: '#333' }}>Companies</h1>
          <p style={{ margin: 0, color: '#666' }}>{companies.length} companies registered</p>
        </div>
        <Link 
          to="/add-employer"
          style={{
            padding: '12px 24px',
            background: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          + Add Company
        </Link>
      </div>

      {/* Companies Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {companies.map((company) => {
          const status = getStatusBadge(company.verificationStatus);
          
          return (
            <div key={company._id} style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, boxShadow 0.3s',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Company Header */}
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '1.2rem' }}>
                  {company.companyName}
                </h3>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  background: status.background,
                  color: status.color
                }}>
                  {status.text}
                </span>
              </div>

              {/* Company Body */}
              <div style={{ padding: '20px', flex: 1 }}>
                {/* Description */}
                <p style={{
                  color: '#666',
                  lineHeight: '1.6',
                  margin: '0 0 15px 0',
                  fontSize: '0.95rem'
                }}>
                  {company.description}
                </p>

                {/* Company Details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                  marginBottom: '15px',
                  fontSize: '0.9rem',
                  color: '#555'
                }}>
                  {company.industry && (
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#333' }}>Industry:</span>
                      <br />{company.industry}
                    </div>
                  )}
                  {company.location && (
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#333' }}>Location:</span>
                      <br />{company.location}
                    </div>
                  )}
                  {company.founded && (
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#333' }}>Founded:</span>
                      <br />{company.founded}
                    </div>
                  )}
                  {company.employees && (
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#333' }}>Employees:</span>
                      <br />{company.employees}
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 0',
                  borderTop: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {getRatingStars(company.averageRating)}
                  </span>
                  <span style={{ color: '#333', fontWeight: 'bold' }}>
                    {company.averageRating}
                  </span>
                  <span style={{ color: '#999', fontSize: '0.9rem' }}>
                    ({company.totalReviews} reviews)
                  </span>
                </div>

                {/* Website */}
                {company.website && (
                  <div style={{ marginTop: '15px' }}>
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#667eea',
                        textDecoration: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      🌐 {company.website.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>

              {/* Footer with View Button */}
              <div style={{
                padding: '15px 20px',
                background: '#f8f9fc',
                borderTop: '1px solid #f0f0f0'
              }}>
                <Link 
                  to={`/employer/${company._id}`}
                  style={{
                    display: 'block',
                    padding: '10px',
                    background: '#667eea',
                    color: 'white',
                    textDecoration: 'none',
                    textAlign: 'center',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#5a67d8'}
                  onMouseLeave={(e) => e.target.style.background = '#667eea'}
                >
                  View Details →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {companies.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
            No companies found. Add your first company!
          </p>
          <Link 
            to="/add-employer"
            style={{
              padding: '12px 30px',
              background: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            + Add Company
          </Link>
        </div>
      )}
    </div>
  );
}

export default EmployerList;