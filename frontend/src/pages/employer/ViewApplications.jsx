import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ViewApplications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [expandedApplicationId, setExpandedApplicationId] = useState('');
    const [applicationDetailsMap, setApplicationDetailsMap] = useState({});
    const [detailLoadingId, setDetailLoadingId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [updatingId, setUpdatingId] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [interviewFormData, setInterviewFormData] = useState({});
    const [interviewSubmittingId, setInterviewSubmittingId] = useState('');
    const [interviewSuccessMap, setInterviewSuccessMap] = useState({});
    const [interviewFormHiddenMap, setInterviewFormHiddenMap] = useState({});
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyHoverId, setHistoryHoverId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        fetchApplications(token);
    }, [navigate]);

    const fetchApplications = async (tokenValue) => {
        const token = tokenValue || localStorage.getItem('token');
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/applications/employer', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch applications.');
            setApplications(Array.isArray(data) ? data : (data.applications || []));
        } catch (fetchError) {
            setError(fetchError.message || 'Unable to load applications.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            'Pending': 'badge badge-warning',
            'Reviewing': 'badge badge-info',
            'Interview': 'badge badge-purple',
            'Offered': 'badge badge-success',
            'Rejected': 'badge badge-danger'
        };
        return map[status] || 'badge badge-primary';
    };

    const handleStatusChange = async (applicationId, status) => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setUpdatingId(applicationId);
        setError('');
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update status.');
            setApplications((prev) => prev.map((app) => app._id === applicationId ? { ...app, status } : app));

            if (status === 'Interview') {
                setInterviewFormHiddenMap((prev) => ({ ...prev, [applicationId]: false }));
                setInterviewSuccessMap((prev) => ({ ...prev, [applicationId]: '' }));
            }
            
            // If changing to Reviewing, fetch and expand details
            if (status === 'Reviewing') {
                setExpandedApplicationId(applicationId);
                setDetailLoadingId(applicationId);
                try {
                    const details = await fetchApplicationDetails(applicationId);
                    setApplicationDetailsMap((prev) => ({ ...prev, [applicationId]: details }));
                } catch (detailsError) {
                    setError(detailsError.message || 'Unable to load application details.');
                } finally {
                    setDetailLoadingId('');
                }
            } else {
                // If changing away from Reviewing, collapse
                setExpandedApplicationId('');
            }
        } catch (updateError) {
            setError(updateError.message || 'Unable to update status.');
        } finally {
            setUpdatingId('');
        }
    };

    const fetchApplicationDetails = async (applicationId) => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return null; }

        const response = await fetch(`http://localhost:5000/api/applications/${applicationId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch application details.');
        return data.application || data;
    };

    const getFilteredApplications = () => {
        if (statusFilter === 'All') return applications;
        return applications.filter(app => app.status === statusFilter);
    };

    const updateInterviewFormField = (applicationId, field, value) => {
        setInterviewFormData((prev) => ({
            ...prev,
            [applicationId]: { ...(prev[applicationId] || {}), [field]: value }
        }));
    };

    const handleScheduleInterview = async (applicationId) => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        
        const formData = interviewFormData[applicationId] || {};
        if (!formData.date || !formData.time || !formData.venue) {
            setError('Please fill in all required fields (Date, Time, Venue)');
            return;
        }

        setInterviewSubmittingId(applicationId);
        setError('');
        setSuccessMessage('');
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/schedule-interview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    date: formData.date,
                    time: formData.time,
                    venue: formData.venue,
                    message: formData.message || ''
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to schedule interview.');
            setApplications((prev) => prev.map((app) => app._id === applicationId ? { ...app, interviewDetails: data.application.interviewDetails } : app));
            setInterviewFormData((prev) => ({ ...prev, [applicationId]: {} }));
            setInterviewSuccessMap((prev) => ({ ...prev, [applicationId]: 'Interview invitation sent successfully!' }));
            setInterviewFormHiddenMap((prev) => ({ ...prev, [applicationId]: true }));
        } catch (scheduleError) {
            setError(scheduleError.message || 'Unable to schedule interview.');
        } finally {
            setInterviewSubmittingId('');
        }
    };

    const handleDownloadInterviewHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        setHistoryLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/applications/employer/interview-history', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch interview history.');

            const history = Array.isArray(data) ? data : (data.history || []);
            if (!history.length) {
                setError('No interview history found to export.');
                return;
            }

            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();
            let y = 18;

            doc.setFontSize(16);
            doc.text('Interview History', 14, y);
            y += 10;

            doc.setFontSize(10);

            history.forEach((item, index) => {
                const details = item.interviewDetails || {};
                const sentDateRaw = item.updatedAt || item.createdAt;
                const sentDate = sentDateRaw ? new Date(sentDateRaw).toLocaleString() : 'N/A';

                if (y > 250) {
                    doc.addPage();
                    y = 18;
                }

                doc.setFontSize(11);
                doc.text(`Interview ${index + 1}`, 14, y);
                y += 6;
                doc.setFontSize(10);

                const lines = [
                    `Student Name: ${item.student?.name || 'N/A'}`,
                    `Student Email: ${item.student?.email || 'N/A'}`,
                    `Job Title: ${item.job?.title || 'N/A'}`,
                    `Interview Date: ${details.date || 'N/A'}`,
                    `Interview Time: ${details.time || 'N/A'}`,
                    `Venue: ${details.venue || 'N/A'}`,
                    `Message: ${details.message || 'N/A'}`,
                    `Date Sent: ${sentDate}`
                ];

                lines.forEach((line) => {
                    if (y > 278) {
                        doc.addPage();
                        y = 18;
                    }
                    doc.text(line, 14, y);
                    y += 6;
                });

                if (y > 278) {
                    doc.addPage();
                    y = 18;
                }
                doc.line(14, y, 196, y);
                y += 7;
            });

            doc.save(`interview-history-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (historyError) {
            setError(historyError.message || 'Unable to export interview history.');
        } finally {
            setHistoryLoading(false);
        }
    };

    if (loading) return (
        <div className="page-wrapper">
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">🎓</div>
                    InternHub
                </Link>
            </nav>
            <div className="loading-wrapper">
                <div className="spinner"></div>
                <p>Loading applications...</p>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">🎓</div>
                    InternHub
                </Link>
                <div className="navbar-links">
                    <Link to="/employer/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/employer/my-jobs" className="nav-link">My Jobs</Link>
                    <Link to="/employer/profile" className="nav-link">Profile</Link>
                </div>
            </nav>

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <div>
                        <h1 style={styles.pageTitle}>Applications</h1>
                        <p style={styles.pageSubtitle}>Review and manage student applications</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <select
                            className="form-input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ width: '180px', height: '42px', fontSize: '13px', fontWeight: '600', border: '2px solid #E5E7EB', borderRadius: '12px', background: '#ffffff', color: '#0F172A', cursor: 'pointer', transition: 'all 0.3s' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Reviewing">Reviewing</option>
                            <option value="Interview">Interview</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <div style={styles.totalPill}>{getFilteredApplications().length} showing</div>
                    </div>
                </div>
            </div>

            <div className="main-content">
                {error && <div className="alert alert-error">⚠️ {error}</div>}
                {successMessage && <div className="alert alert-success">✅ {successMessage}</div>}

                {getFilteredApplications().length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
                        <p style={styles.emptyTitle}>{applications.length === 0 ? 'No applications yet' : 'No applications match this filter'}</p>
                        <p style={styles.emptySubtitle}>{applications.length === 0 ? 'Applications will appear here when students apply to your jobs' : 'Try selecting a different status or view all applications'}</p>
                    </div>
                ) : (
                    <div style={styles.listCard}>
                        {getFilteredApplications().map((application, index) => (
                            <div key={application._id} style={{ borderTop: index === 0 ? 'none' : '1px solid #E7E2D9' }}>
                                <div
                                    style={{
                                        ...styles.appRow,
                                        ...(application.status === 'Reviewing' ? styles.appRowExpanded : {})
                                    }}
                                >
                                    <div style={styles.studentAvatar}>
                                        {application.student?.name?.[0] || '👤'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={styles.studentName}>
                                            {application.student?.name || application.studentName || 'Student'}
                                        </h3>
                                        <div style={styles.appMeta}>
                                            <span>✉️ {application.student?.email || application.email || 'N/A'}</span>
                                            <span>💼 {application.job?.title || application.jobTitle || 'N/A'}</span>
                                            <span>📅 {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div style={styles.appRight}>
                                        <span className={getStatusBadge(application.status || 'Pending')}>
                                            {application.status || 'Pending'}
                                        </span>
                                        <select
                                            className="form-input"
                                            value={application.status || 'Pending'}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                            disabled={updatingId === application._id}
                                            style={{ width: '170px', height: '40px', fontSize: '13px', fontWeight: '600', border: '2px solid #E5E7EB', borderRadius: '10px', background: '#ffffff', color: '#0F172A', cursor: 'pointer', transition: 'all 0.3s' }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Reviewing">Reviewing</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Offered">Offered</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                {application.status === 'Reviewing' && (
                                    <div style={styles.detailsPanel}>
                                        {detailLoadingId === application._id ? (
                                            <p style={styles.detailsLoading}>Loading details...</p>
                                        ) : (
                                            (() => {
                                                const details = applicationDetailsMap[application._id] || application;
                                                return (
                                                    <div style={styles.detailsGrid}>
                                                        <div><strong>Name:</strong> {details.student?.name || application.student?.name || 'N/A'}</div>
                                                        <div><strong>Email:</strong> {details.student?.email || application.student?.email || 'N/A'}</div>
                                                        <div style={styles.detailsFullRow}><strong>Cover Letter:</strong> {details.coverLetter || 'N/A'}</div>
                                                        <div><strong>Applied Date:</strong> {details.appliedAt ? new Date(details.appliedAt).toLocaleString() : 'N/A'}</div>
                                                    </div>
                                                );
                                            })()
                                        )}
                                    </div>
                                )}

                                    {application.status === 'Interview' && (
                                        <div style={styles.interviewFormPanel}>
                                            {!interviewFormHiddenMap[application._id] && (
                                                <>
                                                    <h4 style={styles.interviewFormTitle}>Schedule Interview</h4>
                                                    <div style={styles.interviewFormGrid}>
                                                        <div>
                                                            <label style={styles.formLabel}>Date</label>
                                                            <input
                                                                type="date"
                                                                value={interviewFormData[application._id]?.date || ''}
                                                                onChange={(e) => updateInterviewFormField(application._id, 'date', e.target.value)}
                                                                style={styles.formInput}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label style={styles.formLabel}>Time</label>
                                                            <input
                                                                type="time"
                                                                value={interviewFormData[application._id]?.time || ''}
                                                                onChange={(e) => updateInterviewFormField(application._id, 'time', e.target.value)}
                                                                style={styles.formInput}
                                                            />
                                                        </div>
                                                        <div style={{ gridColumn: '1 / -1' }}>
                                                            <label style={styles.formLabel}>Venue</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter interview venue or link"
                                                                value={interviewFormData[application._id]?.venue || ''}
                                                                onChange={(e) => updateInterviewFormField(application._id, 'venue', e.target.value)}
                                                                style={styles.formInput}
                                                            />
                                                        </div>
                                                        <div style={{ gridColumn: '1 / -1' }}>
                                                            <label style={styles.formLabel}>Message (Optional)</label>
                                                            <textarea
                                                                placeholder="Add any additional notes or instructions for the student"
                                                                value={interviewFormData[application._id]?.message || ''}
                                                                onChange={(e) => updateInterviewFormField(application._id, 'message', e.target.value)}
                                                                style={{ ...styles.formInput, minHeight: '80px', fontFamily: 'inherit' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleScheduleInterview(application._id)}
                                                        disabled={interviewSubmittingId === application._id}
                                                        style={{
                                                            ...styles.interviewSubmitButton,
                                                            opacity: interviewSubmittingId === application._id ? 0.7 : 1,
                                                            cursor: interviewSubmittingId === application._id ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {interviewSubmittingId === application._id ? 'Scheduling...' : 'Schedule Interview'}
                                                    </button>
                                                    <div style={styles.historyButtonWrap}>
                                                        <button
                                                            onClick={handleDownloadInterviewHistory}
                                                            onMouseEnter={() => setHistoryHoverId(application._id)}
                                                            onMouseLeave={() => setHistoryHoverId('')}
                                                            disabled={historyLoading}
                                                            style={{
                                                                ...styles.historyButton,
                                                                color: historyHoverId === application._id ? '#D97706' : '#6B7280',
                                                                opacity: historyLoading ? 0.7 : 1,
                                                                cursor: historyLoading ? 'not-allowed' : 'pointer'
                                                            }}
                                                        >
                                                            {historyLoading ? 'Generating...' : 'History'}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                            {interviewSuccessMap[application._id] && (
                                                <div className="alert alert-success" style={{ marginTop: '12px' }}>
                                                    ✅ {interviewSuccessMap[application._id]}
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

const styles = {
    pageHeader: { background: 'linear-gradient(135deg, #ffffff 0%, #F9FAFB 100%)', borderBottom: '2px solid #E5E7EB', padding: '40px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    pageTitle: { fontSize: '32px', fontWeight: '900', color: '#0F172A', letterSpacing: '-1px', margin: 0, background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    pageSubtitle: { fontSize: '15px', color: '#64748B', marginTop: '8px', fontWeight: '500' },
    totalPill: { background: 'linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)', color: '#92400E', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)', letterSpacing: '0.5px' },
    listCard: { background: '#ffffff', border: '2px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' },
    appRow: { 
        padding: '24px 28px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        borderBottom: '1px solid #F3F4F6',
        '&:hover': { background: '#F9FAFB' }
    },
    appRowExpanded: { background: 'linear-gradient(135deg, #FFFBF0 0%, #FEF9E7 100%)', borderBottom: '2px solid #FDE047', boxShadow: 'inset 0 2px 8px rgba(253, 224, 71, 0.1)' },
    studentAvatar: { width: '50px', height: '50px', background: 'linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '900', color: '#92400E', flexShrink: 0, boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)' },
    studentName: { fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0, marginBottom: '6px', letterSpacing: '-0.3px' },
    appMeta: { display: 'flex', gap: '20px', fontSize: '13px', color: '#64748B', flexWrap: 'wrap', fontWeight: '500' },
    appRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 },
    detailsPanel: { 
        padding: '24px 28px', 
        borderTop: '2px solid #FDE047', 
        background: 'linear-gradient(135deg, #FFFBF0 0%, #FEF9E7 100%)',
        boxShadow: 'inset 0 4px 12px rgba(253, 224, 71, 0.12)'
    },
    detailsLoading: { margin: '16px 0 8px 0', fontSize: '14px', color: '#64748B', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' },
    detailsGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '16px', 
        marginTop: '16px', 
        fontSize: '14px', 
        color: '#334155',
        lineHeight: '1.6'
    },
    detailsFullRow: { gridColumn: '1 / -1', borderLeft: '4px solid #FCD34D', paddingLeft: '16px', background: '#FFFBF0', padding: '12px 16px', borderRadius: '8px' },
    emptyState: { background: 'linear-gradient(135deg, #ffffff 0%, #F9FAFB 100%)', border: '2px dashed #CBD5E1', borderRadius: '20px', padding: '80px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    emptyTitle: { fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.5px' },
    emptySubtitle: { fontSize: '15px', color: '#64748B', marginTop: '12px', maxWidth: '380px', fontWeight: '500' },
    interviewFormPanel: { 
        padding: '24px 28px', 
        borderTop: '2px solid #A78BFA', 
        background: 'linear-gradient(135deg, #F5F3FF 0%, #FAF5FF 100%)',
        boxShadow: 'inset 0 4px 12px rgba(167, 139, 250, 0.1)'
    },
    interviewFormTitle: { fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 16px 0', letterSpacing: '-0.3px' },
    interviewFormGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' },
    formLabel: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px', letterSpacing: '0.3px' },
    formInput: { width: '100%', padding: '10px 12px', fontSize: '13px', border: '2px solid #E5E7EB', borderRadius: '8px', background: '#ffffff', color: '#0F172A', fontWeight: '500', transition: 'all 0.3s', boxSizing: 'border-box' },
    interviewSubmitButton: { background: 'linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)', color: '#92400E', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', border: 'none', boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)', transition: 'all 0.3s', letterSpacing: '0.5px' },
    historyButtonWrap: { marginTop: '12px', display: 'flex', justifyContent: 'flex-start' },
    historyButton: { background: 'none', color: '#6B7280', border: 'none', fontSize: '12px', fontWeight: '600', padding: 0, textDecoration: 'none', transition: 'color 0.2s' }
};

export default ViewApplications;