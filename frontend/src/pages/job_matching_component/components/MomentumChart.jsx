import React from 'react';
import { FiTrendingUp, FiMail, FiTarget, FiAward, FiBarChart2, FiZap, FiStar } from 'react-icons/fi';
import './MomentumChart.css';

function MomentumChart({ data = [] }) {
    if (!data || data.length === 0) {
        return (
            <div className="momentum-chart-container">
                <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiTrendingUp /> Your Momentum</h3>
                <div className="no-data">
                    <p>No momentum data yet. Start applying to jobs!</p>
                </div>
            </div>
        );
    }

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => Math.max(d.applications || 0, d.interviews || 0, d.offers || 0)), 1);
    const scaleFactor = 100 / maxValue;

    // Calculate totals
    const totalApplications = data.reduce((sum, d) => sum + (d.applications || 0), 0);
    const totalInterviews = data.reduce((sum, d) => sum + (d.interviews || 0), 0);
    const totalOffers = data.reduce((sum, d) => sum + (d.offers || 0), 0);

    return (
        <div className="momentum-chart-container">
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiTrendingUp /> Your Momentum (Weekly)</h3>

            {/* Summary Stats */}
            <div className="momentum-summary">
                <div className="momentum-stat">
                    <span className="stat-icon applications"><FiMail /></span>
                    <div>
                        <p className="stat-value">{totalApplications}</p>
                        <p className="stat-label">Applications</p>
                    </div>
                </div>
                <div className="momentum-stat">
                    <span className="stat-icon interviews"><FiTarget /></span>
                    <div>
                        <p className="stat-value">{totalInterviews}</p>
                        <p className="stat-label">Interviews</p>
                    </div>
                </div>
                <div className="momentum-stat">
                    <span className="stat-icon offers"><FiAward /></span>
                    <div>
                        <p className="stat-value">{totalOffers}</p>
                        <p className="stat-label">Offers</p>
                    </div>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="chart-container">
                <div className="chart-bars">
                    {data.map((week, index) => (
                        <div key={index} className="bar-group">
                            <div className="bar-label">W{week.week + 1}</div>
                            <div className="bar-stack">
                                {week.applications > 0 && (
                                    <div
                                        className="bar applications-bar"
                                        style={{ height: `${week.applications * scaleFactor}%` }}
                                        title={`${week.applications} applications`}
                                    >
                                        <span className="bar-value">{week.applications}</span>
                                    </div>
                                )}
                                {week.interviews > 0 && (
                                    <div
                                        className="bar interviews-bar"
                                        style={{ height: `${week.interviews * scaleFactor}%` }}
                                        title={`${week.interviews} interviews`}
                                    >
                                        <span className="bar-value">{week.interviews}</span>
                                    </div>
                                )}
                                {week.offers > 0 && (
                                    <div
                                        className="bar offers-bar"
                                        style={{ height: `${week.offers * scaleFactor}%` }}
                                        title={`${week.offers} offers`}
                                    >
                                        <span className="bar-value">{week.offers}</span>
                                    </div>
                                )}
                                {week.applications === 0 && week.interviews === 0 && week.offers === 0 && (
                                    <div className="bar empty-bar"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="chart-legend">
                <div className="legend-item">
                    <div className="legend-color applications"></div>
                    <span>Applications</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color interviews"></div>
                    <span>Interviews</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color offers"></div>
                    <span>Offers</span>
                </div>
            </div>

            {/* Trend Analysis */}
            <div className="trend-analysis">
                {totalApplications < 2 && (
                    <p className="trend-message warning">
                        <FiTrendingUp style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />Low momentum: Aim to apply to 3+ opportunities per week
                    </p>
                )}
                {totalApplications >= 2 && totalApplications < 5 && (
                    <p className="trend-message neutral">
                        <FiBarChart2 style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />Good effort: Keep consistency, target 5+ weekly applications
                    </p>
                )}
                {totalApplications >= 5 && (
                    <p className="trend-message success">
                        <FiZap style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />Excellent momentum: Keep this pace and quality high!
                    </p>
                )}
                {totalInterviews > 0 && (
                    <p className="trend-message success">
                        <FiStar style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />Great job getting interviews! Focus on interview prep.
                    </p>
                )}
                {totalOffers > 0 && (
                    <p className="trend-message success">
                        <FiAward style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />Congratulations on the offers! Evaluate carefully.
                    </p>
                )}
            </div>
        </div>
    );
}

export default MomentumChart;
