import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                🎓 Internship Portal
            </div>
            <div className="navbar-links">
                {user ? (
                    <>
                        {user.role === 'student' && (
                            <>
                                <Link to="/student/dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/student/applications" className="nav-link">My Applications</Link>
                                <Link to="/student/profile" className="nav-link">Profile</Link>
                                <Link to="/student/cv-generator" className="nav-link">CV Generator</Link>
                                <Link to="/job-matching/practice-interview" className="nav-link">Practice Interview</Link>
                            </>
                        )}
                        {user.role === 'employer' && (
                            <Link to="/employer/dashboard" className="nav-link">Dashboard</Link>
                        )}
                        {user.role === 'admin' && (
                            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                        )}
                        <span className="nav-user">👤 {user.name}</span>
                        <button onClick={handleLogout} className="nav-logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;