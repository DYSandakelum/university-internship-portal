import React, { useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle, FiEdit3, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getInterviewPapers, getInterviewRoles, startInterviewAttempt } from '../../../services/interviewService';
import './AdvancedFiltersModal.css';
import './PracticeInterviewModal.css';

export default function PracticeInterviewModal({ open, onClose, ready = true }) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState('');
    const [availablePapers, setAvailablePapers] = useState([]);

    const paperChoices = useMemo(() => [1, 2, 3, 4, 5], []);
    const availablePaperSet = useMemo(() => new Set((availablePapers || []).map((p) => Number(p))), [availablePapers]);

    useEffect(() => {
        if (!open) return;
        setError('');
        setRole('');
        setAvailablePapers([]);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;
        if (!ready) return;

        let cancelled = false;
        const loadRoles = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getInterviewRoles();
                if (cancelled) return;
                setRoles(Array.isArray(data?.roles) ? data.roles : []);
            } catch (e) {
                if (cancelled) return;
                setError(e?.response?.data?.message || 'Unable to load roles');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadRoles();
        return () => {
            cancelled = true;
        };
    }, [open, ready]);

    useEffect(() => {
        if (!open) return;
        if (!ready) return;

        if (!role) {
            setAvailablePapers([]);
            return;
        }

        let cancelled = false;
        const loadPapers = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getInterviewPapers(role);
                if (cancelled) return;
                const next = Array.isArray(data?.papers) ? data.papers : [];
                setAvailablePapers(next.slice(0, 5));
            } catch (e) {
                if (cancelled) return;
                setAvailablePapers([]);
                setError(e?.response?.data?.message || 'Unable to load papers');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadPapers();
        return () => {
            cancelled = true;
        };
    }, [open, ready, role]);

    const handleStartPaper = async (paperNumber) => {
        if (!ready || loading) return;
        if (!role) {
            setError('Select a role first');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const data = await startInterviewAttempt({ role, paperNumber });
            const attemptId = data?.attempt?.id;
            if (!attemptId) throw new Error('Missing attemptId');

            onClose?.();
            navigate(`/job-matching/practice-interview/attempt/${attemptId}`);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to start paper');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div
            className="jm-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Practice interview"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose?.();
            }}
        >
            <div className="jm-modal pi-modal" onMouseDown={(event) => event.stopPropagation()}>
                <div className="jm-modal-header">
                    <div>
                        <h2 className="jm-modal-title"><FiEdit3 /> Practice Interview</h2>
                        <p className="jm-modal-subtitle">Select a job role and choose a paper (1–5). You’ll be taken to the MCQ page.</p>
                    </div>

                    <button className="jm-modal-close" type="button" onClick={() => onClose?.()} aria-label="Close">
                        <FiX />
                    </button>
                </div>

                <div className="jm-modal-body">
                    {error ? (
                        <div className="pi-modal-alert" role="alert">
                            <FiAlertTriangle />
                            <span>{error}</span>
                        </div>
                    ) : null}

                    <div className="pi-modal-field">
                        <label className="pi-modal-label" htmlFor="pi-role">Job role</label>
                        <select
                            id="pi-role"
                            className="pi-modal-select"
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                setError('');
                            }}
                            disabled={!ready || loading}
                        >
                            <option value="">Select a role...</option>
                            {roles.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pi-modal-section">
                        <div className="pi-modal-section-title">Papers</div>
                        {!role ? (
                            <div className="pi-modal-hint">Select a role to view Paper 1–5.</div>
                        ) : (
                            <>
                                <div className="pi-modal-paper-row" role="list" aria-label="Choose a paper">
                                    {paperChoices.map((p) => {
                                        const enabled = availablePaperSet.size === 0 ? false : availablePaperSet.has(p);
                                        return (
                                            <button
                                                key={p}
                                                type="button"
                                                className={`pi-paper ${enabled ? '' : 'is-disabled'}`}
                                                disabled={!enabled || !ready || loading}
                                                onClick={() => handleStartPaper(p)}
                                                role="listitem"
                                            >
                                                Paper {p}
                                            </button>
                                        );
                                    })}
                                </div>
                                {availablePaperSet.size === 0 && !loading ? (
                                    <div className="pi-modal-hint">No papers available for this role.</div>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
