import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    // If not logged in, keep app on the Dashboard entry point
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If role not allowed redirect to their dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'student') return <Navigate to="/student/dashboard" />;
        if (user.role === 'employer') return <Navigate to="/employer/dashboard" />;
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;