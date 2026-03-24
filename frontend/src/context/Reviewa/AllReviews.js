import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AllReviews() {
  const [reviews, setReviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(6); // මුලින්ම 6ක් පෙන්වන්න

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load reviews from localStorage
    const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    // Load companies from localStorage
    const defaultCompanies = [
      { "_id": "1", "companyName": "Tech Solutions Lanka", "industry": "Software", "location": "Colombo" },
      { "_id": "2", "companyName": "Eco Farms", "industry": "Agriculture", "location": "Kandy" },
      { "_id": "3", "companyName": "Rapid Travels", "industry": "Travel", "location": "Colombo" },
      { "_id": "4", "companyName": "CodeGen Innovations", "industry": "AI/ML", "location": "Negombo" }
    ];
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const allCompanies = [...defaultCompanies, ...savedCompanies];
    
    setCompanies(allCompanies);
    
    // Sort reviews by date (newest first)
    const sortedReviews = [...savedReviews].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    setReviews(sortedReviews);
  };

  // Load more reviews
  const loadMore = () => {
    setVisibleReviews(prev => prev + 3);
  };

  // Get company details by ID
  const getCompanyDetails = (companyId) => {
    const company = companies.find(c => c._id === companyId);
    return company || { companyName: 'Unknown Company', industry: 'Unknown', location: 'Unknown' };
  };

  // Get rating stars
  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Get rating description
  const getRatingDescription = (rating) => {
    const descriptions = {
      1: 'Very Poor',
      2: 'Poor', 
      3: 'Average',
      4: 'Good',
      5: 'Excellent'
    };
    return descriptions[rating] || 'Not Rated';
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

  // Get company color
  const getCompanyColor = (companyId) => {
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#6610f2'];
    const index = (companyId?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  const visibleReviewsList = reviews.slice(0, visibleReviews);

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const companiesCount = new Set(reviews.map(r => r.companyId)).size;

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f6c23e 0%, #f4a100 100%)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white',
        marginBottom: '30px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(246, 194, 62, 0.3)'
      }}>
        <h1 style={{ fontSize: '2.8rem', margin: '0 0 15px 0' }}>
          📊 All Reviews
        </h1>
        <p style={{ fontSize: '1.3rem', margin: '0 0 20px 0', opacity: 0.95 }}>
          Real experiences from real people
        </p>
        
        {/* Stats Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginTop: '30px',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>{totalReviews}</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Total Reviews</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>{averageRating}</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Average Rating</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>{companiesCount}</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Companies</div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      {visibleReviewsList.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          background: '#f9f9f9',
          borderRadius: '15px',
          border: '2px dashed #ddd'
        }}>
          <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '20px' }}>
            No reviews yet. Be the first to share your experience!
          </p>
          <Link 
            to="/add-review/select-company"
            style={{
              padding: '15px 40px',
              background: '#f6c23e',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              display: 'inline-block'
            }}
          >
            ✏️ Write a Review
          </Link>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '25px',
            marginBottom: '30px'
          }}>
            {visibleReviewsList.map((review, index) => {
              const company = getCompanyDetails(review.companyId);
              const color = getCompanyColor(review.companyId);
              
              return (
                <div key={review._id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  position: 'relative'
                }}>
                  {/* Top Color Bar */}
                  <div style={{
                    height: '8px',
                    background: color,
                    width: '100%'
                  }}></div>
                  
                  <div style={{ padding: '25px' }}>
                    {/* Company Info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '15px',
                        background: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.15)'
                      }}>
                        {company.companyName.charAt(0)}
                      </div>
                      <div>
                        <Link 
                          to={`/employer/${review.companyId}`}
                          style={{ 
                            color: '#333', 
                            textDecoration: 'none',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            display: 'block',
                            marginBottom: '5px'
                          }}
                        >
                          {company.companyName}
                        </Link>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          {company.industry} • {company.location}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '15px',
                      padding: '10px',
                      background: '#f8f9fc',
                      borderRadius: '10px'
                    }}>
                      <div style={{ color: '#f1c40f', fontSize: '1.3rem' }}>
                        {getRatingStars(review.rating)}
                      </div>
                      <div style={{
                        background: color,
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                      }}>
                        {getRatingDescription(review.rating)}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div style={{
                      background: '#f8f9fc',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '20px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '15px',
                        fontSize: '40px',
                        color: '#ddd',
                        fontFamily: 'Georgia, serif'
                      }}>"</span>
                      <p style={{
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        margin: '10px 0 0 0',
                        color: '#333',
                        paddingLeft: '20px'
                      }}>
                        {review.reviewText}
                      </p>
                    </div>

                    {/* Footer */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid #f0f0f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: review.isAnonymous ? '#999' : color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {review.isAnonymous ? 'A' : 'U'}
                        </div>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>
                          {review.isAnonymous ? 'Anonymous' : 'Verified Employee'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#999' }}>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Review Number Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: color,
                      color: 'white',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      opacity: 0.9
                    }}>
                      {index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleReviews < reviews.length && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={loadMore}
                style={{
                  padding: '15px 40px',
                  background: 'transparent',
                  border: '2px solid #f6c23e',
                  color: '#f6c23e',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f6c23e';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#f6c23e';
                }}
              >
                Load More Reviews ({reviews.length - visibleReviews} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Quick Stats */}
      {reviews.length > 0 && (
        <div style={{
          marginTop: '50px',
          padding: '30px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f6c23e' }}>
              {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%
            </div>
            <div style={{ color: '#666' }}>Positive Reviews (4-5⭐)</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f6c23e' }}>
              {reviews.filter(r => r.isAnonymous).length}
            </div>
            <div style={{ color: '#666' }}>Anonymous Reviews</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f6c23e' }}>
              {new Date().toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div style={{ color: '#666' }}>Latest Reviews</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllReviews;