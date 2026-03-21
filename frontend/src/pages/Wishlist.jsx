import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { wishlistService } from '../services/wishlistService';
import { Trash2, Loader2, ShoppingBag, Check, ArrowLeft, AlertCircle, Sparkles, ShoppingCart, Info } from 'lucide-react';

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
            const timer = setTimeout(() => setSuccessMessage(''), 4000);
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
            setError('System synchronization failed. Unable to retrieve your curated wishlist.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        setActionLoading(id);
        try {
            await wishlistService.removeFromWishlist(id);
            setWishlistItems(wishlistItems.filter(item => item.id !== id));
            setSuccessMessage('Item successfully decommissioned from your wishlist.');
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ 
                        padding: '0', 
                        borderRadius: '50%', 
                        width: '48px', 
                        height: '48px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        textDecoration: 'none',
                        border: '1px solid var(--border)',
                        background: 'white',
                        transition: 'all 0.3s ease'
                    }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em', color: 'var(--text-main)' }}>Curated Favorites</h1>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Personalized selection of premium logistics architecture</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={fetchWishlist} disabled={loading} style={{ height: '48px', padding: '0 1.5rem', borderRadius: 'var(--radius)' }}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Synchronize'}
                    </button>
                    <Link to="/customer/dashboard" className="btn-primary" style={{ height: '48px', padding: '0 1.75rem', borderRadius: 'var(--radius)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700' }}>
                        <ShoppingCart size={18} /> Catalog
                    </Link>
                </div>
            </div>

            {successMessage && (
                <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    padding: '1.25rem 1.75rem',
                    borderRadius: 'var(--radius)',
                    marginBottom: '2.5rem',
                    animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1)'
                }}>
                    <Check size={20} />
                    <span style={{ fontWeight: '600' }}>SYSTEM LOG: {successMessage}</span>
                </div>
            )}

            {error && (
                <div className="form-error" style={{ marginBottom: '2.5rem', padding: '1.25rem 1.75rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                    <AlertCircle size={20} /> 
                    <span style={{ fontWeight: '600' }}>ERROR DETECTED: {error}</span>
                    <button onClick={fetchWishlist} style={{ marginLeft: 'auto', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: '#ef4444', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>RETRY</button>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '12rem 0', animation: 'fadeIn 0.5s ease' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Loader2 size={80} className="animate-spin" style={{ color: 'var(--primary)', opacity: 0.2 }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={32} className="text-primary" style={{ animation: 'pulse 2s infinite' }} />
                        </div>
                    </div>
                    <p className="text-muted mt-8" style={{ fontSize: '1.2rem', fontWeight: '500', letterSpacing: '0.05em' }}>DECRYPTING WISH-LIST MANIFEST...</p>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="auth-card glass-card" style={{ textAlign: 'center', padding: '8rem 4rem', maxWidth: '100%', border: '1px dashed var(--border)', borderRadius: '2.5rem', animation: 'scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <div style={{
                        width: '140px', height: '140px', backgroundColor: 'white', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3rem',
                        boxShadow: '0 30px 40px -10px rgba(0, 0, 0, 0.08)',
                        border: '1px solid var(--border)'
                    }}>
                        <Sparkles size={64} style={{ color: 'var(--primary)', opacity: 0.4 }} />
                    </div>
                    <h2 style={{ fontSize: '2.75rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--text-main)', letterSpacing: '-0.05em' }}>Archive is Empty</h2>
                    <p className="text-muted mb-10" style={{ fontSize: '1.25rem', maxWidth: '40rem', margin: '0 auto 3.5rem', lineHeight: '1.7' }}>
                        Your curated collection is currently vacant. Navigate through our supply chain catalog to indentify assets worthy of your workspace.
                    </p>
                    <Link to="/customer/dashboard" className="btn-primary" style={{ 
                        textDecoration: 'none', 
                        display: 'inline-flex', 
                        width: 'auto', 
                        padding: '1.5rem 4.5rem', 
                        fontSize: '1.2rem', 
                        boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3)', 
                        borderRadius: 'var(--radius-lg)',
                        fontWeight: '800',
                        letterSpacing: '0.02em'
                    }}>
                        EXPLORE CATALOG
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
                    {wishlistItems.map((item, index) => (
                        <div key={item.id} className="auth-card card-hover" style={{ 
                            maxWidth: '100%', 
                            marginBottom: '0', 
                            position: 'relative', 
                            overflow: 'hidden', 
                            padding: '2.5rem', 
                            border: '1px solid var(--border)',
                            background: 'white',
                            animationDelay: `${index * 0.1}s`
                        }}>
                            {/* Decorative element */}
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)', opacity: 0.5, zIndex: 0 }}></div>
                            
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em', background: 'var(--primary-light)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>SKU-{item.id.toString().padStart(4, '0')}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.75rem', letterSpacing: '-0.03em', lineHeight: '1.2' }}>{item.productName}</h3>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)' }}>${item.price.toLocaleString()}</span>
                                            <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: '700' }}>USD</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        disabled={actionLoading === item.id}
                                        style={{
                                            color: '#ef4444',
                                            backgroundColor: '#fef2f2',
                                            border: '1px solid #fee2e2',
                                            padding: '0.85rem',
                                            borderRadius: 'var(--radius)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title="Remove Asset"
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                                    >
                                        {actionLoading === item.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    </button>
                                </div>

                                <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className={`badge ${item.outOfStock ? 'badge-error' : 'badge-success'}`} style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '0.08em', borderRadius: '0.75rem', border: `1px solid ${item.outOfStock ? '#fecaca' : '#bbf7d0'}` }}>
                                        {item.outOfStock ? 'OUT OF STOCK' : 'AVAILABLE FOR DISPATCH'}
                                    </span>
                                    {!item.outOfStock && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontSize: '0.85rem', fontWeight: '700' }}>
                                        <Info size={14} /> Ready to ship
                                    </div>}
                                </div>

                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    <button
                                        className="btn-primary"
                                        disabled={item.outOfStock}
                                        onClick={() => navigate('/customer/checkout', { state: { order: { id: 'ORD-' + Math.floor(1000 + Math.random() * 9000), total: item.price, items: [{ name: item.productName, count: 1, price: item.price }] } } })}
                                        style={{
                                            flex: 3,
                                            height: '3.75rem',
                                            fontSize: '1.1rem',
                                            fontWeight: '800',
                                            letterSpacing: '0.02em',
                                            opacity: item.outOfStock ? 0.4 : 1,
                                            boxShadow: item.outOfStock ? 'none' : '0 12px 20px -5px rgba(37, 99, 235, 0.25)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem'
                                        }}
                                    >
                                        <ShoppingCart size={18} /> INITIALIZE ORDER
                                    </button>
                                    <button
                                        onClick={() => navigate('/customer/dashboard')}
                                        style={{
                                            flex: 1,
                                            height: '3.75rem',
                                            backgroundColor: 'white',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius)',
                                            fontWeight: '700',
                                            color: 'var(--text-main)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-color)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                                    >
                                        SPECS
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;


