import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SECTIONS = [
    { key: 'summary', label: 'Summary' },
    { key: 'education', label: 'Education' },
    { key: 'projects', label: 'Projects' },
    { key: 'skills', label: 'Technical Skills' },
    { key: 'interests', label: 'Interests' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'referees', label: 'Referees' }
];

const defaultData = {
    fullName: '', email: '', phone: '', location: '', linkedin: '', github: '',
    summary: '',
    education: [{ degree: '', institution: '', period: '', description: '' }],
    projects: [{ name: '', description: '', technologies: '' }],
    skills: { languages: '', frontend: '', backend: '', databases: '', tools: '', others: '' },
    interests: [''],
    certifications: [{ name: '', issuer: '', status: '' }],
    referees: [{ name: '', title: '', email: '' }]
};

export default function CVGeneratorPage() {
    const { user } = useAuth();
    const cvRef = useRef(null);
    const [step, setStep] = useState('form'); // form | preview
    const [downloading, setDownloading] = useState(false);
    const [enabledSections, setEnabledSections] = useState({
        summary: true, education: true, projects: true,
        skills: true, interests: true, certifications: true, referees: true
    });
    const [data, setData] = useState(defaultData);

    // Auto-fill from profile
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/student/profile');
                const p = res.data.profile;
                if (p) {
                    setData(prev => ({
                        ...prev,
                        fullName: user?.name || '',
                        email: user?.email || '',
                        phone: p.phone || '',
                        location: '',
                        linkedin: p.linkedIn || '',
                        github: p.github || '',
                        summary: p.bio || '',
                        skills: {
                            ...prev.skills,
                            frontend: '',
                            backend: '',
                            databases: '',
                            tools: '',
                            others: p.skills?.join(', ') || ''
                        },
                        interests: p.availability ? [p.availability] : ['']
                    }));
                } else {
                    setData(prev => ({
                        ...prev,
                        fullName: user?.name || '',
                        email: user?.email || ''
                    }));
                }
            } catch {
                setData(prev => ({
                    ...prev,
                    fullName: user?.name || '',
                    email: user?.email || ''
                }));
            }
        };
        loadProfile();
    }, [user]);

    // ─── Handlers ───────────────────────────────────────────

    const toggleSection = (key) => {
        setEnabledSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const setField = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const setSkill = (field, value) => {
        setData(prev => ({ ...prev, skills: { ...prev.skills, [field]: value } }));
    };

    // Education
    const addEducation = () => setData(prev => ({
        ...prev, education: [...prev.education, { degree: '', institution: '', period: '', description: '' }]
    }));
    const removeEducation = (i) => setData(prev => ({
        ...prev, education: prev.education.filter((_, idx) => idx !== i)
    }));
    const setEducation = (i, field, value) => setData(prev => ({
        ...prev, education: prev.education.map((e, idx) => idx === i ? { ...e, [field]: value } : e)
    }));

    // Projects
    const addProject = () => setData(prev => ({
        ...prev, projects: [...prev.projects, { name: '', description: '', technologies: '' }]
    }));
    const removeProject = (i) => setData(prev => ({
        ...prev, projects: prev.projects.filter((_, idx) => idx !== i)
    }));
    const setProject = (i, field, value) => setData(prev => ({
        ...prev, projects: prev.projects.map((p, idx) => idx === i ? { ...p, [field]: value } : p)
    }));

    // Interests
    const addInterest = () => setData(prev => ({ ...prev, interests: [...prev.interests, ''] }));
    const removeInterest = (i) => setData(prev => ({
        ...prev, interests: prev.interests.filter((_, idx) => idx !== i)
    }));
    const setInterest = (i, value) => setData(prev => ({
        ...prev, interests: prev.interests.map((x, idx) => idx === i ? value : x)
    }));

    // Certifications
    const addCert = () => setData(prev => ({
        ...prev, certifications: [...prev.certifications, { name: '', issuer: '', status: '' }]
    }));
    const removeCert = (i) => setData(prev => ({
        ...prev, certifications: prev.certifications.filter((_, idx) => idx !== i)
    }));
    const setCert = (i, field, value) => setData(prev => ({
        ...prev, certifications: prev.certifications.map((c, idx) => idx === i ? { ...c, [field]: value } : c)
    }));

    // Referees
    const addReferee = () => setData(prev => ({
        ...prev, referees: [...prev.referees, { name: '', title: '', email: '' }]
    }));
    const removeReferee = (i) => setData(prev => ({
        ...prev, referees: prev.referees.filter((_, idx) => idx !== i)
    }));
    const setReferee = (i, field, value) => setData(prev => ({
        ...prev, referees: prev.referees.map((r, idx) => idx === i ? { ...r, [field]: value } : r)
    }));

    // ─── Download PDF ────────────────────────────────────────

    const handleDownload = async () => {
        if (!cvRef.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(cvRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;
            const pageHeightPx = (imgWidth / pdfWidth) * pdfHeight;
            let yOffset = 0;
            let pageNum = 0;
            while (yOffset < imgHeight) {
                if (pageNum > 0) pdf.addPage();
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = imgWidth;
                sliceCanvas.height = Math.min(pageHeightPx, imgHeight - yOffset);
                const ctx = sliceCanvas.getContext('2d');
                ctx.drawImage(canvas, 0, yOffset, imgWidth, sliceCanvas.height, 0, 0, imgWidth, sliceCanvas.height);
                const sliceData = sliceCanvas.toDataURL('image/png');
                const sliceHeightMm = (sliceCanvas.height / imgWidth) * pdfWidth;
                pdf.addImage(sliceData, 'PNG', 0, 0, pdfWidth, sliceHeightMm);
                yOffset += pageHeightPx;
                pageNum++;
            }
            pdf.save(`${data.fullName || 'CV'}_CV.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
        } finally {
            setDownloading(false);
        }
    };

    // ─── Render ──────────────────────────────────────────────

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <div>
                        <h1 style={styles.pageTitle}>📄 CV Generator</h1>
                        <p style={styles.pageSubtitle}>
                            {step === 'form'
                                ? 'Fill in your details and choose which sections to include'
                                : 'Preview your CV — download as PDF when ready'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {step === 'preview' && (
                            <>
                                <button onClick={() => setStep('form')} className="btn btn-outline">
                                    ← Edit
                                </button>
                                <button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className={`btn ${downloading ? 'btn-disabled' : 'btn-amber'}`}
                                >
                                    {downloading ? 'Generating PDF...' : '⬇️ Download PDF'}
                                </button>
                            </>
                        )}
                        {step === 'form' && (
                            <button onClick={() => setStep('preview')} className="btn btn-amber">
                                Preview CV →
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="main-content">
                {step === 'form' ? (
                    <div className="grid-sidebar" style={{ gap: '24px', alignItems: 'start' }}>

                        {/* Left — Section Toggles */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* Section Toggle */}
                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}>Choose Sections</h2>
                                <div style={styles.sectionBody}>
                                    {SECTIONS.map(s => (
                                        <label key={s.key} style={styles.toggleRow}>
                                            <input
                                                type="checkbox"
                                                checked={enabledSections[s.key]}
                                                onChange={() => toggleSection(s.key)}
                                                style={styles.checkbox}
                                            />
                                            <span style={styles.toggleLabel}>{s.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Personal Info */}
                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}>Personal Information</h2>
                                <div style={styles.sectionBody}>
                                    {[
                                        { field: 'fullName', label: 'Full Name', placeholder: 'Yasas Sandakelum' },
                                        { field: 'email', label: 'Email', placeholder: 'you@email.com' },
                                        { field: 'phone', label: 'Phone', placeholder: '+94 78 540 8180' },
                                        { field: 'location', label: 'Location', placeholder: 'Kegalle, Sri Lanka' },
                                        { field: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/...' },
                                        { field: 'github', label: 'GitHub URL', placeholder: 'github.com/...' }
                                    ].map(({ field, label, placeholder }) => (
                                        <div key={field} className="form-group">
                                            <label className="form-label">{label}</label>
                                            <input
                                                type="text"
                                                value={data[field]}
                                                onChange={e => setField(field, e.target.value)}
                                                placeholder={placeholder}
                                                className="form-input"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            {enabledSections.summary && (
                                <div style={styles.section}>
                                    <h2 style={styles.sectionTitle}>Summary</h2>
                                    <div style={styles.sectionBody}>
                                        <textarea
                                            value={data.summary}
                                            onChange={e => setField('summary', e.target.value)}
                                            placeholder="Write a short professional summary..."
                                            className="form-textarea"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {enabledSections.education && (
                                <div style={styles.section}>
                                    <h2 style={styles.sectionTitle}>Education</h2>
                                    <div style={styles.sectionBody}>
                                        {data.education.map((edu, i) => (
                                            <div key={i} style={styles.entryBox}>
                                                {data.education.length > 1 && (
                                                    <button onClick={() => removeEducation(i)} style={styles.removeBtn}>✕</button>
                                                )}
                                                <div className="form-group">
                                                    <label className="form-label">Degree / Qualification</label>
                                                    <input type="text" value={edu.degree}
                                                        onChange={e => setEducation(i, 'degree', e.target.value)}
                                                        placeholder="Bsc (Hons) Information Technology"
                                                        className="form-input" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Institution</label>
                                                    <input type="text" value={edu.institution}
                                                        onChange={e => setEducation(i, 'institution', e.target.value)}
                                                        placeholder="SLIIT"
                                                        className="form-input" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Period</label>
                                                    <input type="text" value={edu.period}
                                                        onChange={e => setEducation(i, 'period', e.target.value)}
                                                        placeholder="Oct 2023 - Present"
                                                        className="form-input" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Description (optional)</label>
                                                    <input type="text" value={edu.description}
                                                        onChange={e => setEducation(i, 'description', e.target.value)}
                                                        placeholder="Additional details..."
                                                        className="form-input" />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={addEducation} className="btn btn-ghost btn-sm">
                                            + Add Education
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Projects */}
                            {enabledSections.projects && (
                                <div style={styles.section}>
                                    <h2 style={styles.sectionTitle}>Projects</h2>
                                    <div style={styles.sectionBody}>
                                        {data.projects.map((proj, i) => (
                                            <div key={i} style={styles.entryBox}>
                                                {data.projects.length > 1 && (
                                                    <button onClick={() => removeProject(i)} style={styles.removeBtn}>✕</button>
                                                )}
                                                <div className="form-group">
                                                    <label className="form-label">Project Name</label>
                                                    <input type="text" value={proj.name}
                                                        onChange={e => setProject(i, 'name', e.target.value)}
                                                        placeholder="Online Exam Management System"
                                                        className="form-input" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Description</label>
                                                    <textarea value={proj.description}
                                                        onChange={e => setProject(i, 'description', e.target.value)}
                                                        placeholder="Brief description of the project..."
                                                        className="form-textarea" rows={2} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Technologies Used</label>
                                                    <input type="text" value={proj.technologies}
                                                        onChange={e => setProject(i, 'technologies', e.target.value)}
                                                        placeholder="HTML, CSS, JavaScript, PHP"
                                                        className="form-input" />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={addProject} className="btn btn-ghost btn-sm">
                                            + Add Project
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {enabledSections.skills && (
                                <div style={styles.section}>
                                    <h2 style={styles.sectionTitle}>Technical Skills</h2>
                                    <div style={styles.sectionBody}>
                                        {[
                                            { field: 'languages', label: 'Programming Languages', placeholder: 'Java, Python, C/C++' },
                                            { field: 'frontend', label: 'Frontend', placeholder: 'HTML5, CSS3, React.js, Tailwind CSS' },
                                            { field: 'backend', label: 'Backend', placeholder: 'Node.js, Express.js, REST APIs' },
                                            { field: 'databases', label: 'Databases', placeholder: 'MySQL, MongoDB' },
                                            { field: 'tools', label: 'Version Control & Tools', placeholder: 'Git, GitHub, Postman, VS Code' },
                                            { field: 'others', label: 'Others', placeholder: 'OOP Concepts, Data Structures' }
                                        ].map(({ field, label, placeholder }) => (
                                            <div key={field} className="form-group">
                                                <label className="form-label">{label}</label>
                                                <input type="text" value={data.skills[field]}
                                                    onChange={e => setSkill(field, e.target.value)}
                                                    placeholder={placeholder}
                                                    className="form-input" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Interests */}
                            {enabledSections.interests && (
                                <div style={styles.section}>
                                    <h2 style={styles.sectionTitle}>Interests</h2>
                                    <div style={styles.sectionBody}>
                                        {data.interests.map((interest, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <input type="text" value={interest}
                                                    onChange={e => setInterest(i, e.target.value)}
                                                    placeholder="e.g. Web Development"
                                                    className="form-input" />
                                                {data.interests.length > 1 && (
                                                    <button onClick={() => removeInterest(i)} style={styles.removeBtn}>✕</button>
                                                )}
                                            </div>
                                        ))}
                                        <button onClick={addInterest} className="btn btn-ghost btn-sm">
                                            + Add Interest
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Certifications */}
                            {enabledSections.certifications && (
                                <div style={styles.section}>
                                    <h2 style={styles.sectionTitle}>Certifications</h2>
                                    <div style={styles.sectionBody}>
                                        {data.certifications.map((cert, i) => (
                                            <div key={i} style={styles.entryBox}>
                                                {data.certifications.length > 1 && (
                                                    <button onClick={() => removeCert(i)} style={styles.removeBtn}>✕</button>
                                                )}
                                                <div className="form-group">
                                                    <label className="form-label">Certification Name</label>
                                                    <input type="text" value={cert.name}
                                                        onChange={e => setCert(i, 'name', e.target.value)}
                                                        placeholder="Responsive Web Design"
                                                        className="form-input" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Issuer</label>
                                                    <input type="text" value={cert.issuer}
                                                        onChange={e => setCert(i, 'issuer', e.target.value)}
                                                        placeholder="freeCodeCamp"
                                                        className="form-input" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Status</label>
                                                    <input type="text" value={cert.status}
                                                        onChange={e => setCert(i, 'status', e.target.value)}
                                                        placeholder="100% Completed"
                                                        className="form-input" />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={addCert} className="btn btn-ghost btn-sm">
                                            + Add Certification
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Referees */}
                            {enabledSections.referees && (
                                <div style={styles.section}>
                                    <h2 style={styles.sectionTitle}>Referees</h2>
                                    <div style={styles.sectionBody}>
                                        {data.referees.map((ref, i) => (
                                            <div key={i} style={styles.entryBox}>
                                                {data.referees.length > 1 && (
                                                    <button onClick={() => removeReferee(i)} style={styles.removeBtn}>✕</button>
                                                )}
                                                <div className="form-group">
                                                    <label className="form-label">Name</label>
                                                    <input type="text" value={ref.name}
                                                        onChange={e => setReferee(i, 'name', e.target.value)}
                                                        placeholder="Mr. SMB Harshanath"
                                                        className="form-input" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Title / Position</label>
                                                    <input type="text" value={ref.title}
                                                        onChange={e => setReferee(i, 'title', e.target.value)}
                                                        placeholder="Lecturer, Department of IT, SLIIT"
                                                        className="form-input" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Email</label>
                                                    <input type="email" value={ref.email}
                                                        onChange={e => setReferee(i, 'email', e.target.value)}
                                                        placeholder="harshanath.s@sliit.lk"
                                                        className="form-input" />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={addReferee} className="btn btn-ghost btn-sm">
                                            + Add Referee
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setStep('preview')} className="btn btn-amber btn-full btn-lg">
                                Preview CV →
                            </button>
                        </div>

                        {/* Right — Live Mini Preview */}
                        <div style={styles.miniPreviewWrapper}>
                            <p style={styles.miniPreviewLabel}>Live Preview</p>
                            <div style={styles.miniPreviewScaler}>
                                <CVTemplate data={data} enabledSections={enabledSections} />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Full Preview */
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                        <div style={styles.previewWrapper}>
                            <div ref={cvRef}>
                                <CVTemplate data={data} enabledSections={enabledSections} full />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setStep('form')} className="btn btn-outline">
                                ← Back to Edit
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className={`btn btn-lg ${downloading ? 'btn-disabled' : 'btn-amber'}`}
                            >
                                {downloading ? 'Generating PDF...' : '⬇️ Download PDF'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── CV Template Component ───────────────────────────────────

function CVTemplate({ data, enabledSections, full }) {
    const accentColor = '#7C3AED';
    const lightAccent = '#f5f3ff';

    const s = {
        wrapper: {
            width: full ? '210mm' : '100%',
            minHeight: full ? 'auto' : '100%',
            backgroundColor: '#ffffff',
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '11px',
            color: '#1C1917',
            padding: '16mm 14mm',
            boxSizing: 'border-box',
            lineHeight: '1.5'
        },
        // Header
        header: { textAlign: 'center', marginBottom: '8mm', paddingBottom: '6mm', borderBottom: `2px solid ${accentColor}` },
        name: { fontSize: full ? '28px' : '18px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '6px' },
        contactRow: { display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', fontSize: full ? '11px' : '8px', color: '#6B7280' },
        contactItem: { display: 'flex', alignItems: 'center', gap: '4px' },
        // Sections
        section: { marginBottom: '6mm' },
        sectionHeading: {
            fontSize: full ? '13px' : '9px',
            fontWeight: '800',
            color: accentColor,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '4px',
            paddingBottom: '3px',
            borderBottom: `1px solid ${accentColor}`
        },
        // Text
        bodyText: { fontSize: full ? '11px' : '8px', color: '#374151', lineHeight: '1.6' },
        bold: { fontWeight: '700', color: '#1C1917' },
        muted: { color: '#6B7280' },
        // Education entry
        entryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' },
        entryTitle: { fontSize: full ? '12px' : '8px', fontWeight: '700', color: '#1C1917' },
        entryPeriod: { fontSize: full ? '10px' : '7px', color: '#6B7280', whiteSpace: 'nowrap' },
        entryInstitution: { fontSize: full ? '11px' : '8px', color: '#6B7280', marginBottom: '2px' },
        entryDesc: { fontSize: full ? '10px' : '7px', color: '#374151' },
        // Skills
        skillRow: { display: 'flex', gap: '6px', marginBottom: '3px', alignItems: 'flex-start' },
        skillKey: { fontSize: full ? '11px' : '8px', fontWeight: '700', color: '#1C1917', minWidth: full ? '130px' : '80px', flexShrink: 0 },
        skillVal: { fontSize: full ? '11px' : '8px', color: '#374151' },
        // Bullet
        bulletList: { paddingLeft: '14px', margin: '2px 0' },
        bulletItem: { fontSize: full ? '11px' : '8px', color: '#374151', marginBottom: '2px' },
        // Project
        projName: { fontSize: full ? '12px' : '8px', fontWeight: '700', color: '#1C1917', marginBottom: '2px' },
        projDesc: { fontSize: full ? '11px' : '8px', color: '#374151', marginBottom: '2px' },
        projTech: { fontSize: full ? '10px' : '7px', color: accentColor, fontStyle: 'italic' },
        // Referees grid
        refGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
        refCard: { background: lightAccent, borderRadius: '6px', padding: '8px' },
        refName: { fontSize: full ? '11px' : '8px', fontWeight: '700', color: '#1C1917' },
        refTitle: { fontSize: full ? '10px' : '7px', color: '#6B7280', marginTop: '2px' },
        refEmail: { fontSize: full ? '10px' : '7px', color: accentColor, marginTop: '2px' }
    };

    return (
        <div style={s.wrapper}>

            {/* ── Header ── */}
            <div style={s.header}>
                <div style={s.name}>{data.fullName || 'YOUR NAME'}</div>
                <div style={s.contactRow}>
                    {data.location && <span style={s.contactItem}>📍 {data.location}</span>}
                    {data.phone && <span style={s.contactItem}>📞 {data.phone}</span>}
                    {data.email && <span style={s.contactItem}>✉️ {data.email}</span>}
                    {data.github && <span style={s.contactItem}>🔗 {data.github}</span>}
                    {data.linkedin && <span style={s.contactItem}>💼 {data.linkedin}</span>}
                </div>
            </div>

            {/* ── Summary ── */}
            {enabledSections.summary && data.summary && (
                <div style={s.section}>
                    <div style={s.sectionHeading}>Summary</div>
                    <p style={s.bodyText}>{data.summary}</p>
                </div>
            )}

            {/* ── Education ── */}
            {enabledSections.education && data.education.some(e => e.degree || e.institution) && (
                <div style={s.section}>
                    <div style={s.sectionHeading}>Education</div>
                    {data.education.filter(e => e.degree || e.institution).map((edu, i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                            <div style={s.entryRow}>
                                <span style={s.entryTitle}>{edu.degree}</span>
                                <span style={s.entryPeriod}>{edu.period}</span>
                            </div>
                            {edu.institution && <div style={s.entryInstitution}>{edu.institution}</div>}
                            {edu.description && <div style={s.entryDesc}>{edu.description}</div>}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Projects ── */}
            {enabledSections.projects && data.projects.some(p => p.name) && (
                <div style={s.section}>
                    <div style={s.sectionHeading}>Projects</div>
                    {data.projects.filter(p => p.name).map((proj, i) => (
                        <div key={i} style={{ marginBottom: '6px' }}>
                            <div style={s.projName}>{proj.name}</div>
                            {proj.description && <div style={s.projDesc}>{proj.description}</div>}
                            {proj.technologies && (
                                <div style={s.projTech}>Technologies: {proj.technologies}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Skills ── */}
            {enabledSections.skills && Object.values(data.skills).some(v => v) && (
                <div style={s.section}>
                    <div style={s.sectionHeading}>Technical Skills</div>
                    {[
                        { key: 'languages', label: 'Programming Languages' },
                        { key: 'frontend', label: 'Frontend' },
                        { key: 'backend', label: 'Backend' },
                        { key: 'databases', label: 'Databases' },
                        { key: 'tools', label: 'Version Control' },
                        { key: 'others', label: 'Others' }
                    ].filter(({ key }) => data.skills[key]).map(({ key, label }) => (
                        <div key={key} style={s.skillRow}>
                            <span style={s.skillKey}>{label} :</span>
                            <span style={s.skillVal}>{data.skills[key]}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Interests ── */}
            {enabledSections.interests && data.interests.some(i => i) && (
                <div style={s.section}>
                    <div style={s.sectionHeading}>Interests</div>
                    <ul style={s.bulletList}>
                        {data.interests.filter(i => i).map((interest, i) => (
                            <li key={i} style={s.bulletItem}>{interest}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ── Certifications ── */}
            {enabledSections.certifications && data.certifications.some(c => c.name) && (
                <div style={s.section}>
                    <div style={s.sectionHeading}>Certifications</div>
                    {data.certifications.filter(c => c.name).map((cert, i) => (
                        <div key={i} style={{ marginBottom: '4px' }}>
                            <div style={s.entryRow}>
                                <span style={{ ...s.entryTitle, textDecoration: 'underline' }}>{cert.name}</span>
                                {cert.status && <span style={s.entryPeriod}>{cert.status}</span>}
                            </div>
                            {cert.issuer && <div style={s.entryInstitution}>From {cert.issuer}</div>}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Referees ── */}
            {enabledSections.referees && data.referees.some(r => r.name) && (
                <div style={s.section}>
                    <div style={s.sectionHeading}>Non-Related Referees</div>
                    <div style={s.refGrid}>
                        {data.referees.filter(r => r.name).map((ref, i) => (
                            <div key={i} style={s.refCard}>
                                <div style={s.refName}>{ref.name}</div>
                                {ref.title && <div style={s.refTitle}>{ref.title}</div>}
                                {ref.email && <div style={s.refEmail}>{ref.email}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────

const styles = {
    pageHeader: { background: '#ffffff', borderBottom: '1px solid #E7E2D9', padding: '32px 0' },
    pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.5px', margin: 0 },
    pageSubtitle: { fontSize: '14px', color: '#6B7280', marginTop: '4px' },
    section: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', overflow: 'hidden' },
    sectionTitle: { fontSize: '14px', fontWeight: '700', color: '#1C1917', padding: '14px 20px', borderBottom: '1px solid #E7E2D9', margin: 0 },
    sectionBody: { padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' },
    entryBox: { background: '#FAF7F2', border: '1px solid #E7E2D9', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' },
    removeBtn: { position: 'absolute', top: '10px', right: '10px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 },
    toggleRow: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 0', borderBottom: '1px solid #F5F0E8' },
    checkbox: { width: '16px', height: '16px', accentColor: '#F59E0B', cursor: 'pointer' },
    toggleLabel: { fontSize: '14px', fontWeight: '500', color: '#1C1917' },
    miniPreviewWrapper: { position: 'sticky', top: '80px' },
    miniPreviewLabel: { fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    miniPreviewScaler: { width: '100%', background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '12px', overflow: 'hidden', transform: 'scale(1)', transformOrigin: 'top left' },
    previewWrapper: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', width: '210mm' }
};