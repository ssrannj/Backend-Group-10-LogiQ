import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
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
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Customer Dashboard</h1>
                    <p className="text-muted">Welcome back, {user?.fullName}</p>
                </div>
                <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            <div className="auth-card" style={{ maxWidth: '100%' }}>
                <h3>Your Orders</h3>
                <p className="text-muted mt-4">You have no active orders at the moment.</p>
                <button className="btn-primary mt-6" style={{ width: 'auto' }}>Browse Furniture</button>
            </div>
        </div>
    );
};

export default CustomerDashboard;
