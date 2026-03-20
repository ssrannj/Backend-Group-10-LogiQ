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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <ArrowLeft size={22} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>My Warranties</h1>
                        <p className="text-muted">Manage protection plans for your LogiQ products</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '8rem 0' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Securing your warranty records...</p>
                </div>
            ) : warranties.length === 0 ? (
                <div className="auth-card" style={{ textAlign: 'center', padding: '5rem', maxWidth: '100%', border: '1px solid var(--border)' }}>
                     <ShieldCheck size={64} className="text-muted" style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                     <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>No Active Warranties</h2>
                     <p className="text-muted">You don't have any products with registered warranties yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
                    {warranties.map((warranty) => (
                        <div key={warranty.id} className="auth-card card-hover" style={{ 
                            maxWidth: '100%', 
                            marginBottom: 0, 
                            padding: '2rem', 
                            border: `1px solid ${isExpired(warranty.status) ? '#fee2e2' : 'var(--border)'}`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ 
                                        padding: '0.75rem', 
                                        backgroundColor: isExpired(warranty.status) ? '#fff1f2' : '#f0f9ff', 
                                        borderRadius: '0.75rem',
                                        boxShadow: `0 4px 6px -1px ${isExpired(warranty.status) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                                    }}>
                                        <ShieldCheck size={24} style={{ color: isExpired(warranty.status) ? '#ef4444' : 'var(--primary)' }} />
                                    </div>
                                    <h3 style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-main)' }}>{warranty.product}</h3>
                                </div>
                                <span className={`badge ${isExpired(warranty.status) ? 'badge-error' : 'badge-success'}`} style={{ padding: '0.4rem 0.8rem', fontWeight: '700' }}>
                                    {warranty.status}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '2rem 0', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem' }}>
                                <div>
                                    <p className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                        <Calendar size={14} /> Registered On
                                    </p>
                                    <p style={{ fontWeight: '700', fontSize: '1rem' }}>{warranty.purchaseDate}</p>
                                </div>
                                <div>
                                    <p className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                        <Clock size={14} /> Duration
                                    </p>
                                    <p style={{ fontWeight: '700', fontSize: '1rem' }}>{warranty.period}</p>
                                </div>
                            </div>

                            <div style={{ 
                                padding: '1rem', 
                                backgroundColor: isExpired(warranty.status) ? '#fff1f2' : '#eff6ff', 
                                borderRadius: '0.75rem', 
                                border: `1px solid ${isExpired(warranty.status) ? '#fecaca' : '#dbeafe'}` 
                            }}>
                                <p style={{ fontSize: '0.85rem', color: isExpired(warranty.status) ? '#e11d48' : '#1e40af', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', lineHeight: '1.5' }}>
                                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                                    <span>
                                        {isExpired(warranty.status) 
                                            ? 'Coverage has ended. You can still apply for a one-time extension within 30 days.' 
                                            : 'Standard LogiQ protection is active. This covers all structural issues and manufacturing defects.'}
                                    </span>
                                </p>
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <button className="btn-secondary" style={{ flex: 1, fontSize: '0.9rem', fontWeight: '600' }}>Claim Support</button>
                                {isExpired(warranty.status) && (
                                    <button className="btn-primary" style={{ flex: 1, fontSize: '0.9rem', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}>
                                        Extend Plan
                                    </button>
                                )}
                            </div>
                            
                            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginTop: '1.5rem', fontFamily: 'monospace' }}>
                                UID: {warranty.id}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Warranties;
