import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FiBarChart2, FiBell, FiBookmark, FiEdit3, FiSearch, FiStar, FiTarget } from 'react-icons/fi';

import '../../../styles/design-system.css';
import '../styles/JobMatchingLayout.css';
import '../styles/JobMatchingControls.css';
import './JobMatchingShell.css';

const tabs = [
    { to: '/job-matching/dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
    { to: '/job-matching/search', label: 'Search', icon: <FiSearch /> },
    { to: '/job-matching/recommended', label: 'Recommended', icon: <FiStar /> },
    { to: '/job-matching/saved', label: 'Saved', icon: <FiBookmark /> },
    { to: '/job-matching/opportunity', label: 'Opportunity', icon: <FiTarget /> },
    { to: '/job-matching/notifications', label: 'Notifications', icon: <FiBell /> },
    { to: '/job-matching/practice-interview', label: 'Practice', icon: <FiEdit3 /> }
];

export default function JobMatchingShell() {
    const location = useLocation();

    return (
        <div className="jm-shell">
            <div className="jm-shell-inner">
                <header className="jm-shell-header">
                    <div className="jm-shell-title">
                        <h1>Job Matching</h1>
                        <p className="jm-shell-subtitle">Your application dashboard</p>
                    </div>

                    <nav className="jm-shell-tabs" aria-label="Job matching navigation">
                        {tabs.map((tab) => (
                            <NavLink
                                key={tab.to}
                                to={tab.to}
                                end={tab.to === '/job-matching/dashboard'}
                                className={({ isActive }) =>
                                    `jm-tab ${isActive || location.pathname === tab.to ? 'is-active' : ''}`
                                }
                            >
                                <span className="jm-tab-icon" aria-hidden="true">{tab.icon}</span>
                                <span className="jm-tab-label">{tab.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </header>

                <main className="jm-shell-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
