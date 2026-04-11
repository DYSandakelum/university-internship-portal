import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <div className="navbar-brand-icon">🎓</div>
                InternHub
            </Link>
            <div className="navbar-links">
                {user ? (
                    <>
                        {user.role === 'student' && (
                            <>
                                <Link to="/student/dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/student/applications" className="nav-link">Applications</Link>
                                <Link to="/job-matching/search" className="nav-link">Browse Jobs</Link>
                                <Link to="/student/profile" className="nav-link">Profile</Link>
                                <Link to="/student/cv-generator" className="nav-link">CV Generator</Link>
                            </>
                        )}
                        {user.role === 'employer' && (
                            <>
                                <Link to="/employer/dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/employer/post-job" className="nav-link">Post Job</Link>
                                <Link to="/employer/my-jobs" className="nav-link">My Jobs</Link>
                            </>
                        )}
                        {user.role === 'admin' && (
                            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                        )}
                        <span className="nav-user">👤 {user.name}</span>
                        <button onClick={handleLogout} className="nav-logout-btn">
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/job-matching/search" className="nav-link">Browse Internships</Link>
                        <Link to="/home" className="nav-link">Reviews</Link>
                        <Link to="/login" className="nav-link">Sign In</Link>
                        <Link to="/register" className="btn btn-amber" style={{padding: '8px 20px'}}>
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;