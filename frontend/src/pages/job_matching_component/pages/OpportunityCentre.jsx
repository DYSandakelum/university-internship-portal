import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiAlertCircle, FiArrowLeft, FiArrowRight, FiInfo, FiTarget } from 'react-icons/fi';
import { jobService } from '../../../services/jobService';
import BackToDashboardButton from '../components/BackToDashboardButton';
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

    const [savedJobs, setSavedJobs] = useState([]);
    const [selectedSavedJobId, setSelectedSavedJobId] = useState(null);

    const scrollerRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        const loadOpportunityForJob = async (jobId) => {
            try {
                const result = await jobService.calculateJobOpportunity(jobId);
                if (!mounted) return;
                setSelectedOpportunity(result?.data || null);
            } catch {
                if (!mounted) return;
                setSelectedOpportunity(null);
            }
        };

        const load = async () => {
            try {
                setLoading(true);
                setError('');
                const [response, saved] = await Promise.all([
                    jobService.getOpportunityDashboard(),
                    jobService.getSavedJobs().catch(() => [])
                ]);
                if (!mounted) return;
                setDashboard(response.data);

                const savedJobsList = Array.isArray(saved) ? saved : [];
                setSavedJobs(savedJobsList);

                const firstSavedJob = savedJobsList?.[0]?.jobId || null;
                if (firstSavedJob?._id) {
                    setSelectedSavedJobId(String(firstSavedJob._id));
                    await loadOpportunityForJob(firstSavedJob._id);
                } else {
                    setSelectedSavedJobId(null);
                    setSelectedOpportunity(null);
                }
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

    const savedJobItems = useMemo(() => {
        return (savedJobs || []).map((s) => s?.jobId).filter(Boolean);
    }, [savedJobs]);

    const scrollBy = (dx) => {
        if (!scrollerRef.current) return;
        scrollerRef.current.scrollBy({ left: dx, behavior: 'smooth' });
    };

    if (loading && !dashboard) {
        return (
            <div className="opx-page">
                <BackToDashboardButton />
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
                <BackToDashboardButton />
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
            <BackToDashboardButton />
            <header className="opx-header">
                <h1 className="opx-title">
                    <FiTarget /> Opportunity Mission Board
                </h1>
            </header>

            <section className="opx-selector" aria-label="Saved jobs">
                <button
                    type="button"
                    className="opx-arrow opx-arrow-left"
                    onClick={() => scrollBy(-SCROLL_STEP_PX)}
                    aria-label="Scroll saved jobs left"
                >
                    <FiArrowLeft />
                </button>

                <div className="opx-scroller" ref={scrollerRef}>
                    {savedJobItems.length > 0 ? (
                        savedJobItems.map((job) => (
                            <button
                                key={job._id}
                                type="button"
                                className={`opx-card ${selectedSavedJobId === String(job._id) ? 'is-selected' : ''}`}
                                onClick={async () => {
                                    setSelectedSavedJobId(String(job._id));
                                    try {
                                        const result = await jobService.calculateJobOpportunity(job._id);
                                        setSelectedOpportunity(result?.data || null);
                                    } catch {
                                        setSelectedOpportunity(null);
                                    }
                                }}
                                title={`${job?.title || 'Role'} at ${job?.company || 'Company'}`}
                            >
                                <div className="opx-card-top">
                                    <h2 className="opx-card-title">{job?.title}</h2>
                                    <span className="opx-pill mid">SAVED</span>
                                </div>
                                <p className="opx-card-company">{job?.company}</p>
                                <p className="opx-card-deadline">
                                    <FiInfo />
                                    {(job?.location || 'Location') + (job?.jobType ? ` • ${job.jobType}` : '')}
                                </p>
                                <div className="opx-card-bottom">
                                    <span className="opx-status not_applied">OPEN</span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="opx-empty">No saved jobs yet.</div>
                    )}
                </div>

                <button
                    type="button"
                    className="opx-arrow opx-arrow-right"
                    onClick={() => scrollBy(SCROLL_STEP_PX)}
                    aria-label="Scroll saved jobs right"
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