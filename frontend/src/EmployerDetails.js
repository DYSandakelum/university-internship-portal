import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function EmployerDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    reviewerName: '',
    isAnonymous: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = () => {
    // Load companies from localStorage
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    
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

    const allCompanies = [...defaultCompanies, ...savedCompanies];
    const foundCompany = allCompanies.find(c => c._id === id);
    setCompany(foundCompany);

    // Load reviews
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const companyReviews = allReviews.filter(r => r.companyId === id);
    setReviews(companyReviews);
    setLoading(false);
  };

  const handleReviewChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setReviewData({
      ...reviewData,
      [e.target.name]: value
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!reviewData.comment.trim()) {
      alert('Please write a review');
      return;
    }

    setSubmitting(true);
    
    // Get existing reviews
    const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    // Create new review
    const newReview = {
      id: Date.now().toString(),
      companyId: id,
      rating: reviewData.rating,
      comment: reviewData.comment,
      reviewerName: reviewData.isAnonymous ? 'Anonymous' : (reviewData.reviewerName || 'Student'),
      isAnonymous: reviewData.isAnonymous,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    existingReviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(existingReviews));
    
    // Update company stats
    updateCompanyStats();
    
    alert('Review added successfully!');
    setShowReviewForm(false);
    setReviewData({
      rating: 5,
      comment: '',
      reviewerName: '',
      isAnonymous: false
    });
    loadData();
    setSubmitting(false);
  };

  const updateCompanyStats = () => {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const companyReviews = allReviews.filter(r => r.companyId === id);
    const totalReviews = companyReviews.length;
    const averageRating = totalReviews > 0 
      ? (companyReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;
    
    // Update company in localStorage
    const allCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const companyIndex = allCompanies.findIndex(c => c._id === id);
    
    if (companyIndex !== -1) {
      allCompanies[companyIndex].totalReviews = totalReviews;
      allCompanies[companyIndex].averageRating = parseFloat(averageRating);
      localStorage.setItem('companies', JSON.stringify(allCompanies));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading company details...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Company not found</h2>
        <Link to="/employers" style={{ color: '#667eea' }}>Back to Companies</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <button 
        onClick={() => window.location.href = '/employers'}
        style={{
          padding: '10px 20px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        ← Back to Companies
      </button>

      {/* Company Header */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          color: 'white'
        }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>{company.companyName}</h1>
          <div style={{ marginTop: '15px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {company.industry && <span>🏭 {company.industry}</span>}
            {company.location && <span>📍 {company.location}</span>}
            {company.founded && <span>📅 Founded {company.founded}</span>}
            {company.employees && <span>👥 {company.employees}</span>}
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          <h3>About Company</h3>
          <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>
            {company.description}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '20px 0',
            borderTop: '1px solid #f0f0f0',
            borderBottom: '1px solid #f0f0f0',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>
              {company.averageRating}
            </div>
            <div>
              <span style={{ color: '#f1c40f', fontSize: '1.2rem' }}>
                {getRatingStars(Math.round(company.averageRating))}
              </span>
              <div style={{ color: '#666', marginTop: '5px' }}>
                Based on {company.totalReviews} {company.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                background: company.verificationStatus === 'verified' ? '#d4edda' : '#fff3cd',
                color: company.verificationStatus === 'verified' ? '#155724' : '#856404'
              }}>
                {company.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>

          {company.website && (
            <p style={{ marginTop: '15px' }}>
              <strong>🌐 Website:</strong>{' '}
              <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                {company.website}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ margin: 0 }}>Reviews</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link 
              to={`/reviews/${company._id}`}
              style={{
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              View All Reviews ({reviews.length})
            </Link>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={{
                padding: '10px 20px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div style={{
            background: '#f8f9fc',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Write Your Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Rating</label>
                <select
                  name="rating"
                  value={reviewData.rating}
                  onChange={handleReviewChange}
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    maxWidth: '200px'
                  }}
                >
                  <option value="5">★★★★★ (5)</option>
                  <option value="4">★★★★☆ (4)</option>
                  <option value="3">★★★☆☆ (3)</option>
                  <option value="2">★★☆☆☆ (2)</option>
                  <option value="1">★☆☆☆☆ (1)</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Your Review</label>
                <textarea
                  name="comment"
                  value={reviewData.comment}
                  onChange={handleReviewChange}
                  placeholder="Share your experience..."
                  rows="5"
                  disabled={submitting}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={reviewData.isAnonymous}
                    onChange={handleReviewChange}
                    disabled={submitting}
                  />
                  Post anonymously
                </label>
              </div>

              {!reviewData.isAnonymous && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Your Name (Optional)</label>
                  <input
                    type="text"
                    name="reviewerName"
                    value={reviewData.reviewerName}
                    onChange={handleReviewChange}
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={submitting}
                style={{
                  padding: '12px 30px',
                  background: submitting ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8f9fc', borderRadius: '12px' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.slice(0, 3).map(review => (
            <div key={review.id} style={{
              padding: '20px',
              borderBottom: '1px solid #f0f0f0',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <strong>{review.reviewerName || 'Student'}</strong>
                  {review.isAnonymous && <span style={{ color: '#999', marginLeft: '10px' }}>(Anonymous)</span>}
                </div>
                <div>
                  <span style={{ color: '#f1c40f' }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                  <span style={{ marginLeft: '8px' }}>{review.rating}/5</span>
                </div>
              </div>
              <p style={{ color: '#555', lineHeight: '1.5', margin: '10px 0' }}>{review.comment}</p>
              <small style={{ color: '#999' }}>{formatDate(review.createdAt)}</small>
            </div>
          ))
        )}

        {reviews.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link 
              to={`/reviews/${company._id}`}
              style={{
                padding: '10px 30px',
                background: '#f0f0f0',
                color: '#667eea',
                textDecoration: 'none',
                borderRadius: '25px',
                display: 'inline-block'
              }}
            >
              View All {reviews.length} Reviews →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerDetails;