import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [companies, setCompanies] = useState([]);

  // Load companies from localStorage
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    // Load from localStorage
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    
    // Default companies if no data
    const defaultCompanies = [
      { "_id": "1", "companyName": "Tech Solutions Lanka", "averageRating": 4.5, "totalReviews": 128, "industry": "Software", "location": "Colombo" },
      { "_id": "2", "companyName": "Eco Farms", "averageRating": 4.2, "totalReviews": 56, "industry": "Agriculture", "location": "Kandy" },
      { "_id": "3", "companyName": "Rapid Travels", "averageRating": 3.8, "totalReviews": 23, "industry": "Travel", "location": "Colombo" },
      { "_id": "4", "companyName": "CodeGen Innovations", "averageRating": 4.8, "totalReviews": 92, "industry": "AI/ML", "location": "Negombo" }
    ];
    
    const allCompanies = [...defaultCompanies, ...savedCompanies];
    setCompanies(allCompanies);
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    headerCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      padding: '60px 40px',
      color: 'white',
      textAlign: 'center',
      marginBottom: '40px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    },
    headerTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    headerText: {
      fontSize: '1.3rem',
      marginBottom: '30px',
      opacity: 0.95
    },
    buttonGroup: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    primaryButton: {
      background: 'white',
      color: '#667eea',
      padding: '15px 40px',
      borderRadius: '50px',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    },
    successButton: {
      background: '#4CAF50',
      color: 'white',
      padding: '15px 40px',
      borderRadius: '50px',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '40px',
      position: 'relative'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginBottom: '50px'
    },
    card: {
      background: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    },
    cardHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '25px',
      textAlign: 'center'
    },
    cardHeaderGreen: {
      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      color: 'white',
      padding: '25px',
      textAlign: 'center'
    },
    cardHeaderBlue: {
      background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      color: 'white',
      padding: '25px',
      textAlign: 'center'
    },
    cardHeaderOrange: {
      background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      color: 'white',
      padding: '25px',
      textAlign: 'center'
    },
    cardBody: {
      padding: '25px'
    },
    cardText: {
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '20px',
      minHeight: '60px'
    },
    cardButton: {
      display: 'inline-block',
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      textDecoration: 'none',
      textAlign: 'center',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginTop: '50px'
    },
    statCard: {
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      textAlign: 'center',
      boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '10px'
    },
    statLabel: {
      color: '#666',
      fontSize: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.headerCard}>
        <h1 style={styles.headerTitle}>Company Reviews System</h1>
        <p style={styles.headerText}>
          Find and review companies, share your interview experiences!
        </p>
        <div style={styles.buttonGroup}>
          <Link to="/employers" style={styles.primaryButton}>
            View Companies
          </Link>
          <Link to="/add-employer" style={styles.successButton}>
            Add New Company
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <h2 style={styles.sectionTitle}>Features</h2>
      <div style={styles.gridContainer}>
        {/* Browse Companies Card */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.cardHeader}>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>📋</h3>
            <h3 style={{ margin: '10px 0 0 0' }}>Browse Companies</h3>
          </div>
          <div style={styles.cardBody}>
            <p style={styles.cardText}>
              View all companies with their details, ratings, and reviews. Find the best places to work!
            </p>
            <Link 
              to="/employers" 
              style={{
                ...styles.cardButton,
                background: '#667eea',
                color: 'white'
              }}
              onMouseEnter={(e) => e.target.style.background = '#5a67d8'}
              onMouseLeave={(e) => e.target.style.background = '#667eea'}
            >
              Browse Companies →
            </Link>
          </div>
        </div>

        {/* Add Reviews Card */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.cardHeaderGreen}>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>⭐</h3>
            <h3 style={{ margin: '10px 0 0 0' }}>Add Reviews</h3>
          </div>
          <div style={styles.cardBody}>
            <p style={styles.cardText}>
              Share your experience by adding ratings and reviews. Help others make informed decisions!
            </p>
            
            <Link
              to="/all-reviews"
              style={{
                ...styles.cardButton,
                background: '#4CAF50',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '1.1rem',
                padding: '15px'
              }}
              onMouseEnter={(e) => e.target.style.background = '#45a049'}
              onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
            >
              <span>✏️</span>
              Write a Review
              <span>→</span>
            </Link>

            <p style={{ textAlign: 'center', marginTop: '15px', color: '#999', fontSize: '0.9rem' }}>
              {companies.length} companies available for review
            </p>
          </div>
        </div>

        {/* Add Companies Card */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.cardHeaderBlue}>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>🏢</h3>
            <h3 style={{ margin: '10px 0 0 0' }}>Add Companies</h3>
          </div>
          <div style={styles.cardBody}>
            <p style={styles.cardText}>
              Contribute by adding new companies to the platform. Help build our community!
            </p>
            <Link 
              to="/add-employer" 
              style={{
                ...styles.cardButton,
                background: '#2196F3',
                color: 'white'
              }}
              onMouseEnter={(e) => e.target.style.background = '#1976D2'}
              onMouseLeave={(e) => e.target.style.background = '#2196F3'}
            >
              Add Company →
            </Link>
          </div>
        </div>

        {/* View All Reviews Card */}
        <div 
          style={styles.card}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={styles.cardHeaderOrange}>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>📊</h3>
            <h3 style={{ margin: '10px 0 0 0' }}>All Reviews</h3>
          </div>
          <div style={styles.cardBody}>
            <p style={styles.cardText}>
              Browse through all reviews. See what people are saying about different companies!
            </p>
            
            <Link 
              to="/company-reviews" 
              style={{
                ...styles.cardButton,
                background: '#FF9800',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => e.target.style.background = '#F57C00'}
              onMouseLeave={(e) => e.target.style.background = '#FF9800'}
            >
              <span>📊</span>
              View All Reviews
              <span>→</span>
            </Link>

            <p style={{ 
              textAlign: 'center', 
              marginTop: '15px', 
              color: '#999', 
              fontSize: '0.9rem' 
            }}>
              {companies.reduce((sum, c) => sum + (c.totalReviews || 0), 0)} reviews from all companies
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <h2 style={styles.sectionTitle}>Quick Actions</h2>
      <div style={styles.gridContainer}>
        <div style={styles.card}>
          <div style={styles.cardBody}>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Popular Companies</h3>
            {companies.slice(0, 3).map(company => (
              <div key={company._id} style={{ marginBottom: '10px' }}>
                <Link 
                  to={`/employer/${company._id}`}
                  style={{ 
                    color: '#333', 
                    textDecoration: 'none',
                    display: 'block',
                    padding: '8px',
                    borderRadius: '5px',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <strong>{company.companyName}</strong>
                  <small style={{ float: 'right', color: '#f1c40f' }}>
                    ⭐ {company.averageRating?.toFixed(1) || '0.0'}
                  </small>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardBody}>
            <h3 style={{ color: '#4CAF50', marginBottom: '15px' }}>Need Help?</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Check out our guides on how to write effective reviews and add companies.
            </p>
            <Link 
              to="/employers" 
              style={{
                ...styles.cardButton,
                background: '#4CAF50',
                color: 'white',
                width: 'auto',
                padding: '10px 20px'
              }}
            >
              Learn More →
            </Link>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardBody}>
            <h3 style={{ color: '#FF9800', marginBottom: '15px' }}>Statistics</h3>
            <p style={{ color: '#666' }}>
              Total Companies: {companies.length}<br />
              Total Reviews: {companies.reduce((sum, c) => sum + (c.totalReviews || 0), 0)}<br />
              Average Rating: {(companies.reduce((sum, c) => sum + (c.averageRating || 0), 0) / companies.length || 0).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{companies.length}</div>
          <div style={styles.statLabel}>Total Companies</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {companies.reduce((sum, c) => sum + (c.totalReviews || 0), 0)}
          </div>
          <div style={styles.statLabel}>Total Reviews</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {(companies.reduce((sum, c) => sum + (c.averageRating || 0), 0) / companies.length || 0).toFixed(1)}
          </div>
          <div style={styles.statLabel}>Average Rating</div>
        </div>
      </div>
    </div>
  );
}

export default Home;