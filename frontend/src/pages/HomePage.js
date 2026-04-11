import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaSearch, FaClipboardList, FaBell, FaFileAlt, FaStar, FaCheckCircle, FaBuilding, FaUserGraduate, FaBriefcase, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
    return (
        <div style={styles.pageWrapper}>
            <Navbar />

            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroInner}>
                    <div style={styles.heroContent}>
                        <div style={styles.heroBadge}>
                            <span style={styles.heroBadgeDot}></span>
                            2,400+ internships posted this month
                        </div>
                        <h1 style={styles.heroTitle}>
                            Your next career<br />
                            <span style={styles.heroAccent}>starts here.</span>
                        </h1>
                        <p style={styles.heroSubtitle}>
                            Connect with top employers, discover internships that match
                            your skills, and launch your professional journey — all in one place.
                        </p>
                        <div style={styles.heroButtons}>
                            <Link to="/register" className="btn btn-amber btn-lg">
                                <FaSearch style={{fontSize: '14px'}} />
                                Find Internships
                            </Link>
                            <Link to="/register" className="btn btn-outline-dark btn-lg">
                                Post a Position <FaArrowRight style={{fontSize: '12px'}} />
                            </Link>
                            <Link to="/home" className="btn btn-outline-dark btn-lg">
                                Reviews
                            </Link>
                        </div>
                        <div style={styles.heroStats}>
                            {heroStats.map((s, i) => (
                                <React.Fragment key={i}>
                                    <div style={styles.heroStat}>
                                        <span style={styles.heroStatValue}>{s.value}</span>
                                        <span style={styles.heroStatLabel}>{s.label}</span>
                                    </div>
                                    {i < heroStats.length - 1 && <div style={styles.heroStatDivider}></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div style={styles.heroIllustration}>
                        <img
                            src={require('../assets/hero-bg.jpg')}
                            alt="Internship"
                            style={styles.heroImage}
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={styles.featuresSection}>
                <div style={styles.sectionInner}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>
                            Everything you need to land your<br />dream internship
                        </h2>
                        <p style={styles.sectionSubtitle}>
                            Built for SLIIT students, trusted by universities and employers alike.
                        </p>
                    </div>
                    <div className="grid-4" style={{gap: '20px'}}>
                        {features.map((f, i) => (
                            <div key={i} style={styles.featureCard}>
                                <div style={styles.featureIcon}>
                                    {f.icon}
                                </div>
                                <h3 style={styles.featureTitle}>{f.title}</h3>
                                <p style={styles.featureDesc}>{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Jobs Section */}
            <div style={styles.jobsSection}>
                <div style={styles.sectionInner}>
                    <div style={styles.jobsHeader}>
                        <div>
                            <h2 style={styles.sectionTitle}>Featured Internships</h2>
                            <p style={styles.sectionSubtitle}>Handpicked opportunities from top employers</p>
                        </div>
                        <Link to="/job-matching/search" className="btn btn-outline-dark btn-sm">
                            View All →
                        </Link>
                    </div>
                    <div style={styles.jobsList}>
                        {sampleJobs.map((job, i) => (
                            <div key={i} className="job-row">
                                <div className="job-company-avatar">{job.initial}</div>
                                <div style={styles.jobInfo}>
                                    <h3 style={styles.jobTitle}>{job.title}</h3>
                                    <p style={styles.jobCompany}>{job.company}</p>
                                </div>
                                <div style={styles.jobMeta}>
                                    <span style={styles.jobMetaItem}>📍 {job.location}</span>
                                    <span style={styles.jobMetaItem}>⏰ {job.type}</span>
                                    <span style={styles.jobMetaItem}>💰 {job.salary}</span>
                                </div>
                                <div style={styles.jobTags}>
                                    {job.tags.map((tag, j) => (
                                        <span key={j} style={styles.jobTag}>{tag}</span>
                                    ))}
                                </div>
                                <Link to="/register" className="btn btn-amber btn-sm">
                                    Apply Now
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div style={styles.stepsSection}>
                <div style={styles.sectionInner}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>How It Works</h2>
                        <p style={styles.sectionSubtitle}>Get started in 3 simple steps</p>
                    </div>
                    <div className="grid-3" style={{gap: '32px'}}>
                        {steps.map((step, i) => (
                            <div key={i} style={styles.stepCard}>
                                <div style={styles.stepNumber}>{step.number}</div>
                                <h3 style={styles.stepTitle}>{step.title}</h3>
                                <p style={styles.stepDesc}>{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div style={styles.ctaOuter}>
                <div style={styles.ctaSection}>
                    <h2 style={styles.ctaTitle}>Ready to kickstart your career?</h2>
                    <p style={styles.ctaSubtitle}>
                        Join thousands of SLIIT students who found their perfect internship.
                    </p>
                    <Link to="/register" className="btn btn-white btn-lg">
                        Create Free Account <FaArrowRight style={{fontSize: '13px'}} />
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerInner}>
                    <div style={styles.footerBrandCol}>
                        <div style={styles.footerBrand}>
                            <div style={styles.footerBrandIcon}>🎓</div>
                            <span>InternHub</span>
                        </div>
                        <p style={styles.footerDesc}>
                            Bridging the gap between SLIIT students and employers since 2024.
                        </p>
                    </div>
                    <div>
                        <p style={styles.footerHeading}>For Students</p>
                        <div style={styles.footerLinks}>
                            <Link to="/job-matching/search" style={styles.footerLink}>Browse Internships</Link>
                            <Link to="/student/cv-generator" style={styles.footerLink}>CV Generator</Link>
                            <Link to="/student/applications" style={styles.footerLink}>My Applications</Link>
                        </div>
                    </div>
                    <div>
                        <p style={styles.footerHeading}>For Employers</p>
                        <div style={styles.footerLinks}>
                            <Link to="/employer/post-job" style={styles.footerLink}>Post Internship</Link>
                            <Link to="/employer/dashboard" style={styles.footerLink}>Employer Dashboard</Link>
                        </div>
                    </div>
                    <div>
                        <p style={styles.footerHeading}>Company</p>
                        <div style={styles.footerLinks}>
                            <Link to="/home" style={styles.footerLink}>Reviews</Link>
                            <span style={styles.footerLink}>SLIIT, Malabe</span>
                            <span style={styles.footerLink}>info@sliit.lk</span>
                        </div>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    <p style={styles.footerCopy}>© 2026 InternHub. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const heroStats = [
    { value: '500+', label: 'Partner Companies' },
    { value: '12K+', label: 'Students Placed' },
    { value: '95%', label: 'Satisfaction Rate' }
];

const features = [
    { icon: <FaBriefcase />, title: 'Curated Listings', description: 'Browse internships vetted by your university\'s career center.' },
    { icon: <FaBuilding />, title: 'Employer Connections', description: 'Direct access to hiring managers and recruiters.' },
    { icon: <FaStar />, title: 'Skill Matching', description: 'AI-powered recommendations based on your coursework and interests.' },
    { icon: <FaCheckCircle />, title: 'Verified Employers', description: 'Every company is verified to ensure safe, quality internships.' },
    { icon: <FaFileAlt />, title: 'CV Generator', description: 'Create a professional CV instantly with our built-in generator.' },
    { icon: <FaBell />, title: 'Smart Notifications', description: 'Get instant updates on application status and new matches.' },
    { icon: <FaClipboardList />, title: 'Easy Applications', description: 'Apply to multiple internships with just a few clicks.' },
    { icon: <FaSearch />, title: 'Advanced Search', description: 'Filter by faculty, location, salary, and more.' }
];

const sampleJobs = [
    { initial: 'S', title: 'Software Engineering Intern', company: 'Stripe', location: 'Colombo', type: 'Full-time', salary: 'LKR 35K/mo', tags: ['React', 'TypeScript'] },
    { initial: 'F', title: 'Product Design Intern', company: 'Figma', location: 'Remote', type: 'Full-time', salary: 'LKR 30K/mo', tags: ['UI/UX', 'Figma'] },
    { initial: 'N', title: 'Data Science Intern', company: 'Notion', location: 'Colombo', type: 'Part-time', salary: 'LKR 25K/mo', tags: ['Python', 'SQL'] }
];

const steps = [
    { number: '01', title: 'Create Your Profile', description: 'Sign up with your SLIIT email, complete your profile and upload your CV.' },
    { number: '02', title: 'Browse & Apply', description: 'Search for internships matching your skills and apply with one click.' },
    { number: '03', title: 'Get Hired', description: 'Track your applications, attend interviews and land your dream internship.' }
];

const styles = {
    pageWrapper: { minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' },

    // Hero
    hero: { backgroundColor: '#F5F0E8', borderBottom: '1px solid #E7E2D9' },
    heroInner: { maxWidth: '1280px', margin: '0 auto', padding: '80px 48px', display: 'flex', alignItems: 'center', gap: '64px' },
    heroContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' },
    heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '9999px', padding: '6px 14px', fontSize: '13px', color: '#6B7280', fontWeight: '500', width: 'fit-content' },
    heroBadgeDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' },
    heroTitle: { fontSize: '52px', fontWeight: '800', color: '#1C1917', lineHeight: '1.1', letterSpacing: '-1.5px' },
    heroAccent: { color: '#F59E0B' },
    heroSubtitle: { fontSize: '17px', color: '#6B7280', lineHeight: '1.7', maxWidth: '480px' },
    heroButtons: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    heroStats: { display: 'flex', alignItems: 'center', gap: '24px', paddingTop: '8px' },
    heroStat: { display: 'flex', flexDirection: 'column', gap: '2px' },
    heroStatValue: { fontSize: '22px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.5px' },
    heroStatLabel: { fontSize: '12px', color: '#6B7280', fontWeight: '500' },
    heroStatDivider: { width: '1px', height: '32px', background: '#E7E2D9' },
    heroIllustration: { flex: 1, display: 'flex', justifyContent: 'flex-end' },
    heroImage: { width: '100%', maxWidth: '480px', borderRadius: '16px', objectFit: 'cover', height: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },

    // Sections
    sectionInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px' },
    sectionHeader: { textAlign: 'center', marginBottom: '48px' },
    sectionTitle: { fontSize: '32px', fontWeight: '800', color: '#1C1917', marginBottom: '10px', letterSpacing: '-0.5px', lineHeight: '1.2' },
    sectionSubtitle: { fontSize: '15px', color: '#6B7280', maxWidth: '480px', margin: '0 auto' },

    // Features
    featuresSection: { padding: '80px 0', backgroundColor: '#F5F0E8' },
    featureCard: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 0.2s ease' },
    featureIcon: { width: '44px', height: '44px', background: '#FEF3C7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', fontSize: '18px' },
    featureTitle: { fontSize: '15px', fontWeight: '700', color: '#1C1917' },
    featureDesc: { fontSize: '13px', color: '#6B7280', lineHeight: '1.6' },

    // Jobs
    jobsSection: { padding: '80px 0', backgroundColor: '#ffffff' },
    jobsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' },
    jobsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    jobInfo: { flex: 1 },
    jobTitle: { fontSize: '15px', fontWeight: '700', color: '#1C1917', margin: 0 },
    jobCompany: { fontSize: '13px', color: '#6B7280', margin: 0 },
    jobMeta: { display: 'flex', gap: '16px' },
    jobMetaItem: { fontSize: '13px', color: '#6B7280' },
    jobTags: { display: 'flex', gap: '8px' },
    jobTag: { background: '#F5F0E8', color: '#6B7280', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', border: '1px solid #E7E2D9' },

    // Steps
    stepsSection: { padding: '80px 0', backgroundColor: '#F5F0E8' },
    stepCard: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' },
    stepNumber: { width: '56px', height: '56px', borderRadius: '50%', background: '#F59E0B', color: '#ffffff', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    stepTitle: { fontSize: '17px', fontWeight: '700', color: '#1C1917' },
    stepDesc: { fontSize: '14px', color: '#6B7280', lineHeight: '1.7', maxWidth: '260px' },

    // CTA
    ctaOuter: { padding: '80px 48px', backgroundColor: '#ffffff' },
    ctaSection: { maxWidth: '1280px', margin: '0 auto', background: '#F59E0B', borderRadius: '20px', padding: '64px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
    ctaTitle: { color: '#ffffff', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' },
    ctaSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: '15px', maxWidth: '400px' },

    // Footer
    footer: { backgroundColor: '#ffffff', borderTop: '1px solid #E7E2D9' },
    footerInner: { maxWidth: '1280px', margin: '0 auto', padding: '56px 48px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px' },
    footerBrandCol: {},
    footerBrand: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
    footerBrandIcon: { width: '28px', height: '28px', background: '#F59E0B', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
    footerBrandText: { fontSize: '16px', fontWeight: '700', color: '#1C1917' },
    footerDesc: { color: '#6B7280', fontSize: '13px', lineHeight: '1.7' },
    footerHeading: { color: '#1C1917', fontSize: '13px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    footerLinks: { display: 'flex', flexDirection: 'column', gap: '10px' },
    footerLink: { color: '#6B7280', fontSize: '13px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' },
    footerBottom: { borderTop: '1px solid #E7E2D9', padding: '24px 48px', maxWidth: '1280px', margin: '0 auto' },
    footerCopy: { color: '#9CA3AF', fontSize: '13px' }
};

export default HomePage;