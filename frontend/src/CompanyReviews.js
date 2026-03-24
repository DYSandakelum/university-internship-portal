import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CompanyReviews() {
  const [reviews, setReviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleReviews, setVisibleReviews] = useState(6);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortReviews();
  }, [selectedCompany, sortBy, reviews]);

  const loadData = () => {
    const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const defaultCompanies = [
      { "_id": "1", "companyName": "Tech Solutions Lanka", "industry": "Software", "location": "Colombo" },
      { "_id": "2", "companyName": "Eco Farms", "industry": "Agriculture", "location": "Kandy" },
      { "_id": "3", "companyName": "Rapid Travels", "industry": "Travel", "location": "Colombo" },
      { "_id": "4", "companyName": "CodeGen Innovations", "industry": "AI/ML", "location": "Negombo" }
    ];
    setCompanies([...defaultCompanies, ...savedCompanies]);
    setReviews(savedReviews);
  };

  const [filteredReviews, setFilteredReviews] = useState([]);

  const filterAndSortReviews = () => {
    let filtered = [...reviews];
    
    if (selectedCompany) {
      filtered = filtered.filter(r => r.companyId === selectedCompany);
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      return 0;
    });
    
    setFilteredReviews(filtered);
  };

  const loadMore = () => {
    setVisibleReviews(prev => prev + 6);
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c._id === companyId);
    return company ? company.companyName : 'Unknown Company';
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingDescription = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Average';
    if (rating >= 1.5) return 'Poor';
    return 'Very Poor';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#4CAF50';
    if (rating >= 3.5) return '#8BC34A';
    if (rating >= 2.5) return '#FFC107';
    if (rating >= 1.5) return '#FF9800';
    return '#F44336';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const visibleReviewsList = filteredReviews.slice(0, visibleReviews);
  const totalReviews = filteredReviews.length;
  const averageRating = totalReviews > 0
    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f6c23e 0%, #f4a100 100%)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>📊 Company Reviews</h1>
        <p style={{ margin: '10px 0 0', opacity: 0.9 }}>Real experiences from real people</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '30px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalReviews}</div>
            <div>Total Reviews</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{averageRating}</div>
            <div>Average Rating</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{new Set(filteredReviews.map(r => r.companyId)).size}</div>
            <div>Companies</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: '1px solid #ddd',
              background: 'white',
              fontSize: '0.9rem'
            }}
          >
            <option value="">All Companies</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>{company.companyName}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: '1px solid #ddd',
              background: 'white',
              fontSize: '0.9rem'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
        
        <Link to="/add-review/select-company" style={{
          padding: '10px 24px',
          background: '#f6c23e',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '25px',
          fontWeight: 'bold'
        }}>
          + Write a Review
        </Link>
      </div>

      {/* Reviews Grid */}
      {visibleReviewsList.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: '#f8f9fc',
          borderRadius: '16px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
          <h3 style={{ color: '#666' }}>No Reviews Yet</h3>
          <p style={{ color: '#999', marginBottom: '20px' }}>
            Be the first to share your internship experience!
          </p>
          <Link to="/add-review/select-company" style={{
            display: 'inline-block',
            padding: '12px 30px',
            background: '#f6c23e',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '30px',
            fontWeight: 'bold'
          }}>
            Write a Review
          </Link>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px',
            marginBottom: '30px'
          }}>
            {visibleReviewsList.map((review, index) => {
              const ratingColor = getRatingColor(review.rating);
              const ratingDesc = getRatingDescription(review.rating);
              
              return (
                <div key={review.id || index} style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s'
                }}>
                  <div style={{ height: '6px', background: ratingColor, width: '100%' }}></div>
                  <div style={{ padding: '20px' }}>
                    <Link to={`/employer/${review.companyId}`} style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#333',
                      textDecoration: 'none',
                      display: 'block',
                      marginBottom: '10px'
                    }}>
                      {review.companyName || getCompanyName(review.companyId)}
                    </Link>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '15px'
                    }}>
                      <span style={{ color: '#f1c40f', fontSize: '1.1rem' }}>
                        {getRatingStars(review.rating)}
                      </span>
                      <span style={{ fontWeight: 'bold' }}>{review.rating}.0</span>
                      <span style={{ fontSize: '0.85rem', color: ratingColor, fontWeight: 'bold' }}>
                        {ratingDesc}
                      </span>
                    </div>
                    
                    <p style={{
                      color: '#555',
                      lineHeight: '1.6',
                      marginBottom: '15px',
                      fontSize: '0.95rem'
                    }}>
                      "{review.comment?.length > 120 ? review.comment.substring(0, 120) + '...' : review.comment}"
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: '#999',
                      borderTop: '1px solid #f0f0f0',
                      paddingTop: '12px'
                    }}>
                      <span>{review.isAnonymous ? 'Anonymous' : (review.reviewerName || 'Student')}</span>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                    
                    {review.position && (
                      <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '8px' }}>
                        📌 {review.position}
                        {review.internshipDuration && ` • ${review.internshipDuration}`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {visibleReviews < filteredReviews.length && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={loadMore}
                style={{
                  padding: '12px 40px',
                  background: 'transparent',
                  border: '2px solid #f6c23e',
                  color: '#f6c23e',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Load More Reviews ({filteredReviews.length - visibleReviews} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CompanyReviews;