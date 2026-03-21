import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filterCompany, setFilterCompany] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load reviews from localStorage
    const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    // Load companies from localStorage
    const defaultCompanies = [
      { "_id": "1", "companyName": "Tech Solutions Lanka" },
      { "_id": "2", "companyName": "Eco Farms" },
      { "_id": "3", "companyName": "Rapid Travels" },
      { "_id": "4", "companyName": "CodeGen Innovations" }
    ];
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const allCompanies = [...defaultCompanies, ...savedCompanies];
    
    setCompanies(allCompanies);
    setReviews(savedReviews);
  };

  // Filter and sort reviews
  const getFilteredAndSortedReviews = () => {
    let filtered = [...reviews];
    
    // Filter by company
    if (filterCompany !== 'all') {
      filtered = filtered.filter(review => review.companyId === filterCompany);
    }
    
    // Sort reviews
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'highest') {
        return b.rating - a.rating;
      } else if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      return 0;
    });
    
    return filtered;
  };

  // Get company name by ID
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c._id === companyId);
    return company ? company.companyName : 'Unknown Company';
  };

  // Get company color
  const getCompanyColor = (companyId) => {
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#6610f2'];
    const index = (companyId?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get rating stars
  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const filteredReviews = getFilteredAndSortedReviews();

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const companiesWithReviews = new Set(reviews.map(r => r.companyId)).size;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
        borderRadius: '15px',
        padding: '30px',
        color: 'white',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>Review List</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          {totalReviews} reviews • {averageRating} average rating • {companiesWithReviews} companies
        </p>
      </div>

      {/* Filters and Sort */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        padding: '20px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        flexWrap: 'wrap'
      }}>
        {/* Filter by Company */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            Filter by Company:
          </label>
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}
          >
            <option value="all">All Companies</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

        {/* Add Review Button */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Link
            to="/add-review/select-company"
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}
          >
            + Write Review
          </Link>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          background: '#f9f9f9',
          borderRadius: '15px',
          border: '2px dashed #ddd'
        }}>
          <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '20px' }}>
            No reviews found.
          </p>
          <Link 
            to="/add-review/select-company"
            style={{
              padding: '12px 30px',
              background: '#4e73df',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            Write First Review
          </Link>
        </div>
      ) : (
        <div>
          {filteredReviews.map((review, index) => (
            <div key={review._id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '25px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative'
            }}>
              {/* Review Number Badge */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '20px',
                background: '#4e73df',
                color: 'white',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                #{index + 1}
              </div>

              {/* Company Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '2px solid #f0f0f0',
                marginTop: '10px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: getCompanyColor(review.companyId),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  {getCompanyName(review.companyId).charAt(0)}
                </div>
                <div>
                  <Link 
                    to={`/employer/${review.companyId}`}
                    style={{ 
                      color: '#333', 
                      textDecoration: 'none',
                      fontSize: '1.3rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {getCompanyName(review.companyId)}
                  </Link>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Company Review • {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div style={{ color: '#f1c40f', fontSize: '1.5rem' }}>
                  {getRatingStars(review.rating)}
                </div>
                <div style={{
                  background: '#e3e6f0',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {review.rating}.0 / 5.0
                </div>
              </div>

              {/* Review Text */}
              <div style={{
                background: '#f8f9fc',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '15px',
                borderLeft: '4px solid #4e73df'
              }}>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  margin: 0,
                  color: '#333',
                  fontStyle: 'italic'
                }}>
                  "{review.reviewText}"
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
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: review.isAnonymous ? '#999' : '#4e73df',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {review.isAnonymous ? 'A' : 'U'}
                  </div>
                  <span style={{ color: '#666' }}>
                    {review.isAnonymous ? 'Anonymous User' : 'Verified Student'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link 
                    to={`/reviews/${review.companyId}`}
                    style={{
                      padding: '8px 16px',
                      background: '#4e73df',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      fontSize: '0.9rem'
                    }}
                  >
                    View Company Reviews
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      {filteredReviews.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4e73df' }}>
              {filteredReviews.length}
            </div>
            <div style={{ color: '#666' }}>Showing Reviews</div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4e73df' }}>
              {(filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)}
            </div>
            <div style={{ color: '#666' }}>Average Rating</div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4e73df' }}>
              {new Set(filteredReviews.map(r => r.companyId)).size}
            </div>
            <div style={{ color: '#666' }}>Companies</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewList;