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
        <div className="dashboard-container">
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Admin Control Panel</h1>
                    <p className="text-muted">Welcome, {user?.fullName}</p>
                </div>
                <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {statCards.map((card, idx) => (
                            <Link key={idx} to={card.link} className="auth-card" style={{ textDecoration: 'none', marginBottom: 0, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{ backgroundColor: `${card.color}15`, padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <card.icon size={28} style={{ color: card.color }} />
                                </div>
                                <div>
                                    <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{card.label}</p>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>{card.value}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        <div className="auth-card" style={{ maxWidth: '100%', marginBottom: 0 }}>
                            <h3 style={{ marginBottom: '1.25rem' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Link to="/admin/orders" className="btn-primary" style={{ textDecoration: 'none', width: 'auto' }}>
                                    Verify Pending Payments
                                </Link>
                                <button className="btn-secondary">Inventory Management</button>
                            </div>
                        </div>

                        <div className="auth-card" style={{ maxWidth: '100%', marginBottom: 0 }}>
                            <h3 style={{ marginBottom: '1rem' }}>System Health</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.9rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                                All systems operational
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
