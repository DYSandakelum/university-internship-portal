import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.heroBadge}>🎓 University Internship Portal</div>
                    <h1 style={styles.heroTitle}>
                        Find Your Perfect
                        <span style={styles.heroTitleAccent}> Internship</span>
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Connect with top companies, build your career, and gain
                        real-world experience while still at university.
                    </p>
                    <div style={styles.heroButtons}>
                        <Link to="/register" className="btn btn-white btn-lg" style={styles.heroSecondaryBtn}>
                            🚀 Get Started
                        </Link>
                        <Link to="/login" className="btn btn-lg" style={styles.heroSecondaryBtn}>
                            🔑 Login
                        </Link>
                    </div>
                    <div style={styles.heroStats}>
                        <div style={styles.heroStat}>
                            <span style={styles.heroStatValue}>500+</span>
                            <span style={styles.heroStatLabel}>Internships</span>
                        </div>
                        <div style={styles.heroStatDivider}></div>
                        <div style={styles.heroStat}>
                            <span style={styles.heroStatValue}>200+</span>
                            <span style={styles.heroStatLabel}>Companies</span>
                        </div>
                        <div style={styles.heroStatDivider}></div>
                        <div style={styles.heroStat}>
                            <span style={styles.heroStatValue}>1000+</span>
                            <span style={styles.heroStatLabel}>Students</span>
                        </div>
                    </div>
                </div>
                <div style={styles.heroImage}>
                    <div style={styles.heroImageCard}>
                        <div style={styles.heroImageIcon}>🎯</div>
                        <p style={styles.heroImageText}>Match with your dream internship</p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Everything You Need</h2>
                    <p style={styles.sectionSubtitle}>
                        A complete platform for students and employers
                    </p>
                </div>
                <div className="grid-3" style={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className="card" style={styles.featureCard}>
                            <div style={{
                                ...styles.featureCardHeader,
                                background: feature.color
                            }}>
                                <span style={styles.featureIcon}>{feature.icon}</span>
                                <h3 style={styles.featureTitle}>{feature.title}</h3>
                            </div>
                            <div className="card-body">
                                <p style={styles.featureDescription}>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works Section */}
            <div style={{...styles.section, backgroundColor: '#ffffff'}}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>How It Works</h2>
                    <p style={styles.sectionSubtitle}>Get started in just 3 simple steps</p>
                </div>
                <div className="grid-3" style={styles.stepsGrid}>
                    {steps.map((step, index) => (
                        <div key={index} style={styles.stepCard}>
                            <div style={styles.stepNumber}>{step.number}</div>
                            <h3 style={styles.stepTitle}>{step.title}</h3>
                            <p style={styles.stepDescription}>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div style={styles.cta}>
                <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
                <p style={styles.ctaSubtitle}>
                    Join thousands of students who found their dream internship
                </p>
                <div style={styles.ctaButtons}>
                    <Link to="/register" className="btn btn-white btn-lg">
                        🎓 Register as Student
                    </Link>
                    <Link to="/register" className="btn btn-lg" style={styles.ctaSecondaryBtn}>
                        🏢 Register as Employer
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    © 2026 University Internship Portal. Built with ❤️ for SLIIT students.
                </p>
            </footer>
        </div>
    );
};

const features = [
    {
        icon: '🔍',
        title: 'Smart Search',
        description: 'Find internships that match your skills, faculty, and availability with our advanced search system.',
        color: 'var(--gradient-primary)'
    },
    {
        icon: '📋',
        title: 'Easy Applications',
        description: 'Apply to multiple internships with just a few clicks. Track all your applications in one place.',
        color: 'var(--gradient-success)'
    },
    {
        icon: '🔔',
        title: 'Real-time Notifications',
        description: 'Get instant updates when employers review your application or schedule an interview.',
        color: 'var(--gradient-warning)'
    },
    {
        icon: '📄',
        title: 'CV Generator',
        description: 'Create a professional CV instantly using our built-in CV generator with beautiful templates.',
        color: 'var(--gradient-info)'
    },
    {
        icon: '⭐',
        title: 'Company Reviews',
        description: 'Read honest reviews from students who have interned at companies before you apply.',
        color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    },
    {
        icon: '✅',
        title: 'Verified Employers',
        description: 'All employers are verified by our admin team so you can apply with confidence.',
        color: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
    }
];

const steps = [
    {
        number: '01',
        title: 'Create Your Profile',
        description: 'Sign up with your university email, complete your profile, and upload your CV.'
    },
    {
        number: '02',
        title: 'Browse & Apply',
        description: 'Search for internships that match your skills and interests, then apply with one click.'
    },
    {
        number: '03',
        title: 'Get Hired',
        description: 'Track your applications, attend interviews, and land your dream internship.'
    }
];

const styles = {
    // Hero
    hero: {
    background: 'var(--gradient-primary)',
    backgroundImage: `linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.3) 100%), url(${require('../assets/hero-bg.jpg')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '80px 64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '48px',
    minHeight: '480px'
    },
    heroContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '600px'
    },
    heroBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#ffffff',
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        fontSize: '13px',
        fontWeight: '600',
        display: 'inline-block',
        width: 'fit-content'
    },
    heroTitle: {
        color: '#ffffff',
        fontSize: '52px',
        fontWeight: '800',
        lineHeight: '1.1',
        letterSpacing: '-1px'
    },
    heroTitleAccent: {
        color: '#fde68a'
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '18px',
        lineHeight: '1.7',
        maxWidth: '480px'
    },
    heroButtons: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
    },
    heroSecondaryBtn: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        color: '#ffffff',
        border: '1.5px solid rgba(255,255,255,0.4)'
    },
    heroStats: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        paddingTop: '8px'
    },
    heroStat: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    heroStatValue: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '800',
        letterSpacing: '-0.5px'
    },
    heroStatLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '13px',
        fontWeight: '500'
    },
    heroStatDivider: {
        width: '1px',
        height: '40px',
        backgroundColor: 'rgba(255,255,255,0.3)'
    },
    heroImage: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    heroImageCard: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'var(--radius-xl)',
        padding: '48px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.3)'
    },
    heroImageIcon: {
        fontSize: '80px',
        marginBottom: '16px'
    },
    heroImageText: {
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '600'
    },
    // Sections
    section: {
        padding: '80px 64px',
        backgroundColor: 'var(--bg)'
    },
    sectionHeader: {
        textAlign: 'center',
        marginBottom: '48px'
    },
    sectionTitle: {
        fontSize: '36px',
        fontWeight: '800',
        color: 'var(--text-primary)',
        marginBottom: '12px',
        letterSpacing: '-0.5px'
    },
    sectionSubtitle: {
        fontSize: '16px',
        color: 'var(--text-secondary)',
        maxWidth: '480px',
        margin: '0 auto'
    },
    // Features
    featuresGrid: {
        maxWidth: '1200px',
        margin: '0 auto'
    },
    featureCard: {
        cursor: 'default'
    },
    featureCardHeader: {
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    featureIcon: {
        fontSize: '24px'
    },
    featureTitle: {
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '700',
        margin: 0
    },
    featureDescription: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        lineHeight: '1.7'
    },
    // Steps
    stepsGrid: {
        maxWidth: '1200px',
        margin: '0 auto'
    },
    stepCard: {
        textAlign: 'center',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
    },
    stepNumber: {
        width: '64px',
        height: '64px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--gradient-primary)',
        color: '#ffffff',
        fontSize: '20px',
        fontWeight: '800',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(99,102,241,0.3)'
    },
    stepTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: 'var(--text-primary)'
    },
    stepDescription: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        lineHeight: '1.7',
        maxWidth: '280px'
    },
    // CTA
    cta: {
        background: 'var(--gradient-primary)',
        padding: '80px 64px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
    },
    ctaTitle: {
        color: '#ffffff',
        fontSize: '36px',
        fontWeight: '800',
        letterSpacing: '-0.5px'
    },
    ctaSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '16px',
        maxWidth: '480px'
    },
    ctaButtons: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '8px'
    },
    ctaSecondaryBtn: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        color: '#ffffff',
        border: '1.5px solid rgba(255,255,255,0.4)'
    },
    // Footer
    footer: {
        backgroundColor: '#1e1b4b',
        padding: '24px 64px',
        textAlign: 'center'
    },
    footerText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '14px'
    }
};

export default HomePage;