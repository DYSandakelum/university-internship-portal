import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BackToDashboardButton() {
    const navigate = useNavigate();
    const location = useLocation();

    const isDashboard = location.pathname === '/job-matching/dashboard' || location.pathname === '/job-matching';
    if (isDashboard) return null;

    return (
        <div className="jm-page-topbar">
            <button
                type="button"
                className="btn-secondary jm-back-dashboard-btn"
                onClick={() => navigate('/job-matching/dashboard')}
            >
                <FiArrowLeft /> Dashboard
            </button>
        </div>
    );
}
