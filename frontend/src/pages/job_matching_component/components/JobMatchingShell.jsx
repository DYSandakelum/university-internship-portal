import React from 'react';
import { Outlet } from 'react-router-dom';

import '../../../styles/design-system.css';
import '../styles/JobMatchingLayout.css';
import '../styles/JobMatchingControls.css';
import './JobMatchingShell.css';

export default function JobMatchingShell() {
    return (
        <div className="jm-shell">
            <div className="jm-shell-inner">
                <main className="jm-shell-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
