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

function pad2(n) {
    return String(n).padStart(2, '0');
}

function toIcsDateYYYYMMDD(date) {
    return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`;
}

function escapeIcsText(value) {
    return String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;');
}

function downloadDeadlineIcs({ deadlineDate, title, location, description }) {
    if (!(deadlineDate instanceof Date) || Number.isNaN(deadlineDate.getTime())) return;

    // Use all-day event (date-only) to avoid timezone issues.
    const start = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const dtStart = toIcsDateYYYYMMDD(start);
    const dtEnd = toIcsDateYYYYMMDD(end);
    const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const uid = `${Date.now()}-${Math.random().toString(16).slice(2)}@careersync`;

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//CareerSync//OpportunityCentre//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART;VALUE=DATE:${dtStart}`,
        `DTEND;VALUE=DATE:${dtEnd}`,
        `SUMMARY:${escapeIcsText(title)}`,
        location ? `LOCATION:${escapeIcsText(location)}` : null,
        description ? `DESCRIPTION:${escapeIcsText(description)}` : null,
        'END:VEVENT',
        'END:VCALENDAR'
    ]
        .filter(Boolean)
        .join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'CareerSync-Deadline.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
}

function DeadlineCalendarModule({ opportunity }) {
    const deadlineDate = opportunity?.deadlineDate ? new Date(opportunity.deadlineDate) : null;
    const deadlineValid = deadlineDate instanceof Date && !Number.isNaN(deadlineDate.getTime());

    const initialMonth = useMemo(() => {
        const base = deadlineValid ? deadlineDate : new Date();
        return new Date(base.getFullYear(), base.getMonth(), 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deadlineValid, opportunity?.deadlineDate]);

    const [monthCursor, setMonthCursor] = useState(initialMonth);

    useEffect(() => {
        setMonthCursor(initialMonth);
    }, [initialMonth]);

    const view = useMemo(() => {
        const year = monthCursor.getFullYear();
        const month = monthCursor.getMonth();
        const first = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDow = first.getDay(); // 0..6 (Sun..Sat)

        const cells = [];
        for (let i = 0; i < startDow; i++) cells.push(null);
        for (let day = 1; day <= daysInMonth; day++) {
            cells.push(new Date(year, month, day));
        }
        while (cells.length % 7 !== 0) cells.push(null);
        return { year, month, cells };
    }, [monthCursor]);

    const monthLabel = useMemo(() => {
        return monthCursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }, [monthCursor]);

    const isDeadlineDay = (d) => {
        if (!deadlineValid || !(d instanceof Date)) return false;
        return (
            d.getFullYear() === deadlineDate.getFullYear() &&
            d.getMonth() === deadlineDate.getMonth() &&
            d.getDate() === deadlineDate.getDate()
        );
    };

    const jobTitle = opportunity?.jobId?.title || opportunity?.jobTitle || 'Application Deadline';
    const company = opportunity?.jobId?.company || opportunity?.company || '';
    const summary = company ? `Application deadline: ${jobTitle} (${company})` : `Application deadline: ${jobTitle}`;
    const desc = deadlineValid
        ? `Deadline reminder from CareerSync.\n\n${summary}\nDate: ${deadlineDate.toDateString()}`
        : 'Deadline reminder from CareerSync.';

    return (
        <div className="opx-cal" aria-label="Deadline calendar">
            <div className="opx-calendar-hint">
                <FiInfo /> Tip: Add this deadline to your calendar so you don't miss it!
            </div>

            <div className="opx-cal-surface">
                <div className="opx-cal-head">
                    <div className="opx-cal-title">{monthLabel}</div>
                    <div className="opx-cal-nav">
                        <button
                            type="button"
                            className="opx-btn opx-cal-navbtn"
                            onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                            aria-label="Previous month"
                        >
                            <FiArrowLeft />
                        </button>
                        <button
                            type="button"
                            className="opx-btn opx-cal-navbtn"
                            onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                            aria-label="Next month"
                        >
                            <FiArrowRight />
                        </button>
                    </div>
                </div>

                <div className="opx-cal-grid" role="grid" aria-label="Month view">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
                        <div key={label} className="opx-cal-dow" role="columnheader">
                            {label}
                        </div>
                    ))}

                    {view.cells.map((d, idx) => (
                        <div
                            key={`${view.year}-${view.month}-${idx}`}
                            className={`opx-cal-day ${d ? '' : 'is-empty'} ${isDeadlineDay(d) ? 'is-deadline' : ''}`}
                            role="gridcell"
                            aria-label={d ? d.toDateString() : 'Empty'}
                        >
                            {d ? d.getDate() : ''}
                        </div>
                    ))}
                </div>

                <div className="opx-cal-actions">
                    <button
                        type="button"
                        className="opx-btn opx-cal-add"
                        disabled={!deadlineValid}
                        onClick={() =>
                            downloadDeadlineIcs({
                                deadlineDate,
                                title: summary,
                                location: opportunity?.jobId?.location || opportunity?.location || '',
                                description: desc
                            })
                        }
                    >
                        Add to calendar
                    </button>
                    {!deadlineValid ? <div className="opx-cal-note">Select a saved job to view its deadline.</div> : null}
                </div>
            </div>
        </div>
    );
}

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
                    <DeadlineCalendarModule opportunity={selectedOpportunity} />
                </div>
            </section>
        </div>
    );
}