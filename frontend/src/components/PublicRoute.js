import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { user } = useAuth();

    // If already logged in redirect to their dashboard
    if (user) {
        if (user.role === 'student') return <Navigate to="/student/dashboard" />;
        if (user.role === 'employer') return <Navigate to="/employer/dashboard" />;
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
    }

    return children;
};

export default PublicRoute;