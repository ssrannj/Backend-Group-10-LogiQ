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
        <div className="dashboard-container">
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/admin/dashboard" style={{ color: 'var(--text-muted)' }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Payment Verification</h1>
                        <p className="text-muted">Review and approve bank transfer slips</p>
                    </div>
                </div>
                <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            {error && <div className="form-error mb-6">{error}</div>}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
            ) : orders.length === 0 ? (
                <div className="auth-card text-center" style={{ padding: '4rem', maxWidth: '100%' }}>
                    <CheckCircle size={48} className="text-muted" style={{ margin: '0 auto 1.5rem', display: 'block', color: '#10b981' }} />
                    <p className="text-muted">No pending payments to verify.</p>
                </div>
            ) : (
                <div className="auth-card" style={{ maxWidth: '100%', overflowX: 'auto', padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>ORDER ID</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>CUSTOMER</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>TOTAL</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>SLIP STATUS</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>#{order.id}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{order.customer}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>${order.total}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        {order.slip === 'available' ? (
                                            <span style={{
                                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                color: '#166534', backgroundColor: '#dcfce3',
                                                padding: '0.2rem 0.6rem', borderRadius: '1rem',
                                                fontSize: '0.75rem', width: 'fit-content'
                                            }}>
                                                <FileText size={14} /> View Slip
                                            </span>
                                        ) : (
                                            <span style={{ color: '#991b1b', fontSize: '0.75rem' }}>Waiting for upload</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleVerify(order.id, 'APPROVED')}
                                                disabled={actionLoading === order.id || order.slip !== 'available'}
                                                className="btn-primary"
                                                style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#10b981' }}
                                            >
                                                {actionLoading === order.id ? <Loader2 size={14} className="animate-spin" /> : 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleVerify(order.id, 'REJECTED')}
                                                disabled={actionLoading === order.id || order.slip !== 'available'}
                                                className="btn-secondary"
                                                style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: '#ef4444' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
