import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employerAPI, reviewAPI } from '../../services/api';

function EmployerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    studentId: 'student123',
    companyId: id,
    rating: 5,
    reviewText: '',
    isAnonymous: false
  });
  const [submitting, setSubmitting] = useState(false);

  // useCallback වලින් loadCompanyDetails define කරන්න
  const loadCompanyDetails = useCallback(async () => {
    setLoading(true);
    try {
      const companyRes = await employerAPI.getById(id);
      setCompany(companyRes.data.data);

      const reviewsRes = await reviewAPI.getByCompany(id);
      setReviews(reviewsRes.data.data || []);
      
      setError(null);
    } catch (err) {
      setError('Failed to load company details. Please try again.');
      console.error('Error loading details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]); // id dependency එක add කරන්න

  useEffect(() => {
    loadCompanyDetails();
  }, [loadCompanyDetails]); // loadCompanyDetails dependency එක add කරන්න

  const handleReviewChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setReviewData({
      ...reviewData,
      [e.target.name]: value
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewData.reviewText.trim()) {
      alert('Please write a review');
      return;
    }

    setSubmitting(true);
    try {
      await reviewAPI.create(reviewData);
      alert('Review added successfully!');
      setShowReviewForm(false);
      setReviewData({
        ...reviewData,
        rating: 5,
        reviewText: '',
        isAnonymous: false
      });
      loadCompanyDetails();
    } catch (err) {
      alert('Failed to add review. Please try again.');
      console.error('Error adding review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: '50px' }}>
        <div className="spinner"></div>
        <p>Loading company details...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          {error || 'Company not found'}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/employers')}
        >
          Back to Companies
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        className="btn btn-primary"
        onClick={() => navigate('/employers')}
        style={{ marginBottom: '20px' }}
      >
        ← Back to Companies
      </button>

      <div className="card">
        <div className="card-header">
          <h2>{company.companyName}</h2>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#4e73df', marginBottom: '15px' }}>About Company</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{company.description}</p>
          </div>

          <div className="company-meta" style={{ 
            display: 'flex', 
            gap: '30px', 
            flexWrap: 'wrap',
            padding: '20px',
            background: '#f8f9fc',
            borderRadius: '10px',
            marginBottom: '30px'
          }}>
            <div>
              <strong>Status:</strong>{' '}
              <span className={`badge badge-${company.verificationStatus}`}>
                {company.verificationStatus}
              </span>
            </div>
            <div>
              <strong>Average Rating:</strong>{' '}
              <span className="rating">
                {getRatingStars(Math.round(company.averageRating))} 
                ({company.averageRating.toFixed(1)})
              </span>
            </div>
            <div>
              <strong>Total Reviews:</strong> {company.totalReviews}
            </div>
            <div>
              <strong>Added on:</strong> {formatDate(company.createdAt)}
            </div>
          </div>

          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <h3 style={{ color: '#4e73df', margin: 0 }}>Reviews</h3>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link 
                  to={`/reviews/${company._id}`} 
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>📊</span>
                  View All Reviews 
                  <span style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.9rem'
                  }}>
                    {company.totalReviews || 0}
                  </span>
                </Link>

                <button 
                  className="btn btn-success"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>✏️</span>
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              </div>
            </div>

            {showReviewForm && (
              <div className="card" style={{ marginBottom: '30px' }}>
                <div className="card-body">
                  <h4>Write Your Review</h4>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <select
                        name="rating"
                        className="form-control"
                        value={reviewData.rating}
                        onChange={handleReviewChange}
                        disabled={submitting}
                        style={{ maxWidth: '200px' }}
                      >
                        {[5,4,3,2,1].map(num => (
                          <option key={num} value={num}>{num} Stars</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Review</label>
                      <textarea
                        name="reviewText"
                        className="form-control"
                        value={reviewData.reviewText}
                        onChange={handleReviewChange}
                        placeholder="Share your experience..."
                        rows="5"
                        disabled={submitting}
                        required
                      />
                    </div>

                    <div className="form-group">
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

                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="text-center" style={{ 
                padding: '60px 20px', 
                background: '#f8f9fc', 
                borderRadius: '10px',
                border: '2px dashed #dee2e6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
                <h4 style={{ color: '#666', marginBottom: '10px' }}>No Reviews Yet</h4>
                <p style={{ color: '#999', marginBottom: '20px' }}>
                  Be the first to share your experience!
                </p>
                <button 
                  className="btn btn-success"
                  onClick={() => setShowReviewForm(true)}
                >
                  Write First Review
                </button>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.slice(0, 3).map(review => (
                  <div key={review._id} className="card" style={{ marginBottom: '20px' }}>
                    <div className="card-body">
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <span style={{ color: '#f1c40f', fontSize: '1.2rem' }}>
                          {getRatingStars(review.rating)}
                        </span>
                        <small style={{ color: '#666' }}>
                          {formatDate(review.createdAt)}
                        </small>
                      </div>
                      
                      <p style={{ margin: '10px 0', lineHeight: '1.6' }}>
                        {review.reviewText}
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '10px',
                        paddingTop: '10px',
                        borderTop: '1px solid #e3e6f0'
                      }}>
                        <small style={{ color: '#999' }}>
                          {review.isAnonymous ? 'Anonymous' : 'Student'}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
                
                {reviews.length > 3 && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link 
                      to={`/reviews/${company._id}`} 
                      className="btn btn-outline-primary"
                      style={{
                        padding: '10px 30px',
                        borderRadius: '25px'
                      }}
                    >
                      View All {reviews.length} Reviews →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerDetails;