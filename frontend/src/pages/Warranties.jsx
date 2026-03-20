import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Calendar, Clock, AlertCircle, ArrowLeft } from 'lucide-react';

const Warranties = () => {
    const navigate = useNavigate();
    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock warranties data
        setTimeout(() => {
            setWarranties([
                { id: 'WRN-101', product: 'Premium Leather Sofa', purchaseDate: '2024-03-20', period: '2 Years', status: 'ACTIVE' },
                { id: 'WRN-102', product: 'Wooden Dining Table', purchaseDate: '2023-01-15', period: '1 Year', status: 'EXPIRED' },
                { id: 'WRN-103', product: 'Ergonomic Office Chair', purchaseDate: '2025-01-10', period: '1 Year', status: 'ACTIVE' }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const isExpired = (status) => status === 'EXPIRED';

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>My Warranties</h1>
                        <p className="text-muted">Manage your product protection plans</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <p className="text-muted">Loading warranty records...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                    {warranties.map((warranty) => (
                        <div key={warranty.id} className="auth-card card-hover" style={{ maxWidth: '100%', marginBottom: 0, padding: '1.5rem', border: `1px solid ${isExpired(warranty.status) ? '#fecaca' : 'var(--border)'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <div style={{ padding: '0.5rem', backgroundColor: isExpired(warranty.status) ? '#fee2e2' : '#f0f9ff', borderRadius: '0.5rem' }}>
                                        <ShieldCheck size={20} style={{ color: isExpired(warranty.status) ? '#ef4444' : 'var(--primary)' }} />
                                    </div>
                                    <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{warranty.product}</h3>
                                </div>
                                <span className={`badge ${isExpired(warranty.status) ? 'badge-error' : 'badge-success'}`}>
                                    {warranty.status}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <div>
                                    <p className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Calendar size={12} /> Purchase Date
                                    </p>
                                    <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{warranty.purchaseDate}</p>
                                </div>
                                <div>
                                    <p className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={12} /> Warranty Period
                                    </p>
                                    <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{warranty.period}</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: isExpired(warranty.status) ? '#fef2f2' : '#f8fafc', borderRadius: '0.5rem', border: `1px solid ${isExpired(warranty.status) ? '#fee2e2' : '#f1f5f9'}` }}>
                                <p style={{ fontSize: '0.75rem', color: isExpired(warranty.status) ? '#ef4444' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={14} />
                                    {isExpired(warranty.status) ? 'This warranty has expired and is no longer active.' : 'Maintenance covered under LogiQ Standard Plan.'}
                                </p>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                                <button className="btn-secondary" style={{ flex: 1, fontSize: '0.85rem' }}>Claim Service</button>
                                <button className="btn-primary" style={{ flex: 1, fontSize: '0.85rem', visibility: isExpired(warranty.status) ? 'visible' : 'hidden' }}>Extend Warranty</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Warranties;
