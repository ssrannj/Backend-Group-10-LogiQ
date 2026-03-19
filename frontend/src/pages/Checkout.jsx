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
                <div className="auth-card text-center" style={{ maxWidth: '32rem' }}>
                    <CheckCircle size={64} style={{ color: '#166534', margin: '0 auto 1.5rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Payment Sent!</h2>
                    <p className="text-muted" style={{ marginBottom: '2rem' }}>
                        Your payment slip has been uploaded successfully. Our finance team will verify the transfer and update your order status within 24 hours.
                    </p>
                    <Link to="/customer/dashboard" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/customer/dashboard" style={{ color: 'var(--text-muted)' }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Secure Checkout</h1>
                        <p className="text-muted">Order ID: {orderData.id}</p>
                    </div>
                </div>
                <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Left Side: Payment Upload */}
                <div>
                    <div className="auth-card" style={{ maxWidth: '100%', marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Upload size={20} /> Bank Transfer Upload
                        </h3>

                        <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #bae6fd' }}>
                            <h4 style={{ color: '#0369a1', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Info size={16} /> Instructions
                            </h4>
                            <ul style={{ fontSize: '0.85rem', color: '#0c4a6e', paddingLeft: '1.2rem' }}>
                                <li>Transfer the total amount to <strong>LogiQ Bank (Account: 1234-5678-9012)</strong>.</li>
                                <li>Capture a clear photo or screenshot of the transfer receipt.</li>
                                <li>Upload the file below (PDF, JPG, or PNG).</li>
                            </ul>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Upload Payment Slip</label>
                                <div style={{
                                    border: '2px dashed var(--border)',
                                    padding: '2rem',
                                    borderRadius: '0.75rem',
                                    textAlign: 'center',
                                    backgroundColor: '#fafafa',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    {file ? (
                                        <div>
                                            <CheckCircle size={32} style={{ color: '#166534', marginBottom: '0.5rem' }} />
                                            <p style={{ fontWeight: '500' }}>{file.name}</p>
                                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>{(file.size / 1024).toFixed(1)} KB - Click to change</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload size={32} className="text-muted" style={{ marginBottom: '0.5rem' }} />
                                            <p>Click or drag to upload receipt</p>
                                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>PDF, JPG, PNG up to 5MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="form-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <AlertCircle size={18} /> {errorMessage}
                                </div>
                            )}

                            {errorMessage && !status === 'error' && (
                                <div className="form-error" style={{ marginBottom: '1rem' }}>{errorMessage}</div>
                            )}

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={status === 'uploading'}
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {status === 'uploading' ? (
                                    <> <Loader2 size={18} className="animate-spin" /> Uploading Receipt... </>
                                ) : (
                                    'Submit Payment Slip'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Summary */}
                <div className="auth-card" style={{ maxWidth: '100%', backgroundColor: '#fcfcfc' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
                    <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        {orderData.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                <span>{item.name} x{item.count}</span>
                                <span style={{ fontWeight: '500' }}>${item.price * item.count}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        <span>Total Due</span>
                        <span style={{ color: 'var(--primary)' }}>${orderData.total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
