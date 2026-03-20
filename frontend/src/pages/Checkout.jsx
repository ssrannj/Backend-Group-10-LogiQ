import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { checkoutService } from '../services/checkoutService';
import { Upload, CheckCircle, AlertCircle, Loader2, ArrowLeft, Info } from 'lucide-react';

const Checkout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Mock extraction of order details - would come from state or API in a real flow
    const orderData = location.state?.order || {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        total: 1250,
        items: [
            { name: 'Premium Leather Sofa', count: 1, price: 899 },
            { name: 'Modern Floor Lamp', count: 2, price: 175 }
        ]
    };

    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage('Please upload your payment slip before submitting.');
            return;
        }

        setStatus('uploading');
        setErrorMessage('');
        try {
            await checkoutService.submitBankTransfer(orderData.id, file);
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (status === 'success') {
        return (
            <div className="auth-container">
                <div className="auth-card text-center card-hover" style={{ maxWidth: '32rem', padding: '3rem' }}>
                    <div className="gradient-bg" style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
                    }}>
                        <CheckCircle size={40} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-main)' }}>Payment Submitted!</h2>
                    <p className="text-muted" style={{ marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                        Your payment slip has been uploaded successfully for Order <strong>#{orderData.id}</strong>.
                        Verification usually takes less than 24 hours.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/customer/tracking" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem', textDecoration: 'none' }}>
                            Track Order
                        </Link>
                        <Link to="/customer/dashboard" className="btn-secondary" style={{ width: 'auto', padding: '0.75rem 2rem', textDecoration: 'none' }}>
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Checkout</h1>
                        <p className="text-muted">Complete your purchase for order #{orderData.id}</p>
                    </div>
                </div>
                <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
                {/* Left Side: Payment Upload */}
                <div>
                    <div className="auth-card card-hover" style={{ maxWidth: '100%', marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                            <Upload size={24} style={{ color: 'var(--primary)' }} /> Bank Transfer Details
                        </h3>

                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                            borderRadius: '1rem',
                            marginBottom: '2rem',
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05 }}>
                                <Info size={100} />
                            </div>
                            <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                                <Info size={18} className="text-primary" /> Transfer Instructions
                            </h4>
                            <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.95rem', color: '#475569' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
                                    <span>Bank Name:</span>
                                    <strong style={{ color: 'var(--text-main)' }}>LogiQ Bank</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
                                    <span>Account Number:</span>
                                    <strong style={{ color: 'var(--text-main)' }}>1234-5678-9012</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
                                    <span>Swift/BIC:</span>
                                    <strong style={{ color: 'var(--text-main)' }}>LOGIQBANKXXX</strong>
                                </div>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.85rem', fontStyle: 'italic', opacity: 0.8 }}>
                                * Please include your Order ID #{orderData.id} as the transfer reference.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Payment Proof (Screenshot / Receipt)</label>
                                <div style={{
                                    border: file ? '2px solid var(--primary)' : '2px dashed var(--border)',
                                    padding: '3rem 2rem',
                                    borderRadius: '1rem',
                                    textAlign: 'center',
                                    backgroundColor: file ? '#f0f7ff' : '#f8fafc',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                    className="card-hover">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    {file ? (
                                        <div style={{ animation: 'slideUp 0.3s ease-out' }}>
                                            <div className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', marginBottom: '1rem' }}>
                                                <CheckCircle size={16} /> Selected
                                            </div>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>{file.name}</p>
                                            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{(file.size / 1024).toFixed(1)} KB • Click to replace</p>
                                        </div>
                                    ) : (
                                        <div style={{ opacity: 0.7 }}>
                                            <Upload size={48} style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.8 }} />
                                            <p style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-main)' }}>Click or drag receipt here</p>
                                            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Supports PDF, JPG, PNG up to 10MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {(status === 'error' || errorMessage) && (
                                <div className="form-error" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '1.5rem',
                                    padding: '1rem',
                                    backgroundColor: '#fff1f2',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #fda4af'
                                }}>
                                    <AlertCircle size={20} />
                                    <span>{errorMessage || 'An error occurred during upload.'}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={status === 'uploading'}
                                style={{
                                    height: '3.5rem',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
                                }}
                            >
                                {status === 'uploading' ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Loader2 size={24} className="animate-spin" />
                                        Uploading Payment Proof...
                                    </div>
                                ) : (
                                    'Complete Checkout'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Summary */}
                <div className="auth-card card-hover" style={{ maxWidth: '100%', border: '1px solid var(--border)', position: 'sticky', top: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '0.5rem' }}>
                            <Info size={20} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Order Summary</h3>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '2px dashed #f1f5f9' }}>
                        {orderData.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</span>
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>Qty: {item.count}</span>
                                </div>
                                <span style={{ fontWeight: 'bold' }}>${(item.price * item.count).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span className="text-muted">Subtotal</span>
                            <span>${orderData.total.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span className="text-muted">Tax (0%)</span>
                            <span>$0.00</span>
                        </div>

                        <div className="gradient-bg" style={{
                            padding: '1.25rem',
                            borderRadius: '1rem',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
                        }}>
                            <span style={{ fontWeight: '500', opacity: 0.9 }}>Total Amount</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${orderData.total.toLocaleString()}</span>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                        All payments are processed securely.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
