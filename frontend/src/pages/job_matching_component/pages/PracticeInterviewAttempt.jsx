import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiClock, FiCheckCircle, FiAlertTriangle, FiChevronLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';
import BackToDashboardButton from '../components/BackToDashboardButton';
import '../styles/JobMatchingLayout.css';
import './practiceInterview.css';
import { getInterviewAttempt, submitInterviewAttempt } from '../../../services/interviewService';

function formatTimeMs(ms) {
    const clamped = Math.max(0, ms);
    const totalSec = Math.floor(clamped / 1000);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    return `${min}:${sec}`;
}

export default function PracticeInterviewAttempt() {
    const navigate = useNavigate();
    const { attemptId } = useParams();
    const { ready, error: authError } = useEnsureDemoAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [attempt, setAttempt] = useState(null);
    const [questions, setQuestions] = useState([]);

    const [answers, setAnswers] = useState(() => ({}));

    const [remainingMs, setRemainingMs] = useState(null);
    const timerRef = useRef(null);

    const [submitted, setSubmitted] = useState(null); // { attempt, review }

    const answeredCount = useMemo(() => {
        return Object.values(answers).filter((v) => v !== null && v !== undefined).length;
    }, [answers]);

    const loadAttempt = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getInterviewAttempt(attemptId);

            if (data?.review) {
                // Already submitted
                setSubmitted({ attempt: data.attempt, review: data.review });
                setAttempt(data.attempt);
                setQuestions([]);
                setRemainingMs(0);
                return;
            }

            setAttempt(data.attempt);
            setQuestions(Array.isArray(data.questions) ? data.questions : []);

            // initialize answers map
            const initial = {};
            (data.questions || []).forEach((q) => {
                initial[q.id] = null;
            });
            setAnswers(initial);

            const expiresAt = new Date(data.attempt.expiresAt).getTime();
            setRemainingMs(Math.max(0, expiresAt - Date.now()));
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to load attempt');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!ready) return;
        if (authError) {
            setError(authError);
            return;
        }
        if (!attemptId) {
            setError('Missing attempt id');
            return;
        }

        loadAttempt();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, authError, attemptId]);

    useEffect(() => {
        if (!attempt?.expiresAt) return;
        if (submitted) return;

        const expiresAt = new Date(attempt.expiresAt).getTime();

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            const ms = Math.max(0, expiresAt - Date.now());
            setRemainingMs(ms);

            if (ms <= 0) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                // Auto-submit when time is up
                void handleSubmit(true);
            }
        }, 250);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attempt?.expiresAt, submitted]);

    const handleSelect = (questionId, optionIndex) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = async (isAuto = false) => {
        if (loading) return;
        if (submitted) return;

        setLoading(true);
        setError('');

        try {
            const payload = Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
                questionId,
                selectedOptionIndex
            }));

            const data = await submitInterviewAttempt(attemptId, payload);
            setSubmitted({ attempt: data.attempt, review: data.review });
            setAttempt(data.attempt);
            setQuestions([]);
            setRemainingMs(0);
        } catch (e) {
            // If autosubmit fails, keep user on paper with message
            const msg = e?.response?.data?.message || 'Unable to submit paper';
            setError(isAuto ? `Time is up, but submit failed: ${msg}` : msg);
        } finally {
            setLoading(false);
        }
    };

    const headerTitle = attempt
        ? `${attempt.role} • Paper ${attempt.paperNumber}`
        : 'Practice Interview';

    if (submitted) {
        const score = submitted.attempt?.score;
        const incorrect = (submitted.review || []).filter((q) => !q.isCorrect);

        return (
            <div className="page">
                <div className="container">
                    <BackToDashboardButton />
                    <header className="practice-header glass-panel">
                        <button className="practice-back" onClick={() => navigate('/job-matching/practice-interview')}>
                            <FiChevronLeft /> Back
                        </button>
                        <div className="practice-header-title">
                            <h2 className="practice-h2">{headerTitle}</h2>
                            <p className="practice-subtitle">Results</p>
                        </div>
                        <div className="practice-timer">
                            <FiCheckCircle /> Submitted
                        </div>
                    </header>

                    <section className="practice-panel glass-panel">
                        <div className="practice-score-row">
                            <div className="practice-score-card">
                                <div className="practice-score-label">Score</div>
                                <div className="practice-score-value">{score?.correct}/{score?.total}</div>
                                <div className="practice-score-meta">{score?.percent}%</div>
                            </div>
                            <div className="practice-score-card">
                                <div className="practice-score-label">Incorrect</div>
                                <div className="practice-score-value">{incorrect.length}</div>
                                <div className="practice-score-meta">Review below</div>
                            </div>
                        </div>

                        {incorrect.length === 0 ? (
                            <div className="practice-success">
                                <FiCheckCircle /> Perfect score — great job!
                            </div>
                        ) : (
                            <div className="practice-review">
                                {incorrect.map((q) => (
                                    <div key={q.id} className="practice-review-item">
                                        <div className="practice-qhead">
                                            <div className="practice-qnum">Q{q.questionNumber}</div>
                                            <div className="practice-qtext">{q.question}</div>
                                        </div>
                                        <div className="practice-qmeta">
                                            <div>
                                                <span className="practice-badge wrong">Your answer:</span>
                                                <span className="practice-answer">
                                                    {q.selectedOptionIndex === null ? 'No answer' : q.options[q.selectedOptionIndex]}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="practice-badge correct">Correct:</span>
                                                <span className="practice-answer">{q.options[q.correctOptionIndex]}</span>
                                            </div>
                                        </div>
                                        <div className="practice-expl">
                                            <div className="practice-expl-title">Why it’s wrong</div>
                                            <div className="practice-expl-text">{q.explanation || '—'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <BackToDashboardButton />
                <header className="practice-header glass-panel">
                    <button className="practice-back" onClick={() => navigate('/job-matching/practice-interview')}>
                        <FiChevronLeft /> Back
                    </button>
                    <div className="practice-header-title">
                        <h2 className="practice-h2">{headerTitle}</h2>
                        <p className="practice-subtitle">10 questions • 10 minutes</p>
                    </div>
                    <div className={`practice-timer ${remainingMs !== null && remainingMs <= 60_000 ? 'danger' : ''}`}>
                        <FiClock /> {remainingMs === null ? '--:--' : formatTimeMs(remainingMs)}
                    </div>
                </header>

                {error && (
                    <div className="practice-alert glass-panel" role="alert">
                        <FiAlertTriangle />
                        <span>{error}</span>
                    </div>
                )}

                <section className="practice-panel glass-panel">
                    <div className="practice-progress">
                        <div className="practice-progress-left">
                            Answered: <strong>{answeredCount}</strong> / {questions.length}
                        </div>
                        <button
                            className="practice-done"
                            disabled={loading || !questions.length}
                            onClick={() => handleSubmit(false)}
                        >
                            Done
                        </button>
                    </div>

                    <div className="practice-question-list">
                        {questions.map((q) => (
                            <div key={q.id} className="practice-question">
                                <div className="practice-qhead">
                                    <div className="practice-qnum">Q{q.questionNumber}</div>
                                    <div className="practice-qtext">{q.question}</div>
                                </div>

                                <div className="practice-options">
                                    {q.options.map((opt, idx) => {
                                        const checked = answers[q.id] === idx;
                                        return (
                                            <label key={`${q.id}-${idx}`} className={`practice-option ${checked ? 'selected' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    checked={checked}
                                                    onChange={() => handleSelect(q.id, idx)}
                                                />
                                                <span className="practice-opt-text">{opt}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
