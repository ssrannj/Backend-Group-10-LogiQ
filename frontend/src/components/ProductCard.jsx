import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { wishlistService } from '../services/wishlistService';

const ProductCard = ({ product, onWishlistUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleAddToWishlist = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            await wishlistService.addToWishlist(product.id);
            setSuccess(true);
            if (onWishlistUpdate) onWishlistUpdate();
            // Reset success after 2 seconds
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isOutOfStock = product.stock <= 0;

    return (
        <div className={`auth-card`} style={{ maxWidth: '100%', marginBottom: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{product.name}</h3>
                    <p className="text-muted" style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>${product.price}</p>
                    <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        backgroundColor: isOutOfStock ? '#fee2e2' : '#dcfce3',
                        color: isOutOfStock ? '#991b1b' : '#166534',
                        fontWeight: '600'
                    }}>
                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                    </span>
                </div>

                <button
                    onClick={handleAddToWishlist}
                    disabled={loading}
                    className="btn-secondary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: success ? '1px solid #166534' : '1px solid var(--border)',
                        color: success ? '#166534' : 'var(--text-main)'
                    }}
                    title="Add to Wishlist"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={success ? "#166534" : "none"} />}
                    {isOutOfStock ? "Notify Me" : "Wishlist"}
                </button>
            </div>

            {error && <p className="form-error" style={{ marginTop: '0.5rem' }}>{error}</p>}
            {success && <p style={{ marginTop: '0.5rem', color: '#166534', fontSize: '0.875rem' }}>Added to wishlist!</p>}
        </div>
    );
};

export default ProductCard;
