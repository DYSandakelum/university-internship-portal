import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Analytics() {
  const [companies, setCompanies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const defaultCompanies = [
      { 
        "_id": "1", 
        "companyName": "Tech Solutions Lanka", 
        "averageRating": 4.5, 
        "totalReviews": 128,
        "industry": "Software Development",
        "location": "Colombo",
        "employees": "50-100"
      },
      { 
        "_id": "2", 
        "companyName": "Eco Farms", 
        "averageRating": 4.2, 
        "totalReviews": 56,
        "industry": "Agriculture",
        "location": "Kandy",
        "employees": "100-200"
      },
      { 
        "_id": "3", 
        "companyName": "Rapid Travels", 
        "averageRating": 3.8, 
        "totalReviews": 23,
        "industry": "Travel & Tourism",
        "location": "Colombo",
        "employees": "20-50"
      },
      { 
        "_id": "4", 
        "companyName": "CodeGen Innovations", 
        "averageRating": 4.8, 
        "totalReviews": 92,
        "industry": "AI/ML",
        "location": "Negombo",
        "employees": "10-20"
      }
    ];
    
    const allCompanies = [...defaultCompanies, ...savedCompanies];
    setCompanies(allCompanies);
    
    const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    setReviews(savedReviews);
    setLoading(false);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const getTopCompanies = () => {
    return [...companies]
      .sort((a, b) => b.totalReviews - a.totalReviews)
      .slice(0, 5);
  };

  const getIndustrySummary = () => {
    const industryMap = {};
    companies.forEach(company => {
      const industry = company.industry || 'Other';
      if (!industryMap[industry]) {
        industryMap[industry] = {
          name: industry,
          companies: 0,
          totalReviews: 0,
          averageRating: 0,
          totalRating: 0
        };
      }
      industryMap[industry].companies++;
      industryMap[industry].totalReviews += company.totalReviews || 0;
      industryMap[industry].totalRating += (company.averageRating || 0);
    });
    
    return Object.values(industryMap).map(industry => ({
      ...industry,
      averageRating: industry.companies > 0 
        ? (industry.totalRating / industry.companies).toFixed(1) 
        : 0
    })).sort((a, b) => b.totalReviews - a.totalReviews);
  };

  const ratingDistribution = getRatingDistribution();
  const topCompanies = getTopCompanies();
  const industrySummary = getIndustrySummary();
  
  const totalCompanies = companies.length;
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const getMaxRatingCount = () => {
    return Math.max(...Object.values(ratingDistribution), 1);
  };

  const getRatingColor = (rating) => {
    const colors = {
      5: '#9b59b6',
      4: '#8e44ad',
      3: '#7d3c98',
      2: '#6c3483',
      1: '#5e3370'
    };
    return colors[rating] || '#9E9E9E';
  };

  const getRatingLabel = (rating) => {
    const labels = {
      5: 'Excellent',
      4: 'Good',
      3: 'Average',
      2: 'Poor',
      1: 'Very Poor'
    };
    return labels[rating] || 'Not Rated';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #9b59b6',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
        <p>Loading analytics...</p>
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
    <div style={{ 
      maxWidth: '1200px', 
      margin: '40px auto', 
      padding: '20px',
      background: '#f5f0f8'
    }}>
      {/* Header - Purple Gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 50%, #6c3483 100%)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white',
        marginBottom: '30px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(110, 52, 130, 0.3)'
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>📊 Analytics Dashboard</h1>
        <p style={{ margin: '10px 0 0', opacity: 0.9 }}>Insights from your data</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderBottom: '4px solid #9b59b6'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8e44ad' }}>{totalCompanies}</div>
          <div style={{ color: '#666' }}>Total Companies</div>
        </div>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderBottom: '4px solid #9b59b6'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8e44ad' }}>{totalReviews}</div>
          <div style={{ color: '#666' }}>Total Reviews</div>
        </div>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderBottom: '4px solid #9b59b6'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8e44ad' }}>{averageRating}</div>
          <div style={{ color: '#666' }}>Average Rating</div>
        </div>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderBottom: '4px solid #9b59b6'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8e44ad' }}>
            {totalReviews > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100) : 0}%
          </div>
          <div style={{ color: '#666' }}>Positive Reviews (4-5⭐)</div>
        </div>
      </div>

      {/* Rating Distribution & Top Companies */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px',
        marginBottom: '40px'
      }}>
        {/* Rating Distribution */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderTop: '4px solid #9b59b6'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#8e44ad', fontSize: '1.5rem' }}>⭐ Rating Distribution</h2>
          {[5, 4, 3, 2, 1].map(rating => {
            const count = ratingDistribution[rating] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews * 100) : 0;
            const barWidth = totalReviews > 0 ? (count / totalReviews * 100) : 0;
            const color = getRatingColor(rating);
            
            return (
              <div key={rating} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>{rating} Star</span>
                    <span style={{ fontSize: '0.85rem', color: color, fontWeight: 'bold' }}>
                      {getRatingLabel(rating)}
                    </span>
                  </div>
                  <span style={{ color: '#666' }}>{count} reviews ({percentage.toFixed(1)}%)</span>
                </div>
                <div style={{
                  background: '#f0f0f0',
                  borderRadius: '10px',
                  height: '30px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${barWidth}%`,
                    background: color,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}>
                    {barWidth > 10 && `${count}`}
                  </div>
                </div>
              </div>
            );
          })}
          
          {totalReviews === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No reviews yet to display rating distribution
            </div>
          )}
        </div>

        {/* Top Companies */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderTop: '4px solid #9b59b6'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#8e44ad', fontSize: '1.5rem' }}>🏆 Top Companies</h2>
          {topCompanies.length > 0 ? (
            topCompanies.map((company, index) => {
              const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32', '#e3e6f0', '#e3e6f0'];
              
              return (
                <div key={company._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '12px 0',
                  borderBottom: index < topCompanies.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: index < 3 ? medalColors[index] : medalColors[3],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: index < 3 ? '#333' : '#666'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Link 
                      to={`/employer/${company._id}`}
                      style={{ 
                        fontWeight: 'bold', 
                        color: '#333', 
                        textDecoration: 'none',
                        display: 'block'
                      }}
                    >
                      {company.companyName}
                    </Link>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {company.industry} • {company.location}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>{company.totalReviews} reviews</div>
                    <div style={{ fontSize: '0.85rem', color: '#9b59b6' }}>⭐ {company.averageRating}</div>
                  </div>
                  <Link 
                    to={`/employer/${company._id}`}
                    style={{
                      padding: '6px 15px',
                      background: '#8e44ad',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}
                  >
                    View
                  </Link>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No companies added yet
            </div>
          )}
        </div>
      </div>

      {/* Industry Summary */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '25px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        marginBottom: '40px',
        borderTop: '4px solid #9b59b6'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#8e44ad', fontSize: '1.5rem' }}>🏭 Industry Summary</h2>
        {industrySummary.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Industry</th>
                  <th style={{ textAlign: 'center', padding: '12px', color: '#666' }}>Companies</th>
                  <th style={{ textAlign: 'center', padding: '12px', color: '#666' }}>Total Reviews</th>
                  <th style={{ textAlign: 'center', padding: '12px', color: '#666' }}>Avg Rating</th>
                  <th style={{ textAlign: 'right', padding: '12px', color: '#666' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {industrySummary.map((industry, index) => {
                  const maxReviews = Math.max(...industrySummary.map(i => i.totalReviews), 1);
                  const barWidth = (industry.totalReviews / maxReviews) * 100;
                  
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#8e44ad' }}>{industry.name}</td>
                      <td style={{ textAlign: 'center', padding: '12px' }}>{industry.companies}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '80px',
                            background: '#f0f0f0',
                            borderRadius: '10px',
                            height: '8px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${barWidth}%`,
                              background: '#9b59b6',
                              height: '100%'
                            }}></div>
                          </div>
                          <span>{industry.totalReviews}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px' }}>
                        <span style={{ color: '#9b59b6' }}>⭐</span> {industry.averageRating}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px' }}>
                        <Link 
                          to={`/employers`}
                          style={{
                            padding: '4px 12px',
                            background: '#f0f0f0',
                            color: '#8e44ad',
                            textDecoration: 'none',
                            borderRadius: '15px',
                            fontSize: '0.8rem'
                          }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            No industry data available
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderBottom: '3px solid #9b59b6'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📝</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8e44ad' }}>
            {reviews.filter(r => r.isAnonymous).length}
          </div>
          <div style={{ color: '#666' }}>Anonymous Reviews</div>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderBottom: '3px solid #9b59b6'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⭐</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8e44ad' }}>
            {reviews.filter(r => r.rating >= 4).length}
          </div>
          <div style={{ color: '#666' }}>High Ratings (4-5⭐)</div>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderBottom: '3px solid #9b59b6'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏢</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8e44ad' }}>
            {companies.filter(c => c.verificationStatus === 'verified').length}
          </div>
          <div style={{ color: '#666' }}>Verified Companies</div>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          borderBottom: '3px solid #9b59b6'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📅</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8e44ad' }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
          <div style={{ color: '#666' }}>This Month</div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;