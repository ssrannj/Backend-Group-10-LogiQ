import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { wishlistService } from '../services/wishlistService';
import { Trash2, Loader2, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await wishlistService.getWishlist();
            setWishlistItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await wishlistService.removeFromWishlist(id);
            setWishlistItems(wishlistItems.filter(item => item.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>My Wishlist</h1>
                    <p className="text-muted">You have {wishlistItems.length} items here</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ textDecoration: 'none' }}>
                        Back to Shop
                    </Link>
                    <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
                </div>
            ) : error ? (
                <div className="form-error" style={{ textAlign: 'center', padding: '2rem' }}>
                    {error} <button onClick={fetchWishlist} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>Retry</button>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <ShoppingBag size={48} className="text-muted" style={{ margin: '0 auto 1rem', display: 'block' }} />
                    <p className="text-muted">Your wishlist is empty.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {wishlistItems.map(item => (
                        <div key={item.id} className="auth-card" style={{ maxWidth: '100%', marginBottom: '0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{item.productName}</h3>
                                    <p className="text-muted">${item.price}</p>
                                    {item.outOfStock && (
                                        <span style={{
                                            fontSize: '0.7rem',
                                            backgroundColor: '#fee2e2',
                                            color: '#991b1b',
                                            padding: '0.1rem 0.4rem',
                                            borderRadius: '0.2rem',
                                            fontWeight: '600'
                                        }}>
                                            Waiting for Stock
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="btn-secondary"
                                    style={{ color: '#ef4444', borderColor: '#fecaca' }}
                                    title="Remove from Wishlist"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
