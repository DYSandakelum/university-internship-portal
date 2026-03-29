import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiAlertCircle, FiArrowLeft, FiArrowRight, FiCalendar, FiInfo, FiTarget } from 'react-icons/fi';
import { jobService } from '../../../services/jobService';
import ActionQueue from '../components/ActionQueue';
import DeadlineTimeline from '../components/DeadlineTimeline';
import MomentumChart from '../components/MomentumChart';
import ScoreGauge from '../components/ScoreGauge';
import SkillGapPanel from '../components/SkillGapPanel';
import './OpportunityCentre.css';

const SCROLL_STEP_PX = 360;

export default function OpportunityCentre() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);

    const scrollerRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await jobService.getOpportunityDashboard();
                if (!mounted) return;
                setDashboard(response.data);
                const first = response.data?.topOpportunities?.[0] || null;
                setSelectedOpportunity(first);
            } catch (e) {
                if (!mounted) return;
                setError('Failed to load opportunity dashboard');
                // eslint-disable-next-line no-console
                console.error('Opportunity dashboard error:', e);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, []);

    const topOpportunities = useMemo(() => dashboard?.topOpportunities || [], [dashboard]);

    const scrollBy = (dx) => {
        if (!scrollerRef.current) return;
        scrollerRef.current.scrollBy({ left: dx, behavior: 'smooth' });
    };

    if (loading && !dashboard) {
        return (
            <div className="opx-page">
                <div className="opx-state">
                    <div className="opx-spinner" />
                    <p>Loading opportunities…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="opx-page">
                <div className="opx-state opx-state-error">
                    <FiAlertCircle className="opx-state-icon" />
                    <p>{error}</p>
                    <button type="button" className="opx-btn" onClick={() => window.location.reload()}>
                        Reload
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="opx-page">
            <header className="opx-header">
                <h1 className="opx-title">
                    <FiTarget /> Opportunity Mission Board
                </h1>
            </header>

            <section className="opx-selector" aria-label="Opportunity selector">
                <button
                    type="button"
                    className="opx-arrow opx-arrow-left"
                    onClick={() => scrollBy(-SCROLL_STEP_PX)}
                    aria-label="Scroll opportunities left"
                >
                    <FiArrowLeft />
                </button>

                <div className="opx-scroller" ref={scrollerRef}>
                    {topOpportunities.length > 0 ? (
                        topOpportunities.map((opp) => (
                            <button
                                key={opp._id}
                                type="button"
                                className={`opx-card ${selectedOpportunity?._id === opp._id ? 'is-selected' : ''}`}
                                onClick={() => setSelectedOpportunity(opp)}
                                title={`${opp.jobId?.title || 'Role'} at ${opp.jobId?.company || 'Company'}`}
                            >
                                <div className="opx-card-top">
                                    <h2 className="opx-card-title">{opp.jobId?.title}</h2>
                                    <span
                                        className={`opx-pill ${
                                            opp.overallSuccessScore >= 75
                                                ? 'high'
                                                : opp.overallSuccessScore >= 50
                                                  ? 'mid'
                                                  : 'low'
                                        }`}
                                    >
                                        {opp.overallSuccessScore || 0}%
                                    </span>
                                </div>
                                <p className="opx-card-company">{opp.jobId?.company}</p>
                                <p className="opx-card-deadline">
                                    <FiCalendar />
                                    {opp.daysUntilDeadline > 0 ? `${opp.daysUntilDeadline}d` : 'Expired'}
                                </p>
                                <div className="opx-card-bottom">
                                    <span className={`opx-status ${opp.applicationStatus}`}>
                                        {opp.applicationStatus?.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="opx-empty">No opportunities yet.</div>
                    )}
                </div>

                <button
                    type="button"
                    className="opx-arrow opx-arrow-right"
                    onClick={() => scrollBy(SCROLL_STEP_PX)}
                    aria-label="Scroll opportunities right"
                >
                    <FiArrowRight />
                </button>
            </section>

            <section className="opx-modules" aria-label="Opportunity modules">
                <div className="opx-module">
                    {selectedOpportunity ? <ScoreGauge opportunity={selectedOpportunity} /> : null}
                </div>

                <div className="opx-module opx-module-deadline">
                    {selectedOpportunity ? <DeadlineTimeline opportunity={selectedOpportunity} /> : null}
                </div>

                <div className="opx-module">
                    {selectedOpportunity ? (
                        <ActionQueue actions={selectedOpportunity.recommendedActions} opportunity={selectedOpportunity} />
                    ) : null}
                </div>

                <div className="opx-module opx-module-skills">
                    {selectedOpportunity ? (
                        <SkillGapPanel
                            skills={selectedOpportunity.missingSkills}
                            skillMatchScore={selectedOpportunity.skillMatchScore}
                        />
                    ) : null}
                </div>

                <div className="opx-module opx-module-momentum">
                    {dashboard?.momentumData ? <MomentumChart data={dashboard.momentumData} /> : null}
                </div>

                <div className="opx-module opx-module-calendar" aria-label="Deadline calendar tip">
                    <div className="opx-calendar-hint">
                        <FiInfo /> Tip: Add this deadline to your calendar so you don't miss it!
                    </div>
                </div>
            </section>
        </div>
    );
}