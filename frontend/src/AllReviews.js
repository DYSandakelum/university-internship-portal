import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appTheme } from './styles/theme';

function AllReviews() {
  const [reviews, setReviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(6);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');

    const defaultCompanies = [
      { "_id": "1", "companyName": "Tech Solutions Lanka", "industry": "Software", "location": "Colombo" },
      { "_id": "2", "companyName": "Eco Farms", "industry": "Agriculture", "location": "Kandy" },
      { "_id": "3", "companyName": "Rapid Travels", "industry": "Travel", "location": "Colombo" },
      { "_id": "4", "companyName": "CodeGen Innovations", "industry": "AI/ML", "location": "Negombo" }
    ];

    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    setCompanies([...defaultCompanies, ...savedCompanies]);
    setReviews(savedReviews);
  }, []);

  const theme = appTheme;

  const getCompanyDetails = (companyId) => {
    const company = companies.find((c) => c._id === companyId);
    return company || { companyName: 'Unknown Company', industry: 'Unknown', location: 'Unknown' };
  };

  const getRatingStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredReviews = reviews.filter((review) => {
    const company = getCompanyDetails(review.companyId);
    const haystack = `${company.companyName} ${review.title || ''} ${review.comment || ''}`.toLowerCase();
    const queryMatch = searchQuery.trim() === '' || haystack.includes(searchQuery.toLowerCase());
    const ratingMatch = minRating === '' || review.rating >= Number(minRating);
    const modeMatch = modeFilter === '' || (review.workMode || '').toLowerCase() === modeFilter.toLowerCase();
    return queryMatch && ratingMatch && modeMatch;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const visibleReviewsList = sortedReviews.slice(0, visibleReviews);
  const totalReviews = reviews.length;
  const totalFilteredReviews = filteredReviews.length;
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const companiesCount = new Set(reviews.map((r) => r.companyId)).size;

  const exportFilteredReviews = () => {
    if (sortedReviews.length === 0) {
      return;
    }

    const header = ['Company', 'Title', 'Rating', 'Mode', 'Position', 'Duration', 'Date'];
    const rows = sortedReviews.map((review) => {
      const company = getCompanyDetails(review.companyId);
      return [
        company.companyName,
        review.title || '',
        review.rating,
        review.workMode || '',
        review.position || '',
        review.internshipDuration || '',
        review.createdAt || ''
      ];
    });

    const csv = [header, ...rows]
      .map((cols) => cols.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filtered-reviews.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: theme.pageBg, minHeight: '100vh', padding: '28px 16px' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
          borderRadius: '14px',
          padding: '30px',
          color: 'white',
          border: `1px solid ${theme.primaryDark}`,
          boxShadow: '0 10px 24px rgba(23, 60, 93, 0.24)'
        }}>
          <h1 style={{ fontSize: '2rem', margin: '0 0 8px' }}>All Reviews</h1>
          <p style={{ margin: '0 0 20px', opacity: 0.92, lineHeight: 1.5 }}>
            Professional review records from internship experiences.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '700' }}>{totalReviews}</div>
              <div style={{ opacity: 0.9 }}>Total Reviews</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '700' }}>{averageRating}</div>
              <div style={{ opacity: 0.9 }}>Average Rating</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '700' }}>{companiesCount}</div>
              <div style={{ opacity: 0.9 }}>Companies</div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, title, or review text"
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                padding: '10px 12px',
                background: '#fff',
                color: theme.text,
                minWidth: '250px',
                flex: 1
              }}
            />
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                padding: '10px 12px',
                background: '#fff',
                color: theme.text,
                fontWeight: 600
              }}
            >
              <option value="">Any Rating</option>
              <option value="5">5 stars</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
            </select>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                padding: '10px 12px',
                background: '#fff',
                color: theme.text,
                fontWeight: 600
              }}
            >
              <option value="">All Modes</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                padding: '10px 12px',
                background: '#fff',
                color: theme.text,
                fontWeight: 600
              }}
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={exportFilteredReviews}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                color: theme.primary,
                background: '#fff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setMinRating('');
                setModeFilter('');
                setSortBy('newest');
              }}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                color: theme.primary,
                background: '#fff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
            <Link to="/student/AddReviews" style={{
              padding: '10px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              background: theme.primary,
              color: '#fff',
              fontWeight: 700,
              border: `1px solid ${theme.primaryDark}`
            }}>
              + Add Review
            </Link>
          </div>
        </div>

        <div style={{ marginBottom: '12px', color: theme.muted, fontSize: '0.9rem' }}>
          Showing {totalFilteredReviews} of {totalReviews} reviews
        </div>

        {visibleReviewsList.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 20px',
            background: theme.panelBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '12px'
          }}>
            <p style={{ fontSize: '1.05rem', color: theme.muted, marginBottom: '16px' }}>
              No reviews yet. Be the first to share your experience.
            </p>
            <Link to="/student/AddReviews" style={{
              padding: '10px 16px',
              background: theme.primary,
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 700
            }}>
              Write Review
            </Link>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(355px, 1fr))',
              gap: '16px'
            }}>
              {visibleReviewsList.map((review, index) => {
                const company = getCompanyDetails(review.companyId);

                return (
                  <div key={review.id || index} style={{
                    background: theme.panelBg,
                    borderRadius: '12px',
                    border: `1px solid ${theme.border}`,
                    overflow: 'hidden',
                    boxShadow: '0 6px 18px rgba(31, 79, 122, 0.08)',
                    position: 'relative'
                  }}>
                    <div style={{ height: '6px', background: theme.primary, width: '100%' }}></div>
                    <div style={{ padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '10px',
                          background: theme.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }}>
                          {company.companyName.charAt(0)}
                        </div>
                        <div>
                          <Link to={`/reviews/${review.companyId}`} style={{
                            color: theme.text,
                            textDecoration: 'none',
                            fontSize: '1.03rem',
                            fontWeight: '700',
                            display: 'block'
                          }}>
                            {company.companyName}
                          </Link>
                          <div style={{ fontSize: '0.82rem', color: theme.muted }}>
                            {company.industry} • {company.location}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                        padding: '8px 10px',
                        background: theme.primarySoft,
                        borderRadius: '8px',
                        border: `1px solid ${theme.border}`
                      }}>
                        <div style={{ color: theme.accent, fontSize: '1.1rem' }}>{getRatingStars(review.rating)}</div>
                        <div style={{
                          background: theme.primary,
                          color: 'white',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: '700'
                        }}>
                          {getRatingDescription(review.rating)}
                        </div>
                      </div>

                      {review.title && (
                        <h4 style={{ margin: '0 0 8px', color: theme.text, fontSize: '1rem' }}>{review.title}</h4>
                      )}

                      <div style={{
                        background: '#f8fafc',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        border: `1px solid ${theme.border}`
                      }}>
                        <p style={{ fontSize: '0.94rem', lineHeight: '1.55', margin: 0, color: '#334155' }}>
                          {review.comment || 'No comment provided'}
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.8rem', color: theme.muted }}>
                          <strong style={{ color: '#475569' }}>Position:</strong> {review.position || 'N/A'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: theme.muted }}>
                          <strong style={{ color: '#475569' }}>Duration:</strong> {review.internshipDuration || 'N/A'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: theme.muted }}>
                          <strong style={{ color: '#475569' }}>Mode:</strong> {review.workMode || 'N/A'}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '10px',
                        borderTop: `1px solid ${theme.border}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: review.isAnonymous ? '#94a3b8' : theme.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: 'bold'
                          }}>
                            {review.isAnonymous ? 'A' : (review.reviewerName ? review.reviewerName.charAt(0) : 'U')}
                          </div>
                          <span style={{ fontSize: '0.82rem', color: theme.muted }}>
                            {review.isAnonymous ? 'Anonymous' : (review.reviewerName || 'Verified User')}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{formatDate(review.createdAt)}</span>
                      </div>

                      <div style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        background: '#e6edf5',
                        color: theme.primary,
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        {index + 1}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {visibleReviews < sortedReviews.length && (
              <div style={{ textAlign: 'center', marginTop: '18px' }}>
                <button
                  onClick={() => setVisibleReviews((prev) => prev + 3)}
                  style={{
                    padding: '10px 20px',
                    background: '#fff',
                    border: `1px solid ${theme.primary}`,
                    color: theme.primary,
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Load More Reviews ({sortedReviews.length - visibleReviews} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AllReviews;
