import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const initialFormState = {
    name: '',
    email: '',
    companyName: '',
    companyAddress: '',
    companyDescription: ''
};

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState(initialFormState);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadCompanies = async () => {
        try {
            const res = await api.get('/admin/companies');
            setCompanies(res.data.companies || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompanies();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');
        setError('');

        try {
            await api.post('/admin/companies', formData);
            setMessage('Company added successfully.');
            setFormData(initialFormState);
            await loadCompanies();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add company');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '24px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #0f766e 0%, #0e7490 100%)',
                    color: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Admin Dashboard</h1>
                        <p style={{ margin: '8px 0 0', opacity: 0.95 }}>
                            Welcome {user?.name}. Add and manage companies from one place.
                        </p>
                    </div>
                    <button onClick={logout} className="btn btn-danger">Logout</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 420px) 1fr', gap: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 8px 30px rgba(2, 6, 23, 0.08)' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '14px', color: '#0f172a' }}>Add New Company</h2>

                        {message && <div className="alert alert-success">{message}</div>}
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Contact Person Name</label>
                                <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Company Email</label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Company Name</label>
                                <input className="form-control" name="companyName" value={formData.companyName} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Company Address</label>
                                <input className="form-control" name="companyAddress" value={formData.companyAddress} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Company Description</label>
                                <textarea className="form-control" name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows="4" />
                            </div>

                            <button type="submit" className="btn btn-success" disabled={submitting} style={{ width: '100%' }}>
                                {submitting ? 'Adding Company...' : 'Add Company'}
                            </button>
                        </form>
                    </div>

                    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 8px 30px rgba(2, 6, 23, 0.08)' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '14px', color: '#0f172a' }}>Registered Companies</h2>
                        {loading ? (
                            <p>Loading companies...</p>
                        ) : companies.length === 0 ? (
                            <p>No companies added yet.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {companies.map((company) => (
                                    <div key={company._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                                        <h3 style={{ margin: 0, color: '#0f172a' }}>{company.companyName}</h3>
                                        <p style={{ margin: '6px 0', color: '#475569' }}>{company.companyAddress}</p>
                                        <p style={{ margin: '6px 0', color: '#334155', fontSize: '0.95rem' }}>{company.companyDescription || 'No description'}</p>
                                        <p style={{ margin: '6px 0 0', color: '#0f766e', fontWeight: 700 }}>{company.email}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
