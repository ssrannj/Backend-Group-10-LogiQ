import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { CheckCircle, XCircle, FileText, Loader2, ArrowLeft, MoreVertical, AlertCircle, ShieldCheck } from 'lucide-react';

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
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
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
            setError('System synchronization failed. Unable to fetch pending authorizations.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (orderId, status) => {
        setActionLoading(orderId);
        try {
            await adminService.verifyPayment(orderId, status);
            setOrders(orders.filter(order => order.id !== orderId));
            setSuccessMessage(`Order #${orderId} ${status === 'APPROVED' ? 'authorized' : 'declined'} successfully.`);
        } catch (err) {
            setError(`Failed to process authorization for Order #${orderId}.`);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <Link to="/admin/dashboard" className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <ArrowLeft size={22} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Transaction Audit</h1>
                        <p className="text-muted">High-priority verification of incoming settlement proofs</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={fetchPendingOrders} disabled={loading}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Synchronize'}
                    </button>
                    <button className="btn-secondary" onClick={() => { logout(); navigate('/login'); }}>Terminate Session</button>
                </div>
            </div>

            {successMessage && (
                <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    padding: '1.25rem',
                    borderRadius: '1rem',
                    marginBottom: '2rem',
                    animation: 'slideInRight 0.3s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)'
                }}>
                    <CheckCircle size={20} />
                    <strong>LogiQ Secure:</strong> {successMessage}
                </div>
            )}

            {error && (
                <div className="form-error" style={{ marginBottom: '2rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '1rem' }}>
                    <AlertCircle size={20} /> {error}
                    <button onClick={fetchPendingOrders} style={{ marginLeft: 'auto', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', color: 'inherit', fontWeight: '700', cursor: 'pointer' }}>Retry</button>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                    <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
                    <p className="text-muted mt-6" style={{ fontSize: '1.11rem' }}>Decrypting transaction queue...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="auth-card" style={{ textAlign: 'center', padding: '6rem 4rem', maxWidth: '100%', border: '2px dashed #bbf7d0', backgroundColor: '#f8fafc', borderRadius: '2rem' }}>
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'white', color: '#10b981',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem',
                        boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.1)'
                    }}>
                        <ShieldCheck size={56} />
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '1rem', color: '#065f46', letterSpacing: '-0.025em' }}>Audit Complete</h2>
                    <p className="text-muted" style={{ fontSize: '1.15rem', maxWidth: '32rem', margin: '0 auto', lineHeight: '1.6' }}>
                        All pending financial transfers have been processed. System integrity is verified and stable.
                    </p>
                </div>
            ) : (
                <div className="auth-card" style={{ maxWidth: '100%', overflow: 'hidden', padding: 0, border: '1px solid var(--border)', borderRadius: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '1.5rem', fontWeight: '800', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reference</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '800', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer Identity</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '800', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Settlement</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '800', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Supporting Docs</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '800', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Action Protocol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{ fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace', fontSize: '1rem' }}>{order.id}</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.05rem' }}>{order.customer}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>AUTHORIZED CLIENT</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{ fontWeight: '900', fontSize: '1.15rem', color: 'var(--text-main)' }}>${order.total.toLocaleString()}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.25rem' }}>USD</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            {order.slip === 'available' ? (
                                                <button style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                    color: '#2563eb', backgroundColor: '#eff6ff',
                                                    padding: '0.5rem 1rem', borderRadius: '0.75rem',
                                                    fontSize: '0.85rem', border: '1px solid #dbeafe',
                                                    cursor: 'pointer', fontWeight: '700',
                                                    transition: 'all 0.2s ease'
                                                }}>
                                                    <FileText size={16} /> INSPECT SLIP
                                                </button>
                                            ) : (
                                                <span className="badge badge-error" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', fontWeight: '800' }}>MISSING DOCUMENT</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => handleVerify(order.id, 'APPROVED')}
                                                    disabled={actionLoading === order.id || order.slip !== 'available'}
                                                    className="btn-primary"
                                                    style={{
                                                        width: 'auto',
                                                        height: '2.75rem',
                                                        padding: '0 1.25rem',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '800',
                                                        backgroundColor: '#10b981',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
                                                        opacity: (actionLoading === order.id || order.slip !== 'available') ? 0.5 : 1
                                                    }}
                                                >
                                                    {actionLoading === order.id ? <Loader2 size={16} className="animate-spin" /> : 'AUTHORIZE'}
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(order.id, 'REJECTED')}
                                                    disabled={actionLoading === order.id}
                                                    className="btn-secondary"
                                                    style={{
                                                        width: 'auto',
                                                        height: '2.75rem',
                                                        padding: '0 1.25rem',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '800',
                                                        color: '#ef4444',
                                                        borderColor: '#fecaca',
                                                        backgroundColor: '#fff1f2',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
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
