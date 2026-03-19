import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { LayoutDashboard, ShoppingCart, Users, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        pendingPayments: 0,
        totalOrders: 0,
        activeCustomers: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getSystemStats();
                setStats(data);
            } catch (err) {
                // Use fallback mock stats if backend isn't ready
                setStats({
                    pendingPayments: 5,
                    totalOrders: 28,
                    activeCustomers: 12,
                    revenue: 14500
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const statCards = [
        { label: 'Pending Payments', value: stats.pendingPayments, icon: AlertCircle, color: '#ef4444', link: '/admin/orders' },
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'var(--primary)', link: '/admin/orders' },
        { label: 'Active Customers', value: stats.activeCustomers, icon: Users, color: '#10b981', link: '#' },
        { label: 'Monthly Revenue', value: `$${stats.revenue}`, icon: TrendingUp, color: '#f59e0b', link: '#' }
    ];

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="gradient-bg" style={{ padding: '0.75rem', borderRadius: '0.75rem', color: 'white' }}>
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Control Center</h1>
                        <p className="text-muted">Overview of your supply chain performance</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={() => fetchStats()}>Refresh Stats</button>
                    <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '10rem' }}>
                    <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
                    <p className="text-muted mt-4">Loading analytics...</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        {statCards.map((card, idx) => (
                            <Link key={idx} to={card.link} className="auth-card card-hover" style={{
                                textDecoration: 'none',
                                marginBottom: 0,
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'left',
                                gap: '1rem',
                                border: '1px solid var(--border)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    backgroundColor: `${card.color}15`,
                                    padding: '1rem',
                                    borderRadius: '1rem',
                                    width: 'fit-content'
                                }}>
                                    <card.icon size={32} style={{ color: card.color }} />
                                </div>
                                <div>
                                    <p className="text-muted" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>{card.label} </p>
                                    <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)' }}>{card.value}</h3>
                                </div>
                                <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.05 }}>
                                    <card.icon size={100} style={{ color: card.color }} />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
                        <div className="auth-card card-hover" style={{ maxWidth: '100%', marginBottom: 0, padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Core Operations</h3>
                                <Link to="/admin/orders" className="link" style={{ fontSize: '0.875rem' }}>View details</Link>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <Link to="/admin/orders" className="btn-primary" style={{ textDecoration: 'none', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', height: '3.5rem' }}>
                                    <AlertCircle size={20} /> Verify Payments
                                </Link>
                                <button className="btn-secondary" style={{ height: '3.5rem' }}>Inventory Setup</button>
                                <button className="btn-secondary" style={{ height: '3.5rem' }}>Route Planning</button>
                                <button className="btn-secondary" style={{ height: '3.5rem' }}>Dispatch Center</button>
                            </div>
                        </div>

                        <div className="auth-card card-hover" style={{ maxWidth: '100%', marginBottom: 0, padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Infrastructure Status</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.75rem', border: '1px solid #e0f2fe' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#0369a1' }}>Database Mirroring</span>
                                    <div className="badge badge-success">STABLE</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.75rem', border: '1px solid #dcfce7' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#166534' }}>Main API Gateway</span>
                                    <div className="badge badge-success">ONLINE</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <TrendingUp size={16} /> Last sync: 2 mins ago
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
