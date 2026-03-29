import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaSearch, FaClipboardList, FaBell, FaFileAlt, FaStar, FaCheckCircle, FaBuilding, FaUserGraduate, FaBriefcase } from 'react-icons/fa';

const HomePage = () => {
    return (
        <div style={styles.pageWrapper}>
            <Navbar />

            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>
                        Find Your Perfect<br />
                        <span style={styles.heroTitleAccent}>Internship.</span>
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Connect with top companies, build your career, and gain
                        real-world experience while still at university.
                        Join 1,000+ students who found their dream internship.
                    </p>
                    <div style={styles.heroButtons}>
                        <Link to="/register" className="btn btn-amber btn-lg">
                            Get Started Free
                        </Link>
                        <Link to="/login" className="btn btn-outline btn-lg">
                            Login →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div style={styles.statsSection}>
                {stats.map((stat, index) => (
                    <div key={index} style={styles.statItem}>
                        <span style={styles.statIcon}>{stat.icon}</span>
                        <span style={styles.statValue}>{stat.value}</span>
                        <span style={styles.statLabel}>{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Features Section */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Everything You Need</h2>
                    <p style={styles.sectionSubtitle}>
                        A complete platform built for SLIIT students and employers
                    </p>
                </div>
                <div className="grid-3">
                    {features.map((feature, index) => (
                        <div key={index} className="card" style={{cursor: 'default'}}>
                            <div className="card-header" style={{background: feature.color}}>
                                <span style={{fontSize: '20px'}}>{feature.icon}</span>
                                <h3 className="card-title">{feature.title}</h3>
                            </div>
                            <div className="card-body">
                                <p style={styles.featureDesc}>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div style={styles.howSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>How It Works</h2>
                    <p style={styles.sectionSubtitle}>Get started in 3 simple steps</p>
                </div>
                <div className="grid-3">
                    {steps.map((step, index) => (
                        <div key={index} style={styles.stepCard}>
                            <div style={styles.stepNumber}>{step.number}</div>
                            <h3 style={styles.stepTitle}>{step.title}</h3>
                            <p style={styles.stepDesc}>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div style={styles.cta}>
                <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
                <p style={styles.ctaSubtitle}>
                    Join thousands of SLIIT students who found their dream internship
                </p>
                <div style={styles.ctaButtons}>
                    <Link to="/register" className="btn btn-amber btn-lg">
                        <FaUserGraduate style={{ marginRight: '8px' }} /> Register as Student
                    </Link>
                    <Link to="/register" className="btn btn-outline btn-lg">
                        <FaBuilding style={{ marginRight: '8px' }} /> Register as Employer
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerGrid}>
                    <div>
                        <div style={styles.footerBrand}>
                            <FaUserGraduate style={{ marginRight: '8px', fontSize: '16px' }} /> Internship Portal
                        </div>
                        <p style={styles.footerDesc}>
                            The official internship portal for SLIIT students and employers.
                        </p>
                    </div>
                    <div>
                        <p style={styles.footerHeading}>Quick Links</p>
                        <div style={styles.footerLinks}>
                            <Link to="/register" style={styles.footerLink}>Register</Link>
                            <Link to="/login" style={styles.footerLink}>Login</Link>
                        </div>
                    </div>
                    <div>
                        <p style={styles.footerHeading}>For Students</p>
                        <div style={styles.footerLinks}>
                            <span style={styles.footerLink}>Browse Internships</span>
                            <span style={styles.footerLink}>CV Generator</span>
                            <span style={styles.footerLink}>My Applications</span>
                        </div>
                    </div>
                    <div>
                        <p style={styles.footerHeading}>Contact</p>
                        <div style={styles.footerLinks}>
                            <span style={styles.footerLink}>SLIIT, Malabe</span>
                            <span style={styles.footerLink}>info@sliit.lk</span>
                        </div>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    <p style={styles.footerCopy}>
                        © 2026 University Internship Portal. Built for SLIIT students.
                    </p>
                </div>
            </footer>
        </div>
    );
};

const stats = [
    { icon: <FaBriefcase size={28} />, value: '500+', label: 'Internships Posted' },
    { icon: <FaBuilding size={28} />, value: '200+', label: 'Partner Companies' },
    { icon: <FaUserGraduate size={28} />, value: '1,000+', label: 'Students Registered' },
    { icon: <FaStar size={28} />, value: '95%', label: 'Placement Rate' }
];

const features = [
    {
        icon: <FaSearch size={24} />,
        title: 'Smart Search',
        description: 'Find internships matching your skills, faculty, and availability with our advanced search.',
        color: 'var(--primary)'
    },
    {
        icon: <FaClipboardList size={24} />,
        title: 'Easy Applications',
        description: 'Apply to multiple internships with a few clicks and track all your applications in one place.',
        color: 'var(--success)'
    },
    {
        icon: <FaBell size={24} />,
        title: 'Notifications',
        description: 'Get instant updates when employers review your application or schedule an interview.',
        color: 'var(--warning)'
    },
    {
        icon: <FaFileAlt size={24} />,
        title: 'CV Generator',
        description: 'Create a professional CV instantly using our built-in generator with beautiful templates.',
        color: 'var(--info)'
    },
    {
        icon: <FaStar size={24} />,
        title: 'Company Reviews',
        description: 'Read honest reviews from students who have interned at companies before you apply.',
        color: 'var(--secondary)'
    },
    {
        icon: <FaCheckCircle size={24} />,
        title: 'Verified Employers',
        description: 'All employers are verified by our admin team so you can apply with full confidence.',
        color: 'var(--amber)'
    }
];

const steps = [
    {
        number: '01',
        title: 'Create Your Profile',
        description: 'Sign up with your SLIIT email, complete your profile and upload your CV.'
    },
    {
        number: '02',
        title: 'Browse & Apply',
        description: 'Search for internships matching your skills and apply with one click.'
    },
    {
        number: '03',
        title: 'Get Hired',
        description: 'Track your applications, attend interviews and land your dream internship.'
    }
];

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column'
    },
    // Hero
    hero: {
        background: 'var(--primary)',
        backgroundImage: `linear-gradient(135deg, rgba(91,91,214,0.88) 0%, rgba(139,92,246,0.88) 100%), url(${require('../assets/hero-bg.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 64px',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center'
    },
    heroContent: {
        maxWidth: '580px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    heroTitle: {
        color: '#ffffff',
        fontSize: '56px',
        fontWeight: '800',
        lineHeight: '1.1',
        letterSpacing: '-1.5px'
    },
    heroTitleAccent: {
        color: '#FDE68A'
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '17px',
        lineHeight: '1.7'
    },
    heroButtons: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginTop: '8px'
    },
    // Stats
    statsSection: {
        backgroundColor: '#ffffff',
        padding: '40px 64px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0',
        borderBottom: '1px solid var(--border)'
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '0 24px',
        borderRight: '1px solid var(--border)'
    },
    statIcon: {
        fontSize: '24px',
        marginBottom: '4px'
    },
    statValue: {
        fontSize: '28px',
        fontWeight: '800',
        color: 'var(--primary)',
        letterSpacing: '-0.5px'
    },
    statLabel: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontWeight: '500'
    },
    // Sections
    section: {
        padding: '72px 64px',
        backgroundColor: 'var(--bg)',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
    },
    howSection: {
        padding: '72px 64px',
        backgroundColor: '#ffffff',
        width: '100%'
    },
    sectionHeader: {
        textAlign: 'center',
        marginBottom: '48px'
    },
    sectionTitle: {
        fontSize: '32px',
        fontWeight: '800',
        color: 'var(--text-primary)',
        marginBottom: '10px',
        letterSpacing: '-0.5px'
    },
    sectionSubtitle: {
        fontSize: '15px',
        color: 'var(--text-secondary)',
        maxWidth: '400px',
        margin: '0 auto'
    },
    featureDesc: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        lineHeight: '1.7'
    },
    // Steps
    stepCard: {
        textAlign: 'center',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px'
    },
    stepNumber: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'var(--primary)',
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '800',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(91,91,214,0.3)'
    },
    stepTitle: {
        fontSize: '17px',
        fontWeight: '700',
        color: 'var(--text-primary)'
    },
    stepDesc: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        lineHeight: '1.7',
        maxWidth: '260px'
    },
    // CTA
    cta: {
        background: 'var(--primary)',
        padding: '80px 64px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
    },
    ctaTitle: {
        color: '#ffffff',
        fontSize: '32px',
        fontWeight: '800',
        letterSpacing: '-0.5px'
    },
    ctaSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '15px',
        maxWidth: '400px'
    },
    ctaButtons: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '8px'
    },
    // Footer
    footer: {
        backgroundColor: '#1C1C2E',
        padding: '56px 64px 0'
    },
    footerGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '48px',
        paddingBottom: '48px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    footerBrand: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '12px'
    },
    footerDesc: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '13px',
        lineHeight: '1.7'
    },
    footerHeading: {
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '700',
        marginBottom: '16px'
    },
    footerLinks: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    footerLink: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '13px',
        textDecoration: 'none',
        transition: 'var(--transition)',
        cursor: 'pointer'
    },
    footerBottom: {
        padding: '24px 0',
        textAlign: 'center'
    },
    footerCopy: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: '13px'
    }
};

export default HomePage;