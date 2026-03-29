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
        "averageRating": 4.5, 
        "totalReviews": 128,
        "industry": "Software Development",
        "location": "Colombo",
        "founded": 2015,
        "employees": "50-100"
      },
      { 
        "_id": "2", 
        "companyName": "Eco Farms", 
        "description": "Sustainable agriculture company focused on organic farming and export of fresh produce.",
        "averageRating": 4.2, 
        "totalReviews": 56,
        "industry": "Agriculture",
        "location": "Kandy",
        "founded": 2010,
        "employees": "100-200"
      },
      { 
        "_id": "3", 
        "companyName": "Rapid Travels", 
        "description": "Premier travel agency offering customized tour packages and visa assistance.",
        "averageRating": 3.8, 
        "totalReviews": 23,
        "industry": "Travel & Tourism",
        "location": "Colombo",
        "founded": 2018,
        "employees": "20-50"
      },
      { 
        "_id": "4", 
        "companyName": "CodeGen Innovations", 
        "description": "AI and machine learning startup developing solutions for healthcare.",
        "averageRating": 4.8, 
        "totalReviews": 92,
        "industry": "AI/ML",
        "location": "Negombo",
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
    return (
      <span style={{ color: '#f1c40f' }}>
        {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading companies...</p>
      </div>
    );
  }

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      padding: '20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    title: {
      fontSize: '1.8rem',
      color: '#333',
      margin: 0
    },
    count: {
      color: '#666',
      marginTop: '5px'
    },
    addBtn: {
      padding: '12px 24px',
      background: '#4CAF50',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      transition: 'background 0.3s'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '25px'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s'
    },
    cardContent: {
      padding: '20px'
    },
    companyName: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    description: {
      color: '#666',
      lineHeight: '1.5',
      marginBottom: '15px',
      fontSize: '0.9rem'
    },
    ratingSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '15px',
      padding: '10px 0',
      borderTop: '1px solid #f0f0f0',
      borderBottom: '1px solid #f0f0f0'
    },
    details: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
      marginBottom: '15px',
      fontSize: '0.85rem',
      color: '#555'
    },
    viewBtn: {
      display: 'block',
      padding: '12px',
      background: '#667eea',
      color: 'white',
      textDecoration: 'none',
      textAlign: 'center',
      borderRadius: '8px',
      fontWeight: 'bold',
      transition: 'background 0.3s'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Companies</h1>
          <p style={styles.count}>{companies.length} companies registered</p>
        </div>
        <Link to="/add-employer" style={styles.addBtn}>+ Add Company</Link>
      </div>

      {/* Companies Grid */}
      <div style={styles.grid}>
        {companies.map(company => (
          <div 
            key={company._id} 
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
            }}
          >
            <div style={styles.cardContent}>
              <h3 style={styles.companyName}>{company.companyName}</h3>
              <p style={styles.description}>
                {company.description.length > 100 
                  ? company.description.substring(0, 100) + '...' 
                  : company.description}
              </p>
              
              <div style={styles.ratingSection}>
                {getRatingStars(company.averageRating)}
                <span style={{ fontWeight: 'bold' }}>{company.averageRating}</span>
                <span style={{ color: '#999' }}>({company.totalReviews} reviews)</span>
              </div>
              
              <div style={styles.details}>
                {company.industry && (
                  <div>
                    <strong>Industry:</strong> {company.industry}
                  </div>
                )}
                {company.location && (
                  <div>
                    <strong>Location:</strong> {company.location}
                  </div>
                )}
                {company.founded && (
                  <div>
                    <strong>Founded:</strong> {company.founded}
                  </div>
                )}
                {company.employees && (
                  <div>
                    <strong>Employees:</strong> {company.employees}
                  </div>
                )}
              </div>
              
              <Link 
                to={`/employer/${company._id}`} 
                style={styles.viewBtn}
                onMouseEnter={(e) => e.target.style.background = '#5a67d8'}
                onMouseLeave={(e) => e.target.style.background = '#667eea'}
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {companies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <p>No companies found. Add your first company!</p>
          <Link to="/add-employer" style={{ ...styles.addBtn, display: 'inline-block', marginTop: '20px' }}>+ Add Company</Link>
        </div>
      )}
    </div>
  );
}

export default EmployerList;