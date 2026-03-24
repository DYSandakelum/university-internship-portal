import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AddReview() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    reviewerName: '',
    isAnonymous: false,
    position: '',
    internshipDuration: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // Step 1: Select Company, Step 2: Write Review

  // Load companies
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const defaultCompanies = [
      { "_id": "1", "companyName": "Tech Solutions Lanka", "industry": "Software", "location": "Colombo" },
      { "_id": "2", "companyName": "Eco Farms", "industry": "Agriculture", "location": "Kandy" },
      { "_id": "3", "companyName": "Rapid Travels", "industry": "Travel", "location": "Colombo" },
      { "_id": "4", "companyName": "CodeGen Innovations", "industry": "AI/ML", "location": "Negombo" }
    ];
    setCompanies([...defaultCompanies, ...savedCompanies]);
  };

  const handleCompanySelect = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    const company = companies.find(c => c._id === companyId);
    if (company) {
      setSelectedCompanyName(company.companyName);
    }
    if (errors.company) {
      setErrors({ ...errors, company: '' });
    }
  };

  const handleNext = () => {
    if (!selectedCompany) {
      setErrors({ ...errors, company: 'Please select a company' });
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please write your review';
    } else if (formData.comment.length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
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

    const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    const newReview = {
      id: Date.now().toString(),
      companyId: selectedCompany,
      companyName: selectedCompanyName,
      rating: formData.rating,
      comment: formData.comment,
      reviewerName: formData.isAnonymous ? 'Anonymous' : (formData.reviewerName || 'Student'),
      isAnonymous: formData.isAnonymous,
      position: formData.position,
      internshipDuration: formData.internshipDuration,
      createdAt: new Date().toISOString()
    };

    existingReviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(existingReviews));

    // Update company stats
    const companyReviews = existingReviews.filter(r => r.companyId === selectedCompany);
    const totalReviews = companyReviews.length;
    const averageRating = totalReviews > 0 
      ? (companyReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;

    const allCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const companyIndex = allCompanies.findIndex(c => c._id === selectedCompany);
    if (companyIndex !== -1) {
      allCompanies[companyIndex].totalReviews = totalReviews;
      allCompanies[companyIndex].averageRating = parseFloat(averageRating);
      localStorage.setItem('companies', JSON.stringify(allCompanies));
    }

    setTimeout(() => {
      setSubmitting(false);
      navigate('/company-reviews');
    }, 500);
  };

  const getRatingStars = (rating) => {
    return (
      <span style={{ color: '#f1c40f', fontSize: '2rem' }}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    );
  };

  const styles = {
    container: {
      maxWidth: '700px',
      margin: '50px auto',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #f6c23e 0%, #f4a100 100%)',
      padding: '30px',
      color: 'white',
      textAlign: 'center'
    },
    headerTitle: {
      fontSize: '1.8rem',
      margin: 0
    },
    headerSub: {
      margin: '10px 0 0',
      opacity: 0.9
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      padding: '20px',
      background: '#f8f9fc',
      borderBottom: '1px solid #e0e0e0'
    },
    step: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    stepNumber: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    },
    stepActive: {
      background: '#f6c23e',
      color: 'white'
    },
    stepInactive: {
      background: '#e0e0e0',
      color: '#666'
    },
    stepComplete: {
      background: '#4CAF50',
      color: 'white'
    },
    form: {
      padding: '30px'
    },
    formGroup: {
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#333'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: `2px solid ${errors.company ? '#e74a3b' : '#e0e0e0'}`,
      borderRadius: '10px',
      fontSize: '1rem',
      background: 'white'
    },
    ratingContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    star: {
      fontSize: '2.5rem',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: `2px solid ${errors.comment ? '#e74a3b' : '#e0e0e0'}`,
      borderRadius: '10px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '120px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '1rem'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer'
    },
    errorText: {
      color: '#e74a3b',
      fontSize: '0.85rem',
      marginTop: '5px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px'
    },
    btnPrimary: {
      flex: 1,
      padding: '14px',
      background: '#f6c23e',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    btnSecondary: {
      flex: 1,
      padding: '14px',
      background: '#e0e0e0',
      color: '#666',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>⭐ Write a Review</h1>
          <p style={styles.headerSub}>Share your internship experience</p>
        </div>

        {/* Step Indicator */}
        <div style={styles.stepIndicator}>
          <div style={styles.step}>
            <div style={{...styles.stepNumber, ...(step >= 1 ? styles.stepActive : styles.stepInactive)}}>1</div>
            <span>Select Company</span>
          </div>
          <div style={styles.step}>
            <div style={{...styles.stepNumber, ...(step >= 2 ? styles.stepActive : styles.stepInactive)}}>2</div>
            <span>Write Review</span>
          </div>
        </div>

        {/* Step 1: Select Company */}
        {step === 1 && (
          <div style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Company</label>
              <select
                value={selectedCompany}
                onChange={handleCompanySelect}
                style={styles.select}
              >
                <option value="">Choose a company</option>
                {companies.map(company => (
                  <option key={company._id} value={company._id}>
                    {company.companyName} - {company.industry} ({company.location})
                  </option>
                ))}
              </select>
              {errors.company && <div style={styles.errorText}>{errors.company}</div>}
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleNext}
                style={styles.btnPrimary}
              >
                Next →
              </button>
              <Link to="/" style={{...styles.btnSecondary, textDecoration: 'none', textAlign: 'center'}}>
                Cancel
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Write Review */}
        {step === 2 && (
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Company Display */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Company</label>
              <div style={{
                padding: '12px',
                background: '#f8f9fc',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                fontWeight: 'bold',
                color: '#333'
              }}>
                {selectedCompanyName}
              </div>
            </div>

            {/* Rating with Stars */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Rating</label>
              <div style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    style={{
                      ...styles.star,
                      color: star <= formData.rating ? '#f1c40f' : '#ddd'
                    }}
                  >
                    ★
                  </span>
                ))}
                <span style={{ marginLeft: '10px', color: '#666' }}>{formData.rating}/5</span>
              </div>
            </div>

            {/* Review Text */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Your Review *</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Share your internship experience... (Minimum 10 characters)"
                style={styles.textarea}
              />
              {errors.comment && <div style={styles.errorText}>{errors.comment}</div>}
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                {formData.comment.length} / 500 characters
              </div>
            </div>

            {/* Position */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Position / Role</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Software Engineering Intern, Marketing Intern"
                style={styles.input}
              />
            </div>

            {/* Internship Duration */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Internship Duration</label>
              <input
                type="text"
                name="internshipDuration"
                value={formData.internshipDuration}
                onChange={handleChange}
                placeholder="e.g., 3 months, 6 months, 1 year"
                style={styles.input}
              />
            </div>

            {/* Anonymous Checkbox */}
            <div style={styles.formGroup}>
              <label style={styles.checkbox}>
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>Post anonymously (you can send text alerts)</span>
              </label>
            </div>

            {!formData.isAnonymous && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text"
                  name="reviewerName"
                  value={formData.reviewerName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  style={styles.input}
                />
              </div>
            )}

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleBack}
                style={styles.btnSecondary}
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.btnPrimary,
                  background: submitting ? '#ccc' : '#f6c23e',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddReview;