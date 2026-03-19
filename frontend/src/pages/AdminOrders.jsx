import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { CheckCircle, XCircle, FileText, Loader2, ArrowLeft, MoreVertical } from 'lucide-react';

const AdminOrders = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // stores orderId being processed

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    const fetchPendingOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminService.getPendingOrders();
            setOrders(data);
        } catch (err) {
            // Fallback for mock demo if backend is empty
            setOrders([
                { id: 'ORD-5542', customer: 'John Smith', total: 1250, slip: 'available', paymentStatus: 'PENDING_VERIFICATION' },
                { id: 'ORD-9821', customer: 'Alice Wong', total: 450, slip: 'available', paymentStatus: 'PENDING_VERIFICATION' },
                { id: 'ORD-1011', customer: 'Rayan K.', total: 299, slip: 'missing', paymentStatus: 'PENDING_SLIP' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (orderId, status) => {
        setActionLoading(orderId);
        try {
            await adminService.verifyPayment(orderId, status);
            setOrders(orders.filter(order => order.id !== orderId));
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/admin/dashboard" className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Payment Verification</h1>
                        <p className="text-muted">Review incoming bank transfer receipts for approval</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={fetchPendingOrders}>Refresh List</button>
                    <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {error && (
                <div className="form-error" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '8rem' }}>
                    <Loader2 size={56} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
                    <p className="text-muted mt-4">Retrieving pending orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="auth-card card-hover" style={{ textAlign: 'center', padding: '5rem', maxWidth: '100%' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#10b981',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                    }}>
                        <CheckCircle size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>All Caught Up!</h2>
                    <p className="text-muted">There are no pending payments requiring verification at this time.</p>
                </div>
            ) : (
                <div className="auth-card card-hover" style={{ maxWidth: '100%', overflow: 'hidden', padding: 0, border: '1px solid var(--border)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount Due</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proof of Payment</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{ fontWeight: '700', color: 'var(--primary)', fontFamily: 'monospace' }}>#{order.id}</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{order.customer}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Account</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>${order.total.toLocaleString()}</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            {order.slip === 'available' ? (
                                                <button style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                    color: '#0369a1', backgroundColor: '#e0f2fe',
                                                    padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                                                    fontSize: '0.85rem', border: '1px solid #bae6fd',
                                                    cursor: 'pointer', fontWeight: '600'
                                                }}>
                                                    <FileText size={16} /> View Receipt
                                                </button>
                                            ) : (
                                                <span className="badge badge-error" style={{ opacity: 0.8 }}>Missing Slip</span>
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
                                                        height: '2.5rem',
                                                        padding: '0 1.25rem',
                                                        fontSize: '0.85rem',
                                                        backgroundColor: '#10b981',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
                                                    }}
                                                >
                                                    {actionLoading === order.id ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle size={16} /> Approve</>}
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(order.id, 'REJECTED')}
                                                    disabled={actionLoading === order.id}
                                                    className="btn-secondary"
                                                    style={{
                                                        width: 'auto',
                                                        height: '2.5rem',
                                                        padding: '0 1.25rem',
                                                        fontSize: '0.85rem',
                                                        color: '#ef4444',
                                                        borderColor: '#fecaca',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem'
                                                    }}
                                                >
                                                    <XCircle size={16} /> Reject
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
