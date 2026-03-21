import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { wishlistService } from '../services/wishlistService';
import { Trash2, Loader2, ShoppingBag, Check, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

const Wishlist = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const fetchWishlist = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await wishlistService.getWishlist();
            setWishlistItems(data || []);
        } catch (err) {
            setError('We encountered a problem retrieving your favorites. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        setActionLoading(id);
        try {
            await wishlistService.removeFromWishlist(id);
            setWishlistItems(wishlistItems.filter(item => item.id !== id));
            setSuccessMessage('Item removed from your wishlist');
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <ArrowLeft size={22} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>My Wishlist</h1>
                        <p className="text-muted">Items you've saved for future consideration</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={fetchWishlist} disabled={loading}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Refresh List'}
                    </button>
                    <Link to="/customer/dashboard" className="btn-primary" style={{ width: 'auto', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingBag size={18} /> Continue Shopping
                    </Link>
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
                    <Check size={18} />
                    <strong>Success:</strong> {successMessage}
                </div>
            )}

            {error && (
                <div className="form-error" style={{ marginBottom: '2rem', padding: '1.25rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <AlertCircle size={20} /> {error}
                    <button onClick={fetchWishlist} style={{ marginLeft: 'auto', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', color: 'inherit', fontWeight: '700', cursor: 'pointer' }}>Retry</button>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                    <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
                    <p className="text-muted mt-6" style={{ fontSize: '1.11rem' }}>Synchronizing your curated favorites...</p>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="auth-card" style={{ textAlign: 'center', padding: '6rem 4rem', maxWidth: '100%', border: '2px dashed var(--border)', background: '#f8fafc', borderRadius: '2rem' }}>
                    <div style={{
                        width: '120px', height: '120px', backgroundColor: 'white', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
                    }}>
                        <Sparkles size={56} className="text-muted" style={{ opacity: 0.3 }} />
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Your wishlist is empty</h2>
                    <p className="text-muted mb-8" style={{ fontSize: '1.15rem', maxWidth: '36rem', margin: '0 auto 3rem', lineHeight: '1.6' }}>
                        Browse our curated furniture collections and save the items you love. They'll be waiting here when you're ready to make them yours.
                    </p>
                    <Link to="/customer/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto', padding: '1.25rem 4rem', fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)', borderRadius: '1rem' }}>
                        Discover Masterpieces
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
                    {wishlistItems.map(item => (
                        <div key={item.id} className="auth-card card-hover" style={{ maxWidth: '100%', marginBottom: '0', position: 'relative', overflow: 'hidden', padding: '2.5rem', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>{item.productName}</h3>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                                        <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary)' }}>${item.price.toLocaleString()}</span>
                                        <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600' }}>USD</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    disabled={actionLoading === item.id}
                                    className="btn-secondary"
                                    style={{
                                        color: '#ef4444',
                                        backgroundColor: '#fff1f2',
                                        borderColor: '#fee2e2',
                                        padding: '0.75rem',
                                        borderRadius: '0.75rem'
                                    }}
                                    title="Remove Item"
                                >
                                    {actionLoading === item.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                </button>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <span className={`badge ${item.outOfStock ? 'badge-error' : 'badge-success'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.05em' }}>
                                    {item.outOfStock ? 'TEMPORARILY UNAVAILABLE' : 'IMMEDIATE DISPATCH'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className="btn-primary"
                                    disabled={item.outOfStock}
                                    onClick={() => navigate('/customer/checkout', { state: { order: { id: 'ORD-' + Math.floor(1000 + Math.random() * 9000), total: item.price, items: [{ name: item.productName, count: 1, price: item.price }] } } })}
                                    style={{
                                        flex: 2,
                                        fontSize: '1rem',
                                        padding: '1rem',
                                        fontWeight: '700',
                                        opacity: item.outOfStock ? 0.4 : 1,
                                        boxShadow: item.outOfStock ? 'none' : '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
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
                                        fontSize: '1rem',
                                        padding: '1rem',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
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

