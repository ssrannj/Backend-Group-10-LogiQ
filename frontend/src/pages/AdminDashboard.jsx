import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
                    <p className="text-muted">Welcome, {user?.fullName}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/admin/orders">
                        <button className="btn-secondary">Manage Orders</button>
                    </Link>
                    <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="auth-card" style={{ maxWidth: '100%', marginBottom: '1.5rem' }}>
                <h3>System Overview</h3>
                <p className="text-muted mt-4">Platform statistics and alerts will appear here.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
