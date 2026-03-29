import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Analytics() {
  const [companies, setCompanies] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load companies
    const defaultCompanies = [
      { "_id": "1", "companyName": "Tech Solutions Lanka", "totalReviews": 128, "averageRating": 4.5, "industry": "Software" },
      { "_id": "2", "companyName": "Eco Farms", "totalReviews": 56, "averageRating": 4.2, "industry": "Agriculture" },
      { "_id": "3", "companyName": "Rapid Travels", "totalReviews": 23, "averageRating": 3.8, "industry": "Travel" },
      { "_id": "4", "companyName": "CodeGen Innovations", "totalReviews": 92, "averageRating": 4.8, "industry": "AI/ML" }
    ];
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    setCompanies([...defaultCompanies, ...savedCompanies]);

    // Load reviews
    const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    setReviews(savedReviews);
  };

  // Calculate statistics
  const totalReviews = reviews.length;
  const totalCompanies = companies.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const companiesWithReviews = new Set(reviews.map(r => r.companyId)).size;

  // Rating distribution
  const ratingCounts = {
    1: reviews.filter(r => r.rating === 1).length,
    2: reviews.filter(r => r.rating === 2).length,
    3: reviews.filter(r => r.rating === 3).length,
    4: reviews.filter(r => r.rating === 4).length,
    5: reviews.filter(r => r.rating === 5).length
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        padding: '30px',
        color: 'white',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0 }}>📊 Analytics Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{totalCompanies}</div>
          <div style={{ color: '#666' }}>Total Companies</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{totalReviews}</div>
          <div style={{ color: '#666' }}>Total Reviews</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{averageRating}</div>
          <div style={{ color: '#666' }}>Average Rating</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{companiesWithReviews}</div>
          <div style={{ color: '#666' }}>Companies with Reviews</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>⭐ Rating Distribution</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {[5,4,3,2,1].map(rating => (
            <div key={rating}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ minWidth: '50px' }}>{rating} Star</span>
                <div style={{ flex: 1, height: '20px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(ratingCounts[rating] / (totalReviews || 1)) * 100}%`,
                    height: '100%',
                    background: rating === 5 ? '#4CAF50' : 
                               rating === 4 ? '#8BC34A' :
                               rating === 3 ? '#FFC107' :
                               rating === 2 ? '#FF9800' : '#F44336'
                  }}></div>
                </div>
                <span style={{ minWidth: '50px', textAlign: 'right' }}>{ratingCounts[rating]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Companies */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>🏆 Top Companies</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {companies
            .sort((a, b) => b.totalReviews - a.totalReviews)
            .slice(0, 5)
            .map((company, index) => (
              <div key={company._id} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#e3e6f0',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {index + 1}
                </span>
                <span style={{ flex: 1 }}>{company.companyName}</span>
                <span style={{ fontWeight: 'bold' }}>{company.totalReviews} reviews</span>
                <span style={{ color: '#f1c40f' }}>⭐ {company.averageRating}</span>
                <Link to={`/employer/${company._id}`} style={{ color: '#667eea', textDecoration: 'none' }}>View →</Link>
              </div>
            ))}
        </div>
      </div>

      {/* Industry Summary */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>🏭 Industry Summary</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {Object.entries(
            companies.reduce((acc, company) => {
              const industry = company.industry || 'Other';
              acc[industry] = (acc[industry] || 0) + company.totalReviews;
              return acc;
            }, {})
          ).map(([industry, count]) => (
            <div key={industry} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ minWidth: '100px' }}>{industry}</span>
              <div style={{ flex: 1, height: '20px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(count / Math.max(...Object.values(
                    companies.reduce((acc, company) => {
                      const industry = company.industry || 'Other';
                      acc[industry] = (acc[industry] || 0) + company.totalReviews;
                      return acc;
                    }, {})
                  ))) * 100}%`,
                  height: '100%',
                  background: '#667eea'
                }}></div>
              </div>
              <span style={{ minWidth: '50px', textAlign: 'right' }}>{count} reviews</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;