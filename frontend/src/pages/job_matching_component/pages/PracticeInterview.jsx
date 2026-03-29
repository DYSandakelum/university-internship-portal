import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit3, FiChevronRight, FiAlertTriangle, FiRotateCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';
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
        <div className="page">
            <div className="container">
                <header className="practice-header glass-panel">
                    <div className="practice-header-title">
                        <h2 className="practice-h2"><FiEdit3 /> Practice Interview</h2>
                        <p className="practice-subtitle">Pick a role, then attempt one paper (10 minutes, 10 MCQs).</p>
                    </div>
                </header>

                {error && (
                    <div className="practice-alert glass-panel" role="alert">
                        <FiAlertTriangle />
                        <span>{error}</span>
                    </div>
                )}

                <section className="practice-panel glass-panel">
                    <div className="practice-row">
                        <label className="practice-label">Job role</label>
                        <select
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

                        <button
                            className="practice-refresh"
                            onClick={() => {
                                // simple reload: reset role to force papers refresh
                                setRole('');
                                setPapers([]);
                                setError('');
                            }}
                            disabled={loading}
                            title="Reset selection"
                        >
                            <FiRotateCw />
                            Reset
                        </button>
                    </div>

                    <div className="practice-divider" />

                    <div className="practice-section-title">Papers</div>
                    {!role && <p className="practice-muted">Select a role to see available papers.</p>}

                    {role && papers.length === 0 && !loading && (
                        <p className="practice-muted">No papers found for this role yet.</p>
                    )}

                    <div className="practice-paper-grid">
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
                </section>
            </div>
        </div>
    );
}
