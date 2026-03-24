import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ReviewDisplay() {
  const { companyId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Load company name and reviews
  useEffect(() => {
    loadData();
  }, [companyId]);

  // Load and sort reviews when sortBy changes
  useEffect(() => {
    if (!loading) {
      sortReviews();
    }
  }, [sortBy]);

  const loadData = () => {
    // Load company name
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    const defaultCompanies = [
      { _id: '1', companyName: 'Tech Solutions Lanka' },
      { _id: '2', companyName: 'Eco Farms' },
      { _id: '3', companyName: 'Rapid Travels' },
      { _id: '4', companyName: 'CodeGen Innovations' }
    ];

    const allCompanies = [...defaultCompanies, ...companies];
    const company = allCompanies.find(c => c._id === companyId);

    if (company) {
      setCompanyName(company.companyName);
    }

    // Load reviews
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const companyReviews = allReviews.filter(
      review => review.companyId === companyId
    );

    setReviews(companyReviews);
    setLoading(false);
  };

  const sortReviews = () => {
    setReviews(prevReviews => {
      const sorted = [...prevReviews].sort((a, b) => {
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
      return sorted;
    });
  };

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
    return (
      <span style={{ color: '#f1c40f' }}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

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
        <p>Loading reviews...</p>
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
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '15px',
          padding: '30px',
          color: 'white',
          marginBottom: '30px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0 }}>{companyName || 'Company'}</h1>
            <p style={{ margin: '10px 0 0', opacity: 0.9 }}>
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'} • 
              Average Rating: {averageRating} ⭐
            </p>
          </div>

          <Link
            to={`/add-review/${companyId}`}
            style={{
              background: 'white',
              color: '#667eea',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            + Write a Review
          </Link>
        </div>
      </div>

      {/* Sort and Back */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <select 
          value={sortBy} 
          onChange={handleSortChange}
          style={{
            padding: '8px 15px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>

        <Link 
          to="/employers" 
          style={{
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          ← Back to Companies
        </Link>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
            No reviews yet for this company.
          </p>
          <Link
            to={`/add-review/${companyId}`}
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            Be the First to Review!
          </Link>
        </div>
      ) : (
        reviews.map((review, index) => (
          <div
            key={review.id || index}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '15px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '1.2rem' }}>
                  {getRatingStars(review.rating)}
                </span>
                <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
                  {review.rating}/5
                </span>
              </div>
              <small style={{ color: '#999' }}>
                {formatDate(review.createdAt)}
              </small>
            </div>

            {/* 🔥 වෙනස් කළේ මෙතන - reviewText වෙනුවට comment */}
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6', 
              margin: '10px 0',
              fontSize: '1rem'
            }}>
              {review.comment || review.reviewText || 'No comment provided'}
            </p>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid #f0f0f0'
            }}>
              <small style={{ color: '#667eea' }}>
                {review.reviewerName || (review.isAnonymous ? 'Anonymous User' : 'Verified Student')}
              </small>
              {review.position && (
                <small style={{ color: '#999' }}>
                  {review.position}
                </small>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewDisplay;