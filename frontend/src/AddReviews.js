import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AddReview() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [formData, setFormData] = useState({
    rating: 5,
    reviewText: '',
    isAnonymous: false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load companies from localStorage
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const defaultCompanies = [
      { "_id": "1", "companyName": "Tech Solutions Lanka" },
      { "_id": "2", "companyName": "Eco Farms" },
      { "_id": "3", "companyName": "Rapid Travels" },
      { "_id": "4", "companyName": "CodeGen Innovations" }
    ];
    setCompanies([...defaultCompanies, ...savedCompanies]);
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    if (errors.company) {
      setErrors({ ...errors, company: '' });
    }
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleReviewChange = (e) => {
    const text = e.target.value;
    setFormData({ ...formData, reviewText: text });
    
    // Validate character limit
    if (text.length > 500) {
      setErrors({ ...errors, reviewText: 'Maximum 500 characters' });
    } else if (text.length < 10 && text.length > 0) {
      setErrors({ ...errors, reviewText: 'Minimum 10 characters required' });
    } else {
      setErrors({ ...errors, reviewText: '' });
    }
  };

  const handleAnonymousChange = (e) => {
    setFormData({ ...formData, isAnonymous: e.target.checked });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedCompany) {
      newErrors.company = 'Please select a company';
    }
    
    if (!formData.reviewText.trim()) {
      newErrors.reviewText = 'Please write your review';
    } else if (formData.reviewText.length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters';
    } else if (formData.reviewText.length > 500) {
      newErrors.reviewText = 'Review cannot exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    // Get existing reviews
    const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    // Create new review
    const newReview = {
      id: Date.now().toString(),
      companyId: selectedCompany,
      rating: formData.rating,
      comment: formData.reviewText,
      isAnonymous: formData.isAnonymous,
      reviewerName: formData.isAnonymous ? 'Anonymous' : 'Verified User',
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    existingReviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(existingReviews));
    
    // Update company review count and average rating
    updateCompanyStats(selectedCompany);
    
    setTimeout(() => {
      setSubmitting(false);
      navigate(`/employer/${selectedCompany}`);
    }, 500);
  };

  const updateCompanyStats = (companyId) => {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const companyReviews = allReviews.filter(r => r.companyId === companyId);
    
    const totalReviews = companyReviews.length;
    const averageRating = totalReviews > 0 
      ? (companyReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;
    
    // Update company in localStorage
    const allCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const companyIndex = allCompanies.findIndex(c => c._id === companyId);
    
    if (companyIndex !== -1) {
      allCompanies[companyIndex].totalReviews = totalReviews;
      allCompanies[companyIndex].averageRating = parseFloat(averageRating);
      localStorage.setItem('companies', JSON.stringify(allCompanies));
    }
  };

  const getCompanyName = () => {
    const company = companies.find(c => c._id === selectedCompany);
    return company ? company.companyName : 'Select a company';
  };

  const styles = {
    container: {
      maxWidth: '700px',
      margin: '50px auto',
      padding: '30px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
    },
    header: {
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '2px solid #f0f0f0'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    formGroup: {
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#555',
      fontSize: '1rem'
    },
    select: {
      width: '100%',
      padding: '12px 15px',
      border: `2px solid ${errors.company ? '#e74a3b' : '#e0e0e0'}`,
      borderRadius: '10px',
      fontSize: '1rem',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    ratingContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      padding: '10px 0'
    },
    star: {
      fontSize: '2.5rem',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    textarea: {
      width: '100%',
      padding: '12px 15px',
      border: `2px solid ${errors.reviewText ? '#e74a3b' : '#e0e0e0'}`,
      borderRadius: '10px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '120px',
      transition: 'all 0.3s'
    },
    charCount: {
      textAlign: 'right',
      fontSize: '0.85rem',
      marginTop: '5px',
      color: formData.reviewText.length > 500 ? '#e74a3b' : '#999'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '25px'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer'
    },
    checkboxLabel: {
      color: '#555',
      cursor: 'pointer'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px'
    },
    submitBtn: {
      flex: 1,
      padding: '14px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    cancelBtn: {
      flex: 1,
      padding: '14px',
      background: '#f0f0f0',
      color: '#666',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      textDecoration: 'none',
      textAlign: 'center',
      transition: 'background 0.2s'
    },
    errorText: {
      color: '#e74a3b',
      fontSize: '0.85rem',
      marginTop: '5px'
    },
    successMessage: {
      background: '#d4edda',
      color: '#155724',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⭐ Write a Review</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Select Company */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Company</label>
          <select 
            value={selectedCompany} 
            onChange={handleCompanyChange}
            style={styles.select}
          >
            <option value="">Choose a company</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
          {errors.company && <div style={styles.errorText}>{errors.company}</div>}
        </div>

        {/* Rating */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Rating</label>
          <div style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                onClick={() => handleRatingChange(star)}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                style={{
                  ...styles.star,
                  color: star <= formData.rating ? '#f1c40f' : '#ddd',
                  transform: 'scale(1)'
                }}
              >
                ★
              </span>
            ))}
            <span style={{ marginLeft: '10px', color: '#666' }}>
              {formData.rating}/5
            </span>
          </div>
        </div>

        {/* Your Review */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Your Review</label>
          <textarea
            value={formData.reviewText}
            onChange={handleReviewChange}
            placeholder="Share your experience with this company..."
            style={styles.textarea}
            maxLength="500"
          />
          <div style={styles.charCount}>
            {formData.reviewText.length} / 500 characters
            {formData.reviewText.length < 10 && formData.reviewText.length > 0 && (
              <span style={{ color: '#e74a3b', marginLeft: '10px' }}>
                (Minimum 10 characters required)
              </span>
            )}
          </div>
          {errors.reviewText && <div style={styles.errorText}>{errors.reviewText}</div>}
        </div>

        {/* Anonymous Checkbox */}
        <div style={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.isAnonymous}
            onChange={handleAnonymousChange}
            style={styles.checkbox}
          />
          <label htmlFor="anonymous" style={styles.checkboxLabel}>
            Post anonymously (you can send text alerts)
          </label>
        </div>

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.submitBtn,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
          
          <Link
            to="/employers"
            style={styles.cancelBtn}
            onMouseEnter={(e) => e.target.style.background = '#e0e0e0'}
            onMouseLeave={(e) => e.target.style.background = '#f0f0f0'}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddReview;