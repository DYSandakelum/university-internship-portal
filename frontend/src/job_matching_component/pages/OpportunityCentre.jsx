import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiAlertCircle, FiArrowRight, FiTarget, FiZap, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import ScoreGauge from '../components/ScoreGauge';
import ActionQueue from '../components/ActionQueue';
import DeadlineTimeline from '../components/DeadlineTimeline';
import SkillGapPanel from '../components/SkillGapPanel';
import MomentumChart from '../components/MomentumChart';
import './OpportunityCentre.css';

function OpportunityCentre() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await jobService.getOpportunityDashboard();
            setDashboard(response.data);
            if (response.data.topOpportunities.length > 0) {
                setSelectedOpportunity(response.data.topOpportunities[0]);
            }
        } catch (err) {
            setError('Failed to load opportunity dashboard');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDashboard();
        setRefreshing(false);
    };

    if (loading && !dashboard) {
        return (
            <div className="opportunity-centre-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading your opportunity insights...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="opportunity-centre-container">
                <div className="error-state">
                    <FiAlertCircle className="error-icon" />
                    <p>{error}</p>
                    <button onClick={handleRefresh} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="opportunity-centre-container">
            <button
                onClick={() => navigate('/job-matching')}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    marginBottom: '16px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary-500)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}
            >
                Back to Dashboard
            </button>
            {/* Header */}
            <div className="opp-header">
                <div>
                    <h1 className="opp-title">
                        <span className="title-icon"><FiTarget /></span>
                        Opportunity Command Center
                    </h1>
                    <p className="opp-subtitle">Intelligent insights to land your next internship</p>
                </div>
                <button 
                    className={`refresh-button ${refreshing ? 'spinning' : ''}`}
                    onClick={handleRefresh}
                    disabled={refreshing}
                    title="Refresh insights"
                >
                    <FiRefreshCw />
                </button>
            </div>

            {/* Top Opportunities List */}
            {dashboard?.topOpportunities && dashboard.topOpportunities.length > 0 && (
                <div className="top-opportunities-section">
                    <h2 className="section-title">
                        <span className="icon"><FiZap /></span> Top Opportunities This Week
                    </h2>
                    <div className="opportunities-grid">
                        {dashboard.topOpportunities.map((opp, idx) => (
                            <div
                                key={idx}
                                className={`opp-card ${selectedOpportunity?._id === opp._id ? 'selected' : ''}`}
                                onClick={() => setSelectedOpportunity(opp)}
                            >
                                <div className="opp-card-header">
                                    <h3>{opp.jobId?.title}</h3>
                                    <span className={`score-badge score-${
                                        opp.overallSuccessScore >= 75 ? 'high' :
                                        opp.overallSuccessScore >= 50 ? 'medium' : 'low'
                                    }`}>
                                        {opp.overallSuccessScore}%
                                    </span>
                                </div>
                                <div className="opp-card-body">
                                    <p className="company">{opp.jobId?.company}</p>
                                    <p className="deadline">
                                        <FiCalendar /> {opp.daysUntilDeadline > 0 ? `${opp.daysUntilDeadline} days left` : 'Deadline passed'}
                                    </p>
                                    <div className="card-actions">
                                        <span className={`status ${opp.applicationStatus}`}>
                                            {opp.applicationStatus.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <FiArrowRight className="card-arrow" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="opp-main-grid">
                {/* Left Column */}
                <div className="opp-left-column">
                    {/* Score Gauge */}
                    {selectedOpportunity && (
                        <ScoreGauge opportunity={selectedOpportunity} />
                    )}

                    {/* Action Queue */}
                    {selectedOpportunity && (
                        <ActionQueue 
                            actions={selectedOpportunity.recommendedActions}
                            opportunity={selectedOpportunity}
                        />
                    )}
                </div>

                {/* Right Column */}
                <div className="opp-right-column">
                    {/* Deadline Timeline */}
                    {selectedOpportunity && (
                        <DeadlineTimeline opportunity={selectedOpportunity} />
                    )}

                    {/* Skill Gap Panel */}
                    {selectedOpportunity && (
                        <SkillGapPanel 
                            skills={selectedOpportunity.missingSkills}
                            skillMatchScore={selectedOpportunity.skillMatchScore}
                        />
                    )}

                    {/* Momentum Chart */}
                    {dashboard?.momentumData && (
                        <MomentumChart data={dashboard.momentumData} />
                    )}
                </div>
            </div>

            {/* At-Risk Opportunities Alert */}
            {dashboard?.atRiskOpportunities && dashboard.atRiskOpportunities.length > 0 && (
                <div className="at-risk-section">
                    <div className="at-risk-header">
                        <h2 className="section-title">
                            <span className="icon-alert"><FiAlertTriangle /></span> Attention Needed: {dashboard.atRiskOpportunities.length} Opportunity(ies)
                        </h2>
                    </div>
                    <div className="at-risk-list">
                        {dashboard.atRiskOpportunities.map((opp, idx) => (
                            <div key={idx} className="at-risk-item">
                                <div className="risk-indicator"></div>
                                <div className="risk-content">
                                    <h4>{opp.jobId?.title}</h4>
                                    <p>{opp.jobId?.company}</p>
                                </div>
                                <div className="risk-meta">
                                    <span className={`risk-level risk-${opp.riskLevel}`}>
                                        {opp.riskLevel.toUpperCase()}
                                    </span>
                                    <span className="days-left">
                                        {opp.daysUntilDeadline > 0 ? `${opp.daysUntilDeadline}d left` : 'EXPIRED'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default OpportunityCentre;
