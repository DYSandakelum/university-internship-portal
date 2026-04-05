import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appTheme } from './styles/theme';

function Analytics() {
  const [companies, setCompanies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const defaultCompanies = [
      {
        _id: '1',
        companyName: 'Tech Solutions Lanka',
        averageRating: 4.5,
        totalReviews: 128,
        industry: 'Software Development',
        location: 'Colombo',
        employees: '50-100'
      },
      {
        _id: '2',
        companyName: 'Eco Farms',
        averageRating: 4.2,
        totalReviews: 56,
        industry: 'Agriculture',
        location: 'Kandy',
        employees: '100-200'
      },
      {
        _id: '3',
        companyName: 'Rapid Travels',
        averageRating: 3.8,
        totalReviews: 23,
        industry: 'Travel & Tourism',
        location: 'Colombo',
        employees: '20-50'
      },
      {
        _id: '4',
        companyName: 'CodeGen Innovations',
        averageRating: 4.8,
        totalReviews: 92,
        industry: 'AI/ML',
        location: 'Negombo',
        employees: '10-20'
      }
    ];

    const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    setCompanies([...defaultCompanies, ...savedCompanies]);
    setReviews(savedReviews);
    setLoading(false);
  }, []);

  const totalCompanies = companies.length;
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';
  const positiveRate = totalReviews > 0
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / totalReviews) * 100)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percent };
  });

  const topCompanies = [...companies]
    .sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0))
    .slice(0, 5);

  const industryMap = companies.reduce((acc, company) => {
    const key = company.industry || 'Other';
    if (!acc[key]) {
      acc[key] = {
        industry: key,
        companies: 0,
        totalReviews: 0,
        ratingSum: 0
      };
    }
    acc[key].companies += 1;
    acc[key].totalReviews += company.totalReviews || 0;
    acc[key].ratingSum += company.averageRating || 0;
    return acc;
  }, {});

  const industrySummary = Object.values(industryMap)
    .map((item) => ({
      ...item,
      averageRating: item.companies > 0 ? (item.ratingSum / item.companies).toFixed(1) : '0.0'
    }))
    .sort((a, b) => b.totalReviews - a.totalReviews);

  const recentReviews = [...reviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const maxIndustryReviews = Math.max(1, ...industrySummary.map((i) => i.totalReviews));

  const ratingColor = {
    5: '#2b8a3e',
    4: '#5c940d',
    3: '#f08c00',
    2: '#e8590c',
    1: '#c92a2a'
  };

  const styles = {
    page: {
      background: theme.pageBg,
      minHeight: '100vh',
      padding: '30px 16px'
    },
    container: {
      maxWidth: '1240px',
      margin: '0 auto'
    },
    hero: {
      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
      borderRadius: '16px',
      color: '#fff',
      padding: '28px',
      marginBottom: '20px',
      boxShadow: '0 16px 30px rgba(23, 60, 93, 0.26)'
    },
    heroTitle: {
      margin: 0,
      fontSize: '2rem',
      fontWeight: 800
    },
    heroSubtitle: {
      marginTop: '8px',
      opacity: 0.9,
      lineHeight: 1.5
    },
    actions: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      marginTop: '16px'
    },
    actionBtn: {
      display: 'inline-block',
      padding: '10px 14px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: 700,
      fontSize: '0.9rem'
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '14px',
      marginBottom: '20px'
    },
    kpiCard: {
      background: '#fff',
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      padding: '18px',
      boxShadow: '0 7px 18px rgba(15, 23, 42, 0.05)'
    },
    kpiLabel: {
      color: theme.muted,
      fontSize: '0.86rem',
      marginBottom: '6px'
    },
    kpiValue: {
      color: theme.text,
      fontSize: '1.9rem',
      fontWeight: 800
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: '14px',
      marginBottom: '14px'
    },
    panel: {
      background: '#fff',
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      padding: '18px',
      boxShadow: '0 7px 18px rgba(15, 23, 42, 0.05)'
    },
    panelTitle: {
      margin: 0,
      color: theme.text,
      fontSize: '1.1rem',
      fontWeight: 700
    },
    panelSubtitle: {
      margin: '4px 0 16px',
      color: theme.muted,
      fontSize: '0.85rem'
    },
    ratingBarWrap: {
      marginBottom: '12px'
    },
    ratingBarTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '6px',
      color: theme.text,
      fontSize: '0.86rem'
    },
    ratingTrack: {
      width: '100%',
      height: '10px',
      borderRadius: '999px',
      background: '#edf2f7',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'left',
      color: theme.muted,
      fontSize: '0.8rem',
      fontWeight: 700,
      padding: '10px 8px',
      borderBottom: `1px solid ${theme.border}`
    },
    td: {
      padding: '10px 8px',
      borderBottom: `1px solid ${theme.border}`,
      color: theme.text,
      fontSize: '0.9rem'
    },
    industryRow: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr auto',
      gap: '10px',
      alignItems: 'center',
      marginBottom: '10px'
    },
    miniTrack: {
      height: '8px',
      borderRadius: '999px',
      background: '#edf2f7',
      overflow: 'hidden'
    },
    recentItem: {
      border: `1px solid ${theme.border}`,
      borderRadius: '10px',
      padding: '12px',
      marginBottom: '10px',
      background: '#fafcff'
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          margin: '0 auto 12px',
          borderRadius: '50%',
          border: '4px solid #d9e7f6',
          borderTop: `4px solid ${theme.primary}`,
          animation: 'analyticsSpin 0.9s linear infinite'
        }}></div>
        <p style={{ color: theme.muted }}>Loading analytics dashboard...</p>
        <style>{`@keyframes analyticsSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>Analytics Dashboard</h1>
          <p style={styles.heroSubtitle}>
            A consolidated view of ratings, company engagement, and feedback quality.
          </p>
          <div style={styles.actions}>
            <Link to="/company-reviews" style={{ ...styles.actionBtn, background: '#ffffff', color: theme.primary }}>Company Reviews</Link>
            <Link to="/student/AllReviews" style={{ ...styles.actionBtn, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }}>All Reviews</Link>
            <Link to="/student/AddReviews" style={{ ...styles.actionBtn, background: theme.accent, color: '#fff' }}>Add Review</Link>
          </div>
        </section>

        <section style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Total Companies</div>
            <div style={styles.kpiValue}>{totalCompanies}</div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Total Reviews</div>
            <div style={styles.kpiValue}>{totalReviews}</div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Average Rating</div>
            <div style={styles.kpiValue}>{averageRating}</div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Positive Feedback Rate</div>
            <div style={styles.kpiValue}>{positiveRate}%</div>
          </div>
        </section>

        <section style={styles.row}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Rating Distribution</h2>
            <p style={styles.panelSubtitle}>How users are scoring internships</p>

            {ratingDistribution.map((item) => (
              <div key={item.rating} style={styles.ratingBarWrap}>
                <div style={styles.ratingBarTop}>
                  <span>{item.rating} star</span>
                  <span>{item.count} ({item.percent.toFixed(1)}%)</span>
                </div>
                <div style={styles.ratingTrack}>
                  <div style={{
                    width: `${item.percent}%`,
                    height: '100%',
                    background: ratingColor[item.rating]
                  }}></div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Top Companies</h2>
            <p style={styles.panelSubtitle}>Highest review volume</p>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Reviews</th>
                  <th style={styles.th}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {topCompanies.map((company) => (
                  <tr key={company._id}>
                    <td style={styles.td}>
                      <Link to={`/reviews/${company._id}`} style={{ color: theme.primary, textDecoration: 'none', fontWeight: 700 }}>
                        {company.companyName}
                      </Link>
                    </td>
                    <td style={styles.td}>{company.totalReviews || 0}</td>
                    <td style={styles.td}>{company.averageRating || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.row}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Industry Performance</h2>
            <p style={styles.panelSubtitle}>Review activity by industry</p>

            {industrySummary.map((industry) => {
              const width = (industry.totalReviews / maxIndustryReviews) * 100;
              return (
                <div key={industry.industry} style={styles.industryRow}>
                  <div>
                    <div style={{ fontWeight: 700, color: theme.text }}>{industry.industry}</div>
                    <div style={{ fontSize: '0.8rem', color: theme.muted }}>
                      {industry.companies} companies, avg {industry.averageRating}
                    </div>
                  </div>
                  <div>
                    <div style={styles.miniTrack}>
                      <div style={{ width: `${width}%`, height: '100%', background: theme.primary }}></div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: theme.text }}>{industry.totalReviews}</div>
                </div>
              );
            })}
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Recent Review Activity</h2>
            <p style={styles.panelSubtitle}>Most recent submissions</p>

            {recentReviews.length === 0 && (
              <div style={{ color: theme.muted }}>No recent reviews yet.</div>
            )}

            {recentReviews.map((review, index) => (
              <div key={review.id || index} style={styles.recentItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ color: theme.text }}>{review.title || 'Review Entry'}</strong>
                  <span style={{ color: theme.muted, fontSize: '0.82rem' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: theme.muted, marginBottom: '4px' }}>
                  Company ID: {review.companyId} | Rating: {review.rating}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                  {(review.comment || review.reviewText || '').slice(0, 110)}
                  {(review.comment || review.reviewText || '').length > 110 ? '...' : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const theme = appTheme;

export default Analytics;
