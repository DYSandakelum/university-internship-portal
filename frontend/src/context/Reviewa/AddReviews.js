import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddReview() {
  const navigate = useNavigate();
  
  // Get companies from localStorage
  const [companies] = useState(() => {
    const defaultCompanies = [
      {
        "_id": "1",
        "companyName": "Tech Solutions Lanka"
      },
      {
        "_id": "2", 
        "companyName": "Eco Farms"
      },
      {
        "_id": "3",
        "companyName": "Rapid Travels"
      },
      {
        "_id": "4",
        "companyName": "CodeGen Innovations"
      }
    ];
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    return [...defaultCompanies, ...savedCompanies];
  });

  // Form state
  const [formData, setFormData] = useState({
    companyId: '',
    rating: 0,
    reviewText: '',
    isAnonymous: false
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handle rating click
  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: rating
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyId) {
      newErrors.companyId = 'Please select a company';
    }
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (!formData.reviewText.trim()) {
      newErrors.reviewText = 'Please write a review';
    } else if (formData.reviewText.trim().length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters';
    }
    return newErrors;
  };

  // Handle submit - UPDATE කරපු කොටස
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save review to localStorage
    const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const newReview = {
      ...formData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('reviews', JSON.stringify([...existingReviews, newReview]));

    alert('Review added successfully!');
    
    // Submit කරාම company එකේ reviews page එකට යන්න
    navigate(`/reviews/${formData.companyId}`);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        Write a Review
      </h2>

      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {/* Company Selection */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            Select Company <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.companyId ? 'red' : '#ddd'}`,
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="">-- Choose a company --</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
          {errors.companyId && (
            <small style={{ color: 'red', marginTop: '5px', display: 'block' }}>
              {errors.companyId}
            </small>
          )}
        </div>

        {/* Rating Stars */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            Rating <span style={{ color: 'red' }}>*</span>
          </label>
          
          {/* Stars Container */}
          <div style={{ 
            display: 'flex', 
            gap: '10px',
            fontSize: '35px',
            cursor: 'pointer'
          }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  color: (hoverRating || formData.rating) >= star ? '#f1c40f' : '#ddd',
                  transition: 'color 0.2s',
                  cursor: 'pointer'
                }}
              >
                ★
              </span>
            ))}
          </div>
          
          {/* Rating Text */}
          <div style={{ marginTop: '10px', color: '#666' }}>
            {formData.rating === 1 && '😞 Poor'}
            {formData.rating === 2 && '😐 Average'}
            {formData.rating === 3 && '🙂 Good'}
            {formData.rating === 4 && '😊 Very Good'}
            {formData.rating === 5 && '🤩 Excellent'}
          </div>
          
          {errors.rating && (
            <small style={{ color: 'red', marginTop: '5px', display: 'block' }}>
              {errors.rating}
            </small>
          )}
        </div>

        {/* Review Text */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            Your Review <span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            name="reviewText"
            value={formData.reviewText}
            onChange={handleChange}
            placeholder="Share your experience with this company..."
            rows="6"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.reviewText ? 'red' : '#ddd'}`,
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
          {errors.reviewText && (
            <small style={{ color: 'red', marginTop: '5px', display: 'block' }}>
              {errors.reviewText}
            </small>
          )}
          <small style={{ color: '#999', marginTop: '5px', display: 'block' }}>
            Minimum 10 characters
          </small>
        </div>

        {/* Anonymous Option */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            <span style={{ color: '#333' }}>
              Post anonymously <small style={{ color: '#999' }}>(your name won't be shown)</small>
            </span>
          </label>
        </div>

        {/* Form Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px',
          marginTop: '30px'
        }}>
          <button type="submit" style={{
            flex: 1,
            padding: '14px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}>
            Submit Review
          </button>
          
          <button type="button" onClick={() => navigate('/')} style={{
            flex: 1,
            padding: '14px',
            background: '#e74a3b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}>
            Cancel
          </button>
        </div>
      </form>

      {/* Preview Section */}
      {formData.reviewText && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#f8f9fc',
          borderRadius: '8px',
          border: '1px solid #e3e6f0'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#333' }}>Preview:</h4>
          
          {/* Company Name */}
          <div style={{ marginBottom: '10px' }}>
            <strong>Company:</strong>{' '}
            {companies.find(c => c._id === formData.companyId)?.companyName || 'Not selected'}
          </div>
          
          {/* Rating Preview */}
          <div style={{ marginBottom: '10px' }}>
            <strong>Rating:</strong>{' '}
            <span style={{ color: '#f1c40f', fontSize: '1.2rem' }}>
              {'★'.repeat(formData.rating)}{'☆'.repeat(5 - formData.rating)}
            </span>
          </div>
          
          {/* Review Text Preview */}
          <div style={{ marginBottom: '10px' }}>
            <strong>Review:</strong>
            <p style={{ 
              margin: '5px 0 0 0',
              padding: '15px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #e3e6f0'
            }}>
              {formData.reviewText}
            </p>
          </div>
          
          {/* Anonymous Preview */}
          <div style={{ color: '#999', fontSize: '0.9rem' }}>
            {formData.isAnonymous ? 'Posting anonymously' : 'Posting with your name'}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddReview;