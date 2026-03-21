import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { checkoutService } from '../services/checkoutService';
import { Upload, CheckCircle, AlertCircle, Loader2, ArrowLeft, Info, ShoppingCart } from 'lucide-react';

const Checkout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Order details from navigation state
    const orderData = location.state?.order;

    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validation: Max 10MB
            if (selectedFile.size > 10 * 1024 * 1024) {
                setErrorMessage('File size exceeds the 10MB limit.');
                setFile(null);
                return;
            }
            // Validation: Types
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setErrorMessage('Invalid format. Please upload PDF, JPG, or PNG.');
                setFile(null);
                return;
            }
            
            setFile(selectedFile);
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage('Payment verification requires a valid receipt upload.');
            return;
        }

        setStatus('uploading');
        setErrorMessage('');
        try {
            await checkoutService.submitBankTransfer(orderData.id, file);
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message || 'Transmission failed. Please verify your connection.');
        }
    };

    if (!orderData && status !== 'success') {
        return (
            <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div className="auth-card" style={{ textAlign: 'center', padding: '6rem 4rem', maxWidth: '40rem', margin: '4rem auto', border: '2px dashed var(--border)' }}>
                    <ShoppingCart size={64} className="text-muted" style={{ margin: '0 auto 2rem', opacity: 0.3 }} />
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>No Active Checkout</h2>
                    <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
                        It seems you haven't selected any items for purchase yet. 
                        Please visit our catalog to find pieces for your space.
                    </p>
                    <Link to="/customer/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '1.25rem 3rem' }}>
                        Browse Catalog
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="auth-container">
                <div className="auth-card text-center" style={{ maxWidth: '40rem', padding: '4rem', animation: 'scaleUp 0.4s ease-out', border: '1px solid var(--border)' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.4)'
                    }}>
                        <CheckCircle size={50} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Submission Received!</h2>
                    <p className="text-muted" style={{ marginBottom: '2.5rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
                        Your payment proof for Order <strong>#{orderData?.id}</strong> has been successfully uploaded. 
                        Verification usually takes less than 24 business hours.
                    </p>
                    <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '1rem', marginBottom: '3rem', border: '1px solid #bbf7d0' }}>
                        <p style={{ fontSize: '0.95rem', color: '#166534', fontWeight: '700' }}>
                            <Info size={18} className="inline-block mr-2 mt-[-2px]" /> Current Status: PENDING VERIFICATION
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link to={`/customer/tracking/${orderData?.id}`} className="btn-primary" style={{ width: 'auto', padding: '1.25rem 3rem', textDecoration: 'none', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}>
                            Track Order
                        </Link>
                        <Link to="/customer/dashboard" className="btn-secondary" style={{ width: 'auto', padding: '1.25rem 3rem', textDecoration: 'none' }}>
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <ArrowLeft size={22} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Checkout</h1>
                        <p className="text-muted">Finalize your acquisition of premium logistics furniture</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3rem', alignItems: 'start' }}>
                {/* Left Side: Payment Upload */}
                <div>
                    <div className="auth-card" style={{ maxWidth: '100%', marginBottom: '2rem', padding: '3rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.5rem', fontWeight: '800' }}>
                            <Upload size={28} className="text-primary" /> Bank Transfer Protocol
                        </h3>

                        <div style={{
                            padding: '2rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '1.25rem',
                            marginBottom: '2.5rem',
                            border: '1px solid #e2e8f0',
                        }}>
                            <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '700' }}>
                                Account Beneficiary Details
                            </h4>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {[
                                    { label: 'Beneficiary', value: 'LogiQ Supply Chain Ltd.' },
                                    { label: 'Bank Institution', value: 'Global Logistics Bank' },
                                    { label: 'Account Matrix', value: '1234-5678-9012' },
                                    { label: 'Swift / Code', value: 'LOGIQGBSXXX' }
                                ].map((row, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                                        <span className="text-muted" style={{ fontWeight: '500' }}>{row.label}:</span>
                                        <strong style={{ color: 'var(--text-main)' }}>{row.value}</strong>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.75rem', display: 'flex', gap: '0.75rem', border: '1px solid #dbeafe' }}>
                                <Info size={18} className="text-primary" style={{ flexShrink: 0 }} />
                                <p style={{ fontSize: '0.85rem', color: '#1e40af', lineHeight: '1.5' }}>
                                    Please use <strong>{orderData.id}</strong> as your transaction reference to ensure swift verification.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label className="form-label" style={{ fontWeight: '700', marginBottom: '1rem', display: 'block' }}>Payment Validation Document</label>
                                <div style={{
                                    border: file ? '2px solid var(--primary)' : '2px dashed #cbd5e1',
                                    padding: '4rem 2rem',
                                    borderRadius: '1.25rem',
                                    textAlign: 'center',
                                    backgroundColor: file ? '#f0f7ff' : 'white',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    {file ? (
                                        <div>
                                            <div style={{ backgroundColor: '#10b981', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '2rem', marginBottom: '1.25rem', fontWeight: '700', fontSize: '0.85rem' }}>
                                                <CheckCircle size={16} /> RECEIPT SELECTED
                                            </div>
                                            <p style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-main)' }}>{file.name}</p>
                                            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Payload Size: {(file.size / 1024).toFixed(1)} KB • Click to swap</p>
                                        </div>
                                    ) : (
                                        <div style={{ opacity: 0.6 }}>
                                            <Upload size={56} className="text-primary" style={{ marginBottom: '1.25rem' }} />
                                            <p style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-main)' }}>Transmit Document</p>
                                            <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>PDF, JPEG, or PNG formats • Max 10MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="form-error" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '1.25rem', borderRadius: '1rem' }}>
                                    <AlertCircle size={20} />
                                    <span style={{ fontWeight: '600' }}>{errorMessage}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={status === 'uploading'}
                                style={{
                                    height: '4rem',
                                    fontSize: '1.2rem',
                                    fontWeight: '800',
                                    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)'
                                }}
                            >
                                {status === 'uploading' ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                                        <Loader2 size={24} className="animate-spin" />
                                        PROCESSSING...
                                    </div>
                                ) : (
                                    'INITIATE VERIFICATION'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Summary */}
                <div className="auth-card" style={{ maxWidth: '100%', border: '1px solid var(--border)', padding: '2.5rem', position: 'sticky', top: '2rem' }}>
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Manifest Overview
                    </h3>

                    <div style={{ display: 'grid', gap: '1.25rem', paddingBottom: '2rem', borderBottom: '2px dashed #e2e8f0' }}>
                        {orderData.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</p>
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Quantity Offset: {item.count}</p>
                                </div>
                                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>${(item.price * item.count).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span className="text-muted" style={{ fontWeight: '600' }}>Subtotal Manifest</span>
                            <span style={{ fontWeight: '700' }}>${orderData.total.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <span className="text-muted" style={{ fontWeight: '600' }}>Logistics Tax</span>
                            <span style={{ fontWeight: '700' }}>$0.00</span>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            borderRadius: '1.25rem',
                            background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)'
                        }}>
                            <span style={{ fontWeight: '600', opacity: 0.9 }}>Total Commitment</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: '900' }}>${orderData.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
