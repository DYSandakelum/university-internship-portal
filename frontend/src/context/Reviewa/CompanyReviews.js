import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CompanyReviews() {
  const [reviews, setReviews] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load reviews from localStorage
    const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    // Load companies
    const defaultCompanies = [
      { "_id": "1", "companyName": "Tech Solutions Lanka" },
      { "_id": "2", "companyName": "Eco Farms" },
      { "_id": "3", "companyName": "Rapid Travels" },
      { "_id": "4", "companyName": "CodeGen Innovations" }
    ];
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const allCompanies = [...defaultCompanies, ...savedCompanies];
    
    setCompanies(allCompanies);
    
    // Take only last 6 reviews
    const lastSixReviews = [...savedReviews]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
    
    setReviews(lastSixReviews);
  };

  // Get company name
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c._id === companyId);
    return company ? company.companyName : 'Unknown Company';
  };

  // Get rating stars
  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Get rating type (Good/Bad)
  const getRatingType = (rating) => {
    if (rating >= 4) return { text: 'Good', color: '#4CAF50' };
    if (rating === 3) return { text: 'Average', color: '#FF9800' };
    return { text: 'Bad', color: '#f44336' };
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        padding: '30px',
        color: 'white',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>Company Reviews</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Latest {reviews.length} reviews from employees
        </p>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: '#f9f9f9',
          borderRadius: '10px'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            No reviews yet. Be the first to review!
          </p>
          <Link 
            to="/add-review/select-company"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '12px 30px',
              background: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px'
            }}
          >
            Write a Review
          </Link>
        </div>
      ) : (
        <div>
          {reviews.map((review, index) => {
            const ratingType = getRatingType(review.rating);
            
            return (
              <div key={review._id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: `5px solid ${ratingType.color}`
              }}>
                {/* Company Name and Rating Type */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{ margin: 0, color: '#333' }}>
                    {getCompanyName(review.companyId)}
                  </h3>
                  <span style={{
                    padding: '5px 15px',
                    borderRadius: '20px',
                    background: ratingType.color,
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {ratingType.text}
                  </span>
                </div>

                {/* Rating Stars */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <span style={{ color: '#f1c40f', fontSize: '1.2rem' }}>
                    {getRatingStars(review.rating)}
                  </span>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    ({review.rating}/5)
                  </span>
                </div>

                {/* Review Text */}
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  margin: '15px 0',
                  color: '#555',
                  padding: '10px',
                  background: '#f8f9fc',
                  borderRadius: '8px'
                }}>
                  "{review.reviewText}"
                </p>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px',
                  paddingTop: '10px',
                  borderTop: '1px solid #f0f0f0',
                  fontSize: '0.9rem',
                  color: '#999'
                }}>
                  <span>
                    {review.isAnonymous ? 'Anonymous' : 'Verified Employee'}
                  </span>
                  <span>
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#f8f9fc',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#666' }}>
              Showing {reviews.length} most recent reviews
            </p>
            <Link 
              to="/add-review/select-company"
              style={{
                display: 'inline-block',
                marginTop: '15px',
                padding: '10px 25px',
                background: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}
            >
              + Add Your Review
            </Link>
          </div>
        </div>
      )}

      {/* Back Button */}
      <Link 
        to="/"
        style={{
          display: 'inline-block',
          marginTop: '20px',
          color: '#667eea',
          textDecoration: 'none'
        }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}

export default CompanyReviews;