import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

const CustomerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Mock products for the demonstration - real API integration would replace this
    const products = [
        { id: '101', name: 'Premium Leather Sofa', price: 899, stock: 5 },
        { id: '102', name: 'Wooden Dining Table', price: 450, stock: 0 },
        { id: '103', name: 'Ergonomic Office Chair', price: 299, stock: 12 },
        { id: '104', name: 'Smart Bed Frame', price: 1200, stock: 0 },
        { id: '105', name: 'Modern Floor Lamp', price: 85, stock: 2 }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Furniture Catalog</h1>
                    <p className="text-muted">Welcome back, {user?.fullName}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/customer/wishlist" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <Heart size={18} /> Wishlist
                    </Link>
                    <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Available Products</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            <div className="auth-card" style={{ maxWidth: '100%', backgroundColor: '#f9fafb' }}>
                <h3>Your Recent Orders</h3>
                <p className="text-muted mt-4">No active orders found.</p>
                <button className="btn-primary mt-6" style={{ width: 'auto' }}>Browse History</button>
            </div>
        </div>
    );
};

export default CustomerDashboard;
