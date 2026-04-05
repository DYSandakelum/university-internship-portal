import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { appTheme } from './styles/theme';

const REVIEW_DRAFT_KEY = 'reviewDraft.v1';

function AddReview() {
  const navigate = useNavigate();
  const theme = appTheme;
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [formData, setFormData] = useState({
    rating: 5,
    reviewTitle: '',
    reviewText: '',
    position: '',
    internshipDuration: '',
    workMode: 'On-site',
    isAnonymous: false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [draftNotice, setDraftNotice] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  // Load companies from localStorage
  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    const rawDraft = localStorage.getItem(REVIEW_DRAFT_KEY);
    if (!rawDraft) {
      return;
    }

    try {
      const draft = JSON.parse(rawDraft);
      if (draft && typeof draft === 'object') {
        if (draft.selectedCompany) {
          setSelectedCompany(draft.selectedCompany);
        }
        if (draft.formData) {
          setFormData((prev) => ({ ...prev, ...draft.formData }));
        }
        setDraftNotice('Draft restored from your previous session.');
      }
    } catch (_error) {
      localStorage.removeItem(REVIEW_DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    const draftPayload = {
      selectedCompany,
      formData
    };
    localStorage.setItem(REVIEW_DRAFT_KEY, JSON.stringify(draftPayload));
  }, [selectedCompany, formData]);

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
    if (errors.rating) {
      setErrors({ ...errors, rating: '' });
    }
  };

  const validateField = (name, value) => {
    if (name === 'reviewTitle') {
      const trimmed = value.trim();
      if (!trimmed) return 'Review title is required';
      if (trimmed.length < 5) return 'Title must be at least 5 characters';
      if (trimmed.length > 80) return 'Title cannot exceed 80 characters';
    }

    if (name === 'reviewText') {
      const trimmed = value.trim();
      if (!trimmed) return 'Please write your review';
      if (trimmed.length < 30) return 'Review must be at least 30 characters';
      if (trimmed.length > 1000) return 'Review cannot exceed 1000 characters';
    }

    if (name === 'position') {
      const trimmed = value.trim();
      if (!trimmed) return 'Position is required';
      if (trimmed.length < 2) return 'Position is too short';
      if (trimmed.length > 60) return 'Position cannot exceed 60 characters';
    }

    if (name === 'internshipDuration') {
      if (!value) return 'Please select internship duration';
    }

    return '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue
    }));

    if (name !== 'isAnonymous' && name !== 'workMode') {
      const message = validateField(name, nextValue);
      setErrors((prev) => ({
        ...prev,
        [name]: message
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedCompany) {
      newErrors.company = 'Please select a company';
    }

    if (!Number.isInteger(formData.rating) || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a valid rating';
    }
    
    newErrors.reviewTitle = validateField('reviewTitle', formData.reviewTitle);
    newErrors.reviewText = validateField('reviewText', formData.reviewText);
    newErrors.position = validateField('position', formData.position);
    newErrors.internshipDuration = validateField('internshipDuration', formData.internshipDuration);

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });
    
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
      title: formData.reviewTitle.trim(),
      comment: formData.reviewText.trim(),
      position: formData.position.trim(),
      internshipDuration: formData.internshipDuration,
      workMode: formData.workMode,
      isAnonymous: formData.isAnonymous,
      reviewerName: formData.isAnonymous ? 'Anonymous' : 'Verified User',
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    existingReviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(existingReviews));
    localStorage.removeItem(REVIEW_DRAFT_KEY);
    
    // Update company review count and average rating
    updateCompanyStats(selectedCompany);
    
    setTimeout(() => {
      setSubmitting(false);
      navigate(`/reviews/${selectedCompany}`);
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

  const styles = {
    container: {
      maxWidth: '860px',
      margin: '40px auto',
      padding: '24px'
    },
    shell: {
      background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
      border: `1px solid ${theme.border}`,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)'
    },
    header: {
      marginBottom: '30px',
      padding: '28px 28px 20px',
      borderBottom: `1px solid ${theme.border}`,
      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
      color: '#fff'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      margin: 0
    },
    subtitle: {
      marginTop: '8px',
      color: 'rgba(255,255,255,0.85)',
      fontSize: '0.95rem'
    },
    subActions: {
      marginTop: '10px',
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    tinyBtn: {
      border: '1px solid rgba(255,255,255,0.35)',
      background: 'rgba(255,255,255,0.12)',
      color: '#fff',
      borderRadius: '20px',
      padding: '6px 12px',
      fontSize: '0.8rem',
      cursor: 'pointer'
    },
    form: {
      padding: '28px'
    },
    draftBanner: {
      background: '#fff7e6',
      border: `1px solid ${theme.accent}`,
      color: '#8a5a00',
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '0.88rem',
      marginBottom: '14px'
    },
    section: {
      background: '#fff',
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      padding: '18px',
      marginBottom: '18px'
    },
    sectionTitle: {
      margin: '0 0 14px 0',
      fontSize: '1rem',
      fontWeight: '700',
      color: theme.primary
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    },
    formGroup: {
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#475569',
      fontSize: '0.95rem'
    },
    select: {
      width: '100%',
      padding: '11px 12px',
      border: `1px solid ${errors.company ? '#dc2626' : theme.border}`,
      borderRadius: '8px',
      fontSize: '0.95rem',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    input: {
      width: '100%',
      padding: '11px 12px',
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      fontSize: '0.95rem',
      outline: 'none'
    },
    ratingContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      padding: '6px 0'
    },
    star: {
      fontSize: '2rem',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    textarea: {
      width: '100%',
      padding: '11px 12px',
      border: `1px solid ${errors.reviewText ? '#dc2626' : theme.border}`,
      borderRadius: '8px',
      fontSize: '0.95rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '140px',
      transition: 'all 0.3s'
    },
    charCount: {
      textAlign: 'right',
      fontSize: '0.85rem',
      marginTop: '5px',
      color: formData.reviewText.length > 1000 ? '#e74a3b' : '#64748b'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '4px'
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
      marginTop: '8px'
    },
    submitBtn: {
      flex: 1,
      padding: '14px',
      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.95rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    cancelBtn: {
      flex: 1,
      padding: '14px',
      background: theme.primarySoft,
      color: theme.primary,
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.95rem',
      fontWeight: '700',
      cursor: 'pointer',
      textDecoration: 'none',
      textAlign: 'center',
      transition: 'background 0.2s'
    },
    errorText: {
      color: '#dc2626',
      fontSize: '0.82rem',
      marginTop: '5px'
    },
    previewPanel: {
      background: '#fff',
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '18px'
    },
    previewTitle: {
      margin: '0 0 8px 0',
      color: theme.primary,
      fontSize: '1rem'
    },
    previewText: {
      margin: 0,
      color: '#334155',
      lineHeight: '1.6',
      fontSize: '0.92rem'
    }
  };

  const selectedCompanyName = companies.find((c) => c._id === selectedCompany)?.companyName || 'Select company';

  const applyTemplate = (template) => {
    setFormData((prev) => ({
      ...prev,
      reviewText: template
    }));
    setErrors((prev) => ({ ...prev, reviewText: '' }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <h1 style={styles.title}>Review Submission Form</h1>
          <div style={styles.subtitle}>Provide clear, constructive feedback based on your internship experience.</div>
          <div style={styles.subActions}>
            <button
              type="button"
              style={styles.tinyBtn}
              onClick={() => setShowPreview((prev) => !prev)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              type="button"
              style={styles.tinyBtn}
              onClick={() => {
                localStorage.removeItem(REVIEW_DRAFT_KEY);
                setDraftNotice('Saved draft cleared.');
              }}
            >
              Clear Draft
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {draftNotice && <div style={styles.draftBanner}>{draftNotice}</div>}

          {showPreview && (
            <div style={styles.previewPanel}>
              <h4 style={styles.previewTitle}>Live Preview</h4>
              <p style={{ ...styles.previewText, marginBottom: '8px' }}>
                <strong>{formData.reviewTitle || 'Untitled review'}</strong>
              </p>
              <p style={{ ...styles.previewText, marginBottom: '8px' }}>
                Company: {selectedCompanyName} | Rating: {formData.rating}/5 | Mode: {formData.workMode}
              </p>
              <p style={styles.previewText}>
                {formData.reviewText || 'Your review details will appear here as you type.'}
              </p>
            </div>
          )}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Company Details</h3>
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

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="e.g. Software Engineering Intern"
                  style={{ ...styles.input, borderColor: errors.position ? '#dc2626' : theme.border }}
                  maxLength="60"
                />
                {errors.position && <div style={styles.errorText}>{errors.position}</div>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Internship Duration</label>
                <select
                  name="internshipDuration"
                  value={formData.internshipDuration}
                  onChange={handleInputChange}
                  style={{ ...styles.select, borderColor: errors.internshipDuration ? '#dc2626' : theme.border }}
                >
                  <option value="">Select duration</option>
                  <option value="Less than 3 months">Less than 3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="More than 12 months">More than 12 months</option>
                </select>
                {errors.internshipDuration && <div style={styles.errorText}>{errors.internshipDuration}</div>}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Work Mode</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Evaluation</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Rating</label>
              <div style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    style={{
                      ...styles.star,
                      color: star <= formData.rating ? theme.accent : '#d1d5db',
                      transform: 'scale(1)'
                    }}
                  >
                    ★
                  </span>
                ))}
                <span style={{ marginLeft: '10px', color: '#475569', fontWeight: 600 }}>
                  {formData.rating}/5
                </span>
              </div>
              {errors.rating && <div style={styles.errorText}>{errors.rating}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Review Title</label>
              <input
                type="text"
                name="reviewTitle"
                value={formData.reviewTitle}
                onChange={handleInputChange}
                placeholder="e.g. Well structured internship program"
                style={{ ...styles.input, borderColor: errors.reviewTitle ? '#dc2626' : theme.border }}
                maxLength="80"
              />
              {errors.reviewTitle && <div style={styles.errorText}>{errors.reviewTitle}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Review Details</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <button type="button" style={{ ...styles.tinyBtn, color: theme.primary, borderColor: theme.border, background: '#fff' }} onClick={() => applyTemplate('Mentorship was strong and the team was collaborative. I gained hands-on exposure and clear guidance throughout the internship.')}>Mentorship Focus</button>
                <button type="button" style={{ ...styles.tinyBtn, color: theme.primary, borderColor: theme.border, background: '#fff' }} onClick={() => applyTemplate('The work culture was professional and friendly. Responsibilities were meaningful, and I improved both technical and communication skills.')}>Work Culture Focus</button>
              </div>
              <textarea
                name="reviewText"
                value={formData.reviewText}
                onChange={handleInputChange}
                placeholder="Summarize mentorship quality, technical exposure, work culture, and learning outcome."
                style={styles.textarea}
                maxLength="1000"
              />
              <div style={styles.charCount}>
                {formData.reviewText.length} / 1000 characters
              </div>
              {errors.reviewText && <div style={styles.errorText}>{errors.reviewText}</div>}
            </div>

            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="anonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                style={styles.checkbox}
              />
              <label htmlFor="anonymous" style={styles.checkboxLabel}>
                Submit review anonymously
              </label>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitBtn,
                opacity: submitting ? 0.75 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>

            <Link
              to="/company-reviews"
              style={styles.cancelBtn}
              onMouseEnter={(e) => e.target.style.background = '#dbe7f3'}
              onMouseLeave={(e) => e.target.style.background = theme.primarySoft}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddReview;