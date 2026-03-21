import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ReviewDisplay() {
  const { companyId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // 🔹 Load company name when companyId changes
  useEffect(() => {
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
  }, [companyId]);

  // 🔹 Load & sort reviews when companyId or sortBy changes
  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const companyReviews = allReviews.filter(
      review => review.companyId === companyId
    );

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

  // 🔹 Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // 🔹 Helpers
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

  const getRatingStars = (rating) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1>{companyName}</h1>
            <p>
              {reviews.length} Reviews • Average Rating: {averageRating} ⭐
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
              fontWeight: 'bold'
            }}
          >
            + Write a Review
          </Link>
        </div>
      </div>

      {/* Sort */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <select value={sortBy} onChange={handleSortChange}>
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>

        <Link to="/employers">← Back</Link>
      </div>

      {/* Reviews */}
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(review => (
          <div
            key={review._id}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '15px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#f1c40f', fontSize: '1.3rem' }}>
                {getRatingStars(review.rating)}
              </span>
              <small>{formatDate(review.createdAt)}</small>
            </div>

            <p>{review.reviewText}</p>

            <small>
              {review.isAnonymous ? 'Anonymous User' : 'Verified Student'}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewDisplay;