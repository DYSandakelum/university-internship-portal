import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function EmployerDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
        "averageRating": 4.5, 
        "totalReviews": 128,
        "industry": "Software Development",
        "location": "Colombo",
        "website": "https://techsolutions.lk",
        "founded": 2015
      },
      { 
        "_id": "2", 
        "companyName": "Eco Farms", 
        "description": "Sustainable agriculture company focused on organic farming and export of fresh produce.",
        "averageRating": 4.2, 
        "totalReviews": 56,
        "industry": "Agriculture",
        "location": "Kandy",
        "website": "https://ecofarms.lk",
        "founded": 2010
      },
      { 
        "_id": "3", 
        "companyName": "Rapid Travels", 
        "description": "Premier travel agency offering customized tour packages and visa assistance.",
        "averageRating": 3.8, 
        "totalReviews": 23,
        "industry": "Travel & Tourism",
        "location": "Colombo",
        "website": "https://rapidtravels.lk",
        "founded": 2018
      },
      { 
        "_id": "4", 
        "companyName": "CodeGen Innovations", 
        "description": "AI and machine learning startup developing solutions for healthcare.",
        "averageRating": 4.8, 
        "totalReviews": 92,
        "industry": "AI/ML",
        "location": "Negombo",
        "website": "https://codegen.lk",
        "founded": 2020
      }
    ];
    
    const allCompanies = [...defaultCompanies, ...savedCompanies];
    const foundCompany = allCompanies.find(c => c._id === id);
    setCompany(foundCompany);
    
    // Load reviews for this company
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const companyReviews = allReviews.filter(r => r.companyId === id);
    setReviews(companyReviews);
    setLoading(false);
  };

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <span style={{ color: '#f1c40f', fontSize: '1.2rem' }}>
        {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
      </span>
    );
  };

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
        <p>Loading company details...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
      {/* Company Header Card */}
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
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          <h3>About the Company</h3>
          <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>
            {company.description}
          </p>
          
          {company.website && (
            <p style={{ marginTop: '15px' }}>
              <strong>🌐 Website:</strong>{' '}
              <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                {company.website}
              </a>
            </p>
          )}

          {/* Rating Section */}
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
              {getRatingStars(company.averageRating)}
              <div style={{ color: '#666', marginTop: '5px' }}>
                Based on {company.totalReviews} {company.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
            <Link
              to={`/add-review/${company._id}`}
              style={{
                marginLeft: 'auto',
                padding: '12px 24px',
                background: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#45a049'}
              onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
            >
              ✏️ Write a Review
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Reviews</h2>
          <Link 
            to={`/reviews/${company._id}`}
            style={{ color: '#667eea', textDecoration: 'none' }}
          >
            View All Reviews →
          </Link>
        </div>
        
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No reviews yet for this company.</p>
            <Link 
              to={`/add-review/${company._id}`}
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}
            >
              Be the first to review!
            </Link>
          </div>
        ) : (
          reviews.slice(0, 3).map((review, index) => (
            <div key={review.id || index} style={{
              padding: '20px',
              borderBottom: index < Math.min(reviews.length, 3) - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <strong>{review.reviewerName || 'Anonymous'}</strong>
                  {review.position && <span style={{ color: '#999', marginLeft: '10px' }}>({review.position})</span>}
                </div>
                <div>
                  <span style={{ color: '#f1c40f' }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                  <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{review.rating}/5</span>
                </div>
              </div>
              <p style={{ color: '#555', lineHeight: '1.5', margin: '10px 0' }}>
                {review.comment}
              </p>
              <small style={{ color: '#999' }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        )}
        
        {reviews.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link 
              to={`/reviews/${company._id}`}
              style={{
                padding: '10px 20px',
                background: '#f0f0f0',
                color: '#667eea',
                textDecoration: 'none',
                borderRadius: '5px',
                display: 'inline-block'
              }}
            >
              Load All {reviews.length} Reviews
            </Link>
          </div>
        )}
      </div>
      
      {/* Back Button */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link 
          to="/employers"
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            display: 'inline-block'
          }}
        >
          ← Back to Companies
        </Link>
      </div>
    </div>
  );
}

export default EmployerDetails;