import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ReviewDisplay() {
  const { companyId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Load company details
  useEffect(() => {
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    const defaultCompanies = [
      { _id: '1', companyName: 'Tech Solutions Lanka', industry: 'Software Development', location: 'Colombo' },
      { _id: '2', companyName: 'Eco Farms', industry: 'Agriculture', location: 'Kandy' },
      { _id: '3', companyName: 'Rapid Travels', industry: 'Travel & Tourism', location: 'Colombo' },
      { _id: '4', companyName: 'CodeGen Innovations', industry: 'AI/ML', location: 'Negombo' }
    ];

    const allCompanies = [...defaultCompanies, ...companies];
    const company = allCompanies.find(c => c._id === companyId);

    if (company) {
      setCompanyName(company.companyName);
      setCompanyIndustry(company.industry || 'Technology');
      setCompanyLocation(company.location || 'Sri Lanka');
    }
  }, [companyId]);

  // Load & sort reviews
  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const companyReviews = allReviews.filter(review => review.companyId === companyId);

    const sortedReviews = [...companyReviews].sort((a, b) => {
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

    setReviews(sortedReviews);
  }, [companyId, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
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

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>{companyName || 'Company'}</h1>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '0.95rem', opacity: 0.9 }}>
          <span>🔍 {companyIndustry}</span>
          <span>📍 {companyLocation}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1 }}>{averageRating}</div>
            <div style={{ fontSize: '1rem' }}>out of 5</div>
          </div>
          <div>
            <div style={{ fontSize: '1.2rem' }}>{getRatingStars(Math.round(averageRating))}</div>
            <div>{reviews.length} Reviews</div>
          </div>
          <Link
            to={`/add-review/${companyId}`}
            style={{
              marginLeft: 'auto',
              background: 'white',
              color: '#667eea',
              padding: '12px 24px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            + Write a Review
          </Link>
        </div>
      </div>

      {/* Sort Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <select
          value={sortBy}
          onChange={handleSortChange}
          style={{
            padding: '10px 20px',
            borderRadius: '25px',
            border: '1px solid #ddd',
            background: 'white',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
        <Link to="/employers" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Companies
        </Link>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: '#f8f9fc',
          borderRadius: '16px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
          <h3 style={{ color: '#666' }}>No Reviews Yet</h3>
          <p style={{ color: '#999', marginBottom: '20px' }}>
            Be the first to share your experience at {companyName}
          </p>
          <Link
            to={`/add-review/${companyId}`}
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: '#667eea',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '30px',
              fontWeight: 'bold'
            }}
          >
            Write a Review
          </Link>
        </div>
      ) : (
        reviews.map((review, index) => {
          const ratingColor = getRatingColor(review.rating);
          const ratingDesc = getRatingDescription(review.rating);
          
          return (
            <div
              key={review.id || index}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '25px',
                marginBottom: '20px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '30px',
                  background: `${ratingColor}20`,
                  color: ratingColor,
                  fontWeight: 'bold'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>{getRatingStars(review.rating)}</span>
                  <span>{review.rating}.0 • {ratingDesc}</span>
                </div>
                <small style={{ color: '#999' }}>{formatDate(review.createdAt)}</small>
              </div>
              
              <p style={{
                color: '#555',
                lineHeight: '1.7',
                marginBottom: '15px',
                fontSize: '1rem'
              }}>
                "{review.comment || review.reviewText || 'No comment provided'}"
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '15px',
                borderTop: '1px solid #f0f0f0',
                fontSize: '0.85rem',
                color: '#999'
              }}>
                <span>
                  {review.isAnonymous ? 'Anonymous User' : (review.reviewerName || 'Verified Student')}
                </span>
                {review.position && <span>Position: {review.position}</span>}
              </div>
            </div>
          );
        })
      )}

      {/* Footer */}
      {reviews.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '30px', color: '#999' }}>
          <small>Lasted {reviews.length} reviews from my journey</small>
        </div>
      )}
    </div>
  );
}

export default ReviewDisplay;