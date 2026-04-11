import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit3, FiChevronRight, FiAlertTriangle, FiRotateCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';
import BackToDashboardButton from '../components/BackToDashboardButton';
import '../styles/JobMatchingLayout.css';
import './practiceInterview.css';
import { getInterviewPapers, getInterviewRoles, startInterviewAttempt } from '../../../services/interviewService';

export default function PracticeInterview() {
    const navigate = useNavigate();
    const { ready, error: authError } = useEnsureDemoAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState('');
    const [papers, setPapers] = useState([]);

    const roleOptions = useMemo(() => roles.map((r) => ({ value: r, label: r })), [roles]);

    useEffect(() => {
        if (!ready) return;
        if (authError) {
            setError(authError);
            return;
        }

        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getInterviewRoles();
                if (cancelled) return;
                setRoles(Array.isArray(data.roles) ? data.roles : []);
            } catch (e) {
                if (cancelled) return;
                setError(e?.response?.data?.message || 'Unable to load roles');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [ready, authError]);

    useEffect(() => {
        if (!ready) return;
        if (!role) {
            setPapers([]);
            return;
        }

        let cancelled = false;
        const loadPapers = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getInterviewPapers(role);
                if (cancelled) return;
                setPapers(Array.isArray(data.papers) ? data.papers : []);
            } catch (e) {
                if (cancelled) return;
                setError(e?.response?.data?.message || 'Unable to load papers');
                setPapers([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadPapers();

        return () => {
            cancelled = true;
        };
    }, [ready, role]);

    const onStartPaper = async (paperNumber) => {
        setLoading(true);
        setError('');
        try {
            const data = await startInterviewAttempt({ role, paperNumber });
            const attemptId = data?.attempt?.id;
            if (!attemptId) throw new Error('Missing attemptId');

            navigate(`/job-matching/practice-interview/attempt/${attemptId}`);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to start paper');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page practice-page">
            <div className="container">
                <BackToDashboardButton />
                <header className="practice-top glass-panel">
                    <div className="practice-top-title">
                        <h2 className="practice-h2"><FiEdit3 /> Practice Interview Sessions</h2>
                        <p className="practice-subtitle">Select a role and start a timed MCQ paper.</p>
                    </div>
                    <div className="practice-top-badges" aria-label="Practice session details">
                        <span className="practice-badge-pill">10 MCQs</span>
                        <span className="practice-badge-pill">10 minutes</span>
                        <span className="practice-badge-pill">Instant review</span>
                    </div>
                </header>

                {error && (
                    <div className="practice-alert glass-panel" role="alert">
                        <FiAlertTriangle />
                        <span>{error}</span>
                    </div>
                )}

                <section className="practice-layout">
                    <aside className="practice-left" aria-label="Setup and help">
                        <div className="practice-setup glass-panel">
                            <div className="practice-section-title">Setup</div>

                            <div className="practice-setup-row">
                                <div className="practice-setup-field">
                                    <label className="practice-label" htmlFor="practice-role">Choose role</label>
                                    <select
                                        id="practice-role"
                                        className="practice-select"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        disabled={loading || !ready}
                                    >
                                        <option value="">Select a role...</option>
                                        {roleOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    className="practice-refresh"
                                    onClick={() => {
                                        setRole('');
                                        setPapers([]);
                                        setError('');
                                    }}
                                    disabled={loading}
                                    title="Reset selection"
                                >
                                    <FiRotateCw /> Reset
                                </button>
                            </div>
                        </div>

                        <div className="practice-help-card glass-panel">
                            <div className="practice-help-title">How it works</div>
                            <ul className="practice-help-list">
                                <li>Pick a role to load available papers.</li>
                                <li>Each paper is timed (10 minutes).</li>
                                <li>You’ll see an instant review after submission.</li>
                            </ul>
                        </div>
                    </aside>

                    <div className="practice-sessions glass-panel">
                        <div className="practice-sessions-head">
                            <div className="practice-section-title">Sessions</div>
                            <div className="practice-sessions-meta">
                                {role ? `Role: ${role} • Papers: ${papers.length}` : 'Select a role to view papers'}
                            </div>
                        </div>

                        {!role && (
                            <div className="practice-empty" role="status">
                                <div className="practice-empty-icon"><FiEdit3 /></div>
                                <div className="practice-empty-title">Choose a role to see available papers</div>
                                <div className="practice-empty-text">Start a timed paper and get an instant review after submission.</div>
                            </div>
                        )}
                        {role && papers.length === 0 && !loading && (
                            <p className="practice-muted">No papers found for this role yet.</p>
                        )}

                        <div className="practice-paper-grid" aria-label="Available papers">
                            {papers.map((p) => (
                                <button
                                    key={p}
                                    className="practice-paper-card"
                                    disabled={loading}
                                    onClick={() => onStartPaper(p)}
                                >
                                    <div className="practice-paper-title">Paper {p}</div>
                                    <div className="practice-paper-meta">10 questions • 10 minutes</div>
                                    <div className="practice-paper-cta">Start <FiChevronRight /></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
