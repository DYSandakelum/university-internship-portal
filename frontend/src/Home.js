import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    const defaultCompanies = [
      { "_id": "1", "companyName": "Tech Solutions Lanka", "averageRating": 4.5, "totalReviews": 128, "industry": "Software", "location": "Colombo" },
      { "_id": "2", "companyName": "Eco Farms", "averageRating": 4.2, "totalReviews": 56, "industry": "Agriculture", "location": "Kandy" },
      { "_id": "3", "companyName": "Rapid Travels", "averageRating": 3.8, "totalReviews": 23, "industry": "Travel", "location": "Colombo" },
      { "_id": "4", "companyName": "CodeGen Innovations", "averageRating": 4.8, "totalReviews": 92, "industry": "AI/ML", "location": "Negombo" }
    ];
    setCompanies([...defaultCompanies, ...savedCompanies]);
  }, []);

  const totalReviews = companies.reduce((sum, c) => sum + (c.totalReviews || 0), 0);
  const averageRating = (companies.reduce((sum, c) => sum + (c.averageRating || 0), 0) / companies.length || 0).toFixed(1);

  const colors = {
    purpleStart: '#667eea',
    purpleEnd: '#764ba2',
    greenStart: '#4CAF50',
    greenEnd: '#45a049',
    blueStart: '#2196F3',
    blueEnd: '#1976D2',
    orangeStart: '#FF9800',
    orangeEnd: '#F57C00',
    text: '#2d3748',
    muted: '#718096',
    border: '#e2e8f0',
    bg: '#f7f9fc'
  };

  const styles = {
    page: {
      background: `radial-gradient(circle at 10% 5%, rgba(102,126,234,0.12), transparent 30%), ${colors.bg}`,
      minHeight: '100vh',
      padding: '28px 16px'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    hero: {
      background: `linear-gradient(135deg, ${colors.purpleStart} 0%, ${colors.purpleEnd} 100%)`,
      borderRadius: '22px',
      padding: '54px 36px',
      color: '#fff',
      marginBottom: '34px',
      boxShadow: '0 18px 40px rgba(89, 104, 213, 0.28)'
    },
    heroTitle: {
      fontSize: '2.7rem',
      fontWeight: 800,
      margin: '0 0 10px'
    },
    heroText: {
      maxWidth: '760px',
      fontSize: '1.1rem',
      lineHeight: 1.65,
      opacity: 0.95,
      marginBottom: '26px'
    },
    heroButtons: {
      display: 'flex',
      gap: '14px',
      flexWrap: 'wrap'
    },
    cta: {
      padding: '12px 22px',
      borderRadius: '999px',
      textDecoration: 'none',
      fontWeight: 700,
      fontSize: '0.96rem',
      border: '1px solid rgba(255,255,255,0.3)',
      color: '#fff',
      background: 'rgba(255,255,255,0.14)',
      backdropFilter: 'blur(2px)'
    },
    ctaSolid: {
      padding: '12px 22px',
      borderRadius: '999px',
      textDecoration: 'none',
      fontWeight: 700,
      fontSize: '0.96rem',
      color: colors.purpleStart,
      background: '#fff',
      border: '1px solid #fff'
    },
    heroStats: {
      marginTop: '22px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '10px'
    },
    heroStatCard: {
      background: 'rgba(255,255,255,0.12)',
      border: '1px solid rgba(255,255,255,0.25)',
      borderRadius: '12px',
      padding: '12px'
    },
    sectionTitle: {
      margin: '0 0 8px',
      fontSize: '2rem',
      color: colors.text,
      textAlign: 'center'
    },
    sectionSubtitle: {
      margin: '0 0 24px',
      color: colors.muted,
      textAlign: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
      gap: '20px',
      marginBottom: '34px'
    },
    card: {
      background: '#fff',
      border: `1px solid ${colors.border}`,
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease'
    },
    cardBody: {
      padding: '20px'
    },
    cardTitle: {
      margin: '0 0 8px',
      color: colors.text,
      fontSize: '1.15rem'
    },
    cardText: {
      color: colors.muted,
      lineHeight: 1.6,
      minHeight: '58px',
      marginBottom: '14px'
    },
    cardAction: {
      display: 'inline-block',
      width: '100%',
      textAlign: 'center',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '10px',
      padding: '11px 12px',
      fontWeight: 700
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px'
    },
    statTile: {
      background: '#fff',
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      textAlign: 'center',
      padding: '20px',
      boxShadow: '0 5px 16px rgba(15, 23, 42, 0.05)'
    }
  };

  const headerStyle = (start, end) => ({
    background: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
    color: '#fff',
    padding: '18px 20px'
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>Company Reviews Hub</h1>
          <p style={styles.heroText}>
            Discover companies, read trusted internship experiences, and contribute your own reviews with a clean, structured platform.
          </p>

          <div style={styles.heroButtons}>
            <Link to="/employers" style={styles.ctaSolid}>View Companies</Link>
            <Link to="/student/AddReviews" style={styles.cta}>Write a Review</Link>
            <Link to="/analytics" style={styles.cta}>Open Analytics</Link>
          </div>

          <div style={styles.heroStats}>
            <div style={styles.heroStatCard}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{companies.length}</div>
              <div style={{ opacity: 0.9 }}>Companies</div>
            </div>
            <div style={styles.heroStatCard}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalReviews}</div>
              <div style={{ opacity: 0.9 }}>Total Reviews</div>
            </div>
            <div style={styles.heroStatCard}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{averageRating}</div>
              <div style={{ opacity: 0.9 }}>Average Rating</div>
            </div>
          </div>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Core Actions</h2>
          <p style={styles.sectionSubtitle}>Everything you need in one unified workspace.</p>

          <div style={styles.grid}>
            <article
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 26px rgba(15, 23, 42, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.06)';
              }}
            >
              <div style={headerStyle(colors.purpleStart, colors.purpleEnd)}>
                <h3 style={{ margin: 0 }}>Browse Companies</h3>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.cardText}>Explore companies with ratings, locations, and review details.</p>
                <Link to="/employers" style={{ ...styles.cardAction, background: colors.purpleStart }}>Open Company List</Link>
              </div>
            </article>

            <article
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 26px rgba(15, 23, 42, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.06)';
              }}
            >
              <div style={headerStyle(colors.greenStart, colors.greenEnd)}>
                <h3 style={{ margin: 0 }}>Add Review</h3>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.cardText}>Submit structured internship feedback to help future students.</p>
                <Link to="/student/AddReviews" style={{ ...styles.cardAction, background: colors.greenStart }}>Write Review</Link>
              </div>
            </article>

            <article
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 26px rgba(15, 23, 42, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.06)';
              }}
            >
              <div style={headerStyle(colors.blueStart, colors.blueEnd)}>
                <h3 style={{ margin: 0 }}>Add Company</h3>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.cardText}>Contribute new company records and expand the review ecosystem.</p>
                <Link to="/add-employer" style={{ ...styles.cardAction, background: colors.blueStart }}>Create Company</Link>
              </div>
            </article>

            <article
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 26px rgba(15, 23, 42, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.06)';
              }}
            >
              <div style={headerStyle(colors.orangeStart, colors.orangeEnd)}>
                <h3 style={{ margin: 0 }}>All Reviews</h3>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.cardText}>Read all reviews, compare experiences, and spot quality trends.</p>
                <Link to="/student/AllReviews" style={{ ...styles.cardAction, background: colors.orangeStart }}>View Reviews</Link>
              </div>
            </article>
          </div>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Performance Snapshot</h2>
          <p style={styles.sectionSubtitle}>A quick health view of the review platform.</p>

          <div style={styles.statsRow}>
            <div style={styles.statTile}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: colors.purpleStart }}>{companies.length}</div>
              <div style={{ color: colors.muted }}>Total Companies</div>
            </div>
            <div style={styles.statTile}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: colors.greenStart }}>{totalReviews}</div>
              <div style={{ color: colors.muted }}>Total Reviews</div>
            </div>
            <div style={styles.statTile}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: colors.orangeStart }}>{averageRating}</div>
              <div style={{ color: colors.muted }}>Average Rating</div>
            </div>
            <div style={styles.statTile}>
              <Link
                to="/analytics"
                style={{
                  ...styles.cardAction,
                  width: 'auto',
                  display: 'inline-block',
                  padding: '10px 16px',
                  background: colors.purpleStart,
                  marginBottom: '8px'
                }}
              >
                Open Analytics
              </Link>
              <div style={{ color: colors.muted, fontSize: '0.92rem' }}>View detailed charts and trends</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
