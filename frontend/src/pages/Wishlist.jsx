import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { wishlistService } from '../services/wishlistService';
import { Trash2, Loader2, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleRemove = async (id) => {
        try {
            await wishlistService.removeFromWishlist(id);
            setWishlistItems(wishlistItems.filter(item => item.id !== id));
            setSuccessMessage('Item removed from your wishlist');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>My Wishlist</h1>
                    <p className="text-muted">You have <strong>{wishlistItems.length}</strong> items waiting for you</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingBag size={18} /> Continue Shopping
                    </Link>
                    <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {successMessage && (
                <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    marginBottom: '1.5rem',
                    animation: 'slideInRight 0.3s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{ backgroundColor: '#10b981', borderRadius: '50%', padding: '2px', display: 'flex', alignItems: 'center' }}>
                        <Check size={14} color="white" />
                    </div>
                    {successMessage}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                    <Loader2 size={56} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
                    <p className="text-muted mt-6" style={{ fontSize: '1.1rem' }}>Syncing your favorites...</p>
                </div>
            ) : error ? (
                <div className="form-error" style={{ textAlign: 'center', padding: '4rem', background: '#fff1f2', borderRadius: '1.5rem', border: '1px solid #fda4af' }}>
                    <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{error}</p>
                    <button onClick={fetchWishlist} className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>Retry Connection</button>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="auth-card" style={{ textAlign: 'center', padding: '6rem 4rem', maxWidth: '100%', border: '2px dashed var(--border)', background: '#f8fafc' }}>
                    <div style={{
                        width: '120px', height: '120px', backgroundColor: 'white', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                    }}>
                        <ShoppingBag size={56} className="text-muted" style={{ opacity: 0.3 }} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-main)' }}>Your wishlist is craving some love</h2>
                    <p className="text-muted mb-8" style={{ fontSize: '1.1rem', maxWidth: '32rem', margin: '0 auto 2.5rem' }}>
                        Looks like you haven't saved any products yet. Explore our latest collections and find items that speak to you!
                    </p>
                    <Link to="/customer/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto', padding: '1rem 3rem', fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}>
                        Discover Products
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
                    {wishlistItems.map(item => (
                        <div key={item.id} className="auth-card card-hover" style={{ maxWidth: '100%', marginBottom: '0', position: 'relative', overflow: 'hidden', padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{item.productName}</h3>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', margin: '0.75rem 0' }}>${item.price.toLocaleString()}</p>

                                    <span className={`badge ${item.outOfStock ? 'badge-error' : 'badge-success'}`} style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: '700' }}>
                                        {item.outOfStock ? 'Waiting for Stock' : 'In Stock & Ready'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="btn-secondary"
                                    style={{
                                        color: '#ef4444',
                                        backgroundColor: '#fff1f2',
                                        borderColor: '#fee2e2',
                                        padding: '0.6rem',
                                        borderRadius: '0.75rem'
                                    }}
                                    title="Remove from Wishlist"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <button
                                    className="btn-primary"
                                    disabled={item.outOfStock}
                                    style={{
                                        flex: 2,
                                        fontSize: '0.95rem',
                                        padding: '0.8rem',
                                        opacity: item.outOfStock ? 0.4 : 1,
                                        boxShadow: item.outOfStock ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
                                    }}
                                >
                                    Add to Cart
                                </button>
                                <Link
                                    to={`/customer/dashboard`}
                                    className="btn-secondary"
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        fontSize: '0.95rem',
                                        padding: '0.8rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
