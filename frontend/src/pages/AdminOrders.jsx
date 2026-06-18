import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { CheckCircle, XCircle, FileText, Loader2, ArrowLeft, MoreVertical, AlertCircle, ShieldCheck, RefreshCw, LogOut, Eye, Check, X } from 'lucide-react';

const AdminOrders = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null); 
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const fetchPendingOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminService.getPendingOrders();
            setOrders(data || []);
        } catch (err) {
            setError('System synchronization failed. Central ledger unavailable.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (orderId, status) => {
        setActionLoading(orderId);
        try {
            await adminService.verifyPayment(orderId, status);
            setOrders(orders.filter(order => order.id !== orderId));
            setSuccessMessage(`Order #${orderId} has been successfully ${status === 'APPROVED' ? 'authorized' : 'decommissioned'}.`);
        } catch (err) {
            setError(`Protocol failure: Failed to process authorization for Order #${orderId}.`);
        } finally {
            setActionLoading(null);
        }
    };

    const previewSlip = (orderId) => {
        alert(`[SYSTEM PREVIEW] Loading encrypted payment artifact for Order #${orderId}...\n\n(This would open a secure viewer for the uploaded PDF/Image)`);
    };

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/admin/dashboard" className="btn-secondary" style={{ 
                        padding: '0', borderRadius: '50%', width: '52px', height: '52px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        textDecoration: 'none', background: 'white', border: '1px solid var(--border)' 
                    }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-0.05em' }}>Transaction Audit</h1>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Secure verification of high-value liquidity settlements</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <button className="btn-secondary" onClick={fetchPendingOrders} disabled={loading} style={{ height: '52px', padding: '0 1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700' }}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />} Synchronize
                    </button>
                    <button className="btn-secondary" 
                        onClick={() => { logout(); navigate('/login'); }} 
                        style={{ height: '52px', padding: '0 1.5rem', borderRadius: 'var(--radius)', color: '#ef4444', borderColor: '#fecaca', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700' }}
                    >
                        <LogOut size={18} /> Exit Portal
                    </button>
                </div>
            </div>

            {successMessage && (
                <div style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #10b981',
                    color: '#065f46',
                    padding: '1.5rem 2rem',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '2.5rem',
                    animation: 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    boxShadow: '0 15px 30px -10px rgba(16, 185, 129, 0.15)'
                }}>
                    <div style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem', borderRadius: '50%' }}>
                        <Check size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Audit Log Updated</strong>
                        <span style={{ fontWeight: '500', opacity: 0.8 }}>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="form-error" style={{ marginBottom: '2.5rem', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: 'var(--radius-lg)', backgroundColor: '#fff1f2', border: '1px solid #ef4444', color: '#991b1b' }}>
                    <AlertCircle size={24} /> 
                    <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.2rem' }}>System Integrity Alert</strong>
                        <span style={{ fontWeight: '500', opacity: 0.8 }}>{error}</span>
                    </div>
                    <button onClick={fetchPendingOrders} style={{ backgroundColor: '#ef4444', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.75rem', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}>FORCE SYNC</button>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '12rem 0', animation: 'fadeIn 0.5s ease' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Loader2 size={80} className="animate-spin" style={{ color: 'var(--primary)', opacity: 0.15 }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={32} className="text-primary" />
                        </div>
                    </div>
                    <p className="text-muted mt-8" style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.1em' }}>DECRYPTING TRANSACTION QUEUE...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="auth-card glass-card" style={{ textAlign: 'center', padding: '10rem 4rem', maxWidth: '100%', border: '1px dashed #10b981', borderRadius: '3rem' }}>
                    <div style={{
                        width: '140px', height: '140px', borderRadius: '50%', backgroundColor: 'white', color: '#10b981',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3rem',
                        boxShadow: '0 30px 45px -15px rgba(16, 185, 129, 0.2)',
                        border: '1px solid #d1fae5'
                    }}>
                        <ShieldCheck size={72} />
                    </div>
                    <h2 style={{ fontSize: '3rem', fontWeight: '950', marginBottom: '1.5rem', color: '#064e3b', letterSpacing: '-0.05em' }}>Audit Complete</h2>
                    <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '38rem', margin: '0 auto', lineHeight: '1.8', fontWeight: '500' }}>
                        All pending capital transfers have been successfully verified and cleared. The financial pipeline remains stable and secure.
                    </p>
                </div>
            ) : (
                <div className="auth-card" style={{ maxWidth: '100%', overflow: 'hidden', padding: 0, border: '1px solid var(--border)', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)', background: 'white' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '1.75rem 2rem', fontWeight: '900', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Vector ID</th>
                                    <th style={{ padding: '1.75rem 2rem', fontWeight: '900', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Client Manifest</th>
                                    <th style={{ padding: '1.75rem 2rem', fontWeight: '900', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Net Settlement</th>
                                    <th style={{ padding: '1.75rem 2rem', fontWeight: '900', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Criticality</th>
                                    <th style={{ padding: '1.75rem 2rem', fontWeight: '900', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Proof Artifacts</th>
                                    <th style={{ padding: '1.75rem 2rem', fontWeight: '900', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'right' }}>Authorization</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.3s ease', animation: `fadeIn 0.5s ease both ${index * 0.1}s` }}>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <span style={{ fontWeight: '900', color: 'var(--primary)', fontFamily: '"Courier New", monospace', fontSize: '1.1rem', backgroundColor: 'var(--primary-light)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem' }}>{order.id}</span>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.15rem', marginBottom: '0.2rem' }}>{order.customerName || 'Anonymous'}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity Verified</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                                <span style={{ fontWeight: '950', fontSize: '1.5rem', color: 'var(--text-main)' }}>${(order.amount || 0).toLocaleString()}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '800' }}>USD</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ 
                                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
                                                padding: '0.5rem 0.8rem', borderRadius: '0.6rem',
                                                backgroundColor: (order.priorityScore > 50 ? '#fff1f2' : (order.priorityScore > 20 ? '#fffbeb' : '#f0fdf4')),
                                                color: (order.priorityScore > 50 ? '#be123c' : (order.priorityScore > 20 ? '#b45309' : '#15803d')),
                                                border: `1px solid ${(order.priorityScore > 50 ? '#fecdd3' : (order.priorityScore > 20 ? '#fef3c7' : '#dcfce7'))}`
                                            }}>
                                                <AlertCircle size={14} />
                                                <span style={{ fontWeight: '900', fontSize: '0.85rem' }}>{order.priorityScore || 1}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            {order.slip === 'available' ? (
                                                <button 
                                                    onClick={() => previewSlip(order.id)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                                                        color: 'var(--primary)', backgroundColor: 'var(--primary-light)',
                                                        padding: '0.6rem 1.25rem', borderRadius: '0.85rem',
                                                        fontSize: '0.85rem', border: '1px solid rgba(37, 99, 235, 0.2)',
                                                        cursor: 'pointer', fontWeight: '900',
                                                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.1)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                                >
                                                    <Eye size={16} /> INSPECT ARTIFACT
                                                </button>
                                            ) : (
                                                <span className="badge badge-error" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', fontWeight: '900', borderRadius: '0.5rem' }}>NULL_DOCUMENT_ERROR</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => handleVerify(order.id, 'APPROVED')}
                                                    disabled={actionLoading === order.id || order.slip !== 'available'}
                                                    className="btn-primary"
                                                    style={{
                                                        width: 'auto',
                                                        height: '3.25rem',
                                                        padding: '0 1.5rem',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '900',
                                                        backgroundColor: '#10b981',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.6rem',
                                                        boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.3)',
                                                        borderRadius: '0.85rem',
                                                        opacity: (actionLoading === order.id || order.slip !== 'available') ? 0.5 : 1
                                                    }}
                                                >
                                                    {actionLoading === order.id ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                                                    AUTHORIZE
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(order.id, 'REJECTED')}
                                                    disabled={actionLoading === order.id}
                                                    style={{
                                                        width: 'auto',
                                                        height: '3.25rem',
                                                        padding: '0 1.5rem',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '900',
                                                        color: '#ef4444',
                                                        border: '1px solid #fee2e2',
                                                        backgroundColor: '#fef2f2',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.6rem',
                                                        borderRadius: '0.85rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                                                >
                                                    <XCircle size={18} />
                                                    DECLINE
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;

