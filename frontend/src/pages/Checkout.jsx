import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { checkoutService } from '../services/checkoutService';
import { Upload, CheckCircle, AlertCircle, Loader2, ArrowLeft, Info, ShoppingCart, ShieldCheck, CreditCard, FileText, ChevronRight } from 'lucide-react';

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
                setErrorMessage('Payload overflow: File size exceeds the 10MB limit.');
                setFile(null);
                return;
            }
            // Validation: Types
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setErrorMessage('Invalid encryption format. Please upload PDF, JPG, or PNG.');
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
            setErrorMessage('Security bypass blocked: Payment verification requires a valid receipt upload.');
            return;
        }

        setStatus('uploading');
        setErrorMessage('');
        try {
            await checkoutService.submitBankTransfer(orderData.id, file);
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message || 'Transmission failed. System uplink unstable. Please verify your connection.');
        }
    };

    if (!orderData && status !== 'success') {
        return (
            <div className="dashboard-container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div className="auth-card glass-card" style={{ textAlign: 'center', padding: '6rem 4rem', maxWidth: '45rem', border: '1px dashed var(--border)', borderRadius: '2.5rem' }}>
                    <ShoppingCart size={80} className="text-muted" style={{ margin: '0 auto 2.5rem', opacity: 0.15 }} />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Session Invalid</h2>
                    <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '3.5rem', lineHeight: '1.7', maxWidth: '30rem', margin: '0 auto 3.5rem' }}>
                        The checkout protocol requires an active selection. Please return to our inventory to initialize your procurement.
                    </p>
                    <Link to="/customer/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto', padding: '1.5rem 4rem', fontSize: '1.2rem', fontWeight: '800', borderRadius: 'var(--radius-lg)' }}>
                        RETURN TO CATALOG
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="auth-container animate-fade-in">
                <div className="auth-card text-center glass-card" style={{ maxWidth: '45rem', padding: '5rem 4rem', animation: 'scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', border: '1px solid var(--border)', borderRadius: '3rem' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 3rem',
                        boxShadow: '0 25px 40px -10px rgba(16, 185, 129, 0.4)',
                        position: 'relative'
                    }}>
                        <CheckCircle size={60} color="white" />
                        <div style={{ position: 'absolute', inset: '-10px', borderRadius: '50%', border: '2px dashed #10b981', animation: 'spin 10s linear infinite', opacity: 0.3 }}></div>
                    </div>
                    <h2 style={{ fontSize: '3rem', fontWeight: '950', marginBottom: '1.5rem', color: 'var(--text-main)', letterSpacing: '-0.05em' }}>Deployment Initialized!</h2>
                    <p className="text-muted" style={{ marginBottom: '3.5rem', fontSize: '1.3rem', lineHeight: '1.7', maxWidth: '34rem', margin: '0 auto 3.5rem' }}>
                        Receipt for Order <strong style={{ color: 'var(--primary)' }}>#{orderData?.id}</strong> has been successfully uploaded to the central ledger. 
                        Our audit team will verify the settlement within 24 hours.
                    </p>
                    <div style={{ padding: '1.75rem', backgroundColor: '#f0fdf4', borderRadius: '1.5rem', marginBottom: '4rem', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={24} className="text-success" />
                        <p style={{ fontSize: '1.1rem', color: '#166534', fontWeight: '800', letterSpacing: '0.05em' }}>
                            STATUS: PENDING VERIFICATION
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                        <Link to={`/customer/tracking/${orderData?.id}`} className="btn-primary" style={{ width: 'auto', padding: '1.5rem 4rem', textDecoration: 'none', boxShadow: '0 15px 30px -5px rgba(37, 99, 235, 0.3)', borderRadius: 'var(--radius-lg)', fontWeight: '800' }}>
                            TRACK SHIPMENT
                        </Link>
                        <Link to="/customer/dashboard" className="btn-secondary" style={{ width: 'auto', padding: '1.5rem 4rem', textDecoration: 'none', borderRadius: 'var(--radius-lg)', fontWeight: '800' }}>
                            DASHBOARD
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="header" style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/customer/wishlist" className="btn-secondary" style={{ padding: '0', borderRadius: '50%', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', background: 'white', border: '1px solid var(--border)' }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.75rem', fontWeight: '950', letterSpacing: '-0.05em' }}>Order Settlement</h1>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Finalize your acquisition via secured bank protocol</p>
                    </div>
                </div>
                {/* Simple Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {[
                        { icon: <CreditCard size={16} />, label: 'Transfer' },
                        { icon: <Upload size={16} />, label: 'Upload' },
                        { icon: <ShieldCheck size={16} />, label: 'Verify' }
                    ].map((step, i) => (
                        <React.Fragment key={i}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: i === 1 ? 1 : 0.4 }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: i === 1 ? 'var(--primary)' : 'var(--bg-color)', color: i === 1 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {step.icon}
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{step.label}</span>
                            </div>
                            {i < 2 && <ChevronRight size={16} className="text-muted" style={{ opacity: 0.3 }} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '4rem', alignItems: 'start' }}>
                {/* Left Side: Payment Upload */}
                <div style={{ animation: 'slideUp 0.6s ease-out' }}>
                    <div className="auth-card" style={{ maxWidth: '100%', marginBottom: '2.5rem', padding: '3.5rem', border: '1px solid var(--border)', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.03em' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: '1rem', color: 'var(--primary)' }}>
                                    <CreditCard size={28} />
                                </div>
                                Bank Transfer Data
                            </h3>
                            <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', fontWeight: '900' }}>ENCRYPTED PROTOCOL</div>
                        </div>

                        <div style={{
                            padding: '2.5rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '1.5rem',
                            marginBottom: '3rem',
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.05 }}>
                                <CreditCard size={120} />
                            </div>
                            <h4 style={{ color: 'var(--text-main)', fontSize: '1.15rem', marginBottom: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Beneficiary Target
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                {[
                                    { label: 'Corporate Entity', value: 'LogiQ Supply Chain Ltd.' },
                                    { label: 'Banking Partner', value: 'Global Logistics Bank' },
                                    { label: 'Account Vector', value: '1234-5678-9012' },
                                    { label: 'Routing Matrix', value: 'LOGIQGBSXXX' }
                                ].map((row, i) => (
                                    <div key={i}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{row.label}</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-main)' }}>{row.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '2.5rem', padding: '1.25rem', backgroundColor: 'white', borderRadius: '1rem', display: 'flex', gap: '1rem', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                                <div style={{ padding: '0.5rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '0.5rem' }}>
                                    <Info size={20} />
                                </div>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5', fontWeight: '600' }}>
                                    Security mandate: Use <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{orderData.id}</strong> as your reference.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '3rem' }}>
                                <label className="form-label" style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'block' }}>Indictment of Payment (Receipt)</label>
                                <div style={{
                                    border: file ? '2px solid var(--primary)' : '2px dashed #cbd5e1',
                                    padding: '5rem 2rem',
                                    borderRadius: '1.5rem',
                                    textAlign: 'center',
                                    backgroundColor: file ? 'var(--primary-light)' : 'white',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }}>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    {file ? (
                                        <div style={{ animation: 'scaleUp 0.4s ease' }}>
                                            <div style={{ backgroundColor: 'var(--primary)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1.75rem', borderRadius: '2rem', marginBottom: '1.5rem', fontWeight: '800', fontSize: '0.9rem', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }}>
                                                <FileText size={18} /> DOCUMENT CACHED
                                            </div>
                                            <p style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px', margin: '0 auto' }}>{file.name}</p>
                                            <p className="text-muted" style={{ fontSize: '1rem', marginTop: '0.75rem', fontWeight: '600' }}>{(file.size / 1024).toFixed(1)} KB • Click to re-upload</p>
                                        </div>
                                    ) : (
                                        <div style={{ opacity: 0.8 }}>
                                            <div style={{ 
                                                width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', 
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' 
                                            }}>
                                                <Upload size={40} className="text-primary" />
                                            </div>
                                            <p style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--text-main)' }}>Upload Verification Slip</p>
                                            <p className="text-muted" style={{ fontSize: '1rem', marginTop: '0.75rem', fontWeight: '500' }}>Allowed: PDF, JPG, PNG • Max: 10MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="form-error" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', padding: '1.5rem', borderRadius: '1.25rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                                    <AlertCircle size={24} />
                                    <span style={{ fontWeight: '800', fontSize: '1rem' }}>{errorMessage}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={status === 'uploading'}
                                style={{
                                    height: '5rem',
                                    fontSize: '1.25rem',
                                    fontWeight: '900',
                                    letterSpacing: '0.05em',
                                    boxShadow: '0 20px 30px -10px rgba(37, 99, 235, 0.4)',
                                    borderRadius: '1.25rem'
                                }}
                            >
                                {status === 'uploading' ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                                        <Loader2 size={28} className="animate-spin" />
                                        SYNCING WITH LOGIQ CORE...
                                    </div>
                                ) : (
                                    'SUBMIT FOR AUDIT'
                                )}
                            </button>
                        </form>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p className="text-muted" style={{ fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={16} className="text-success" /> Secured by LogiQ Cryptographic Protocol
                        </p>
                    </div>
                </div>

                {/* Right Side: Summary */}
                <div style={{ position: 'sticky', top: '2rem', animation: 'slideUp 0.6s ease-out 0.2s both' }}>
                    <div className="auth-card" style={{ maxWidth: '100%', border: '1px solid var(--border)', padding: '3rem', borderRadius: '2rem', background: 'white' }}>
                        <h3 style={{ marginBottom: '2.5rem', fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                            Manifest Overview
                        </h3>

                        <div style={{ display: 'grid', gap: '1.75rem', paddingBottom: '2.5rem', borderBottom: '2px dashed var(--border)' }}>
                            {orderData.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-color)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--primary)', fontSize: '0.8rem' }}>
                                            {item.count}X
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.1rem' }}>{item.name}</p>
                                            <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: '700' }}>SKU: ID-{Math.floor(Math.random() * 9000 + 1000)}</p>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: '900', fontSize: '1.25rem' }}>${(item.price * item.count).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <span className="text-muted" style={{ fontWeight: '700', fontSize: '1rem' }}>Subtotal Manifest</span>
                                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>${orderData.total.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                                <span className="text-muted" style={{ fontWeight: '700', fontSize: '1rem' }}>Logistics Tax (0%)</span>
                                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>$0.00</span>
                            </div>

                            <div style={{
                                padding: '2rem',
                                borderRadius: '1.5rem',
                                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.3)'
                            }}>
                                <div>
                                    <span style={{ fontWeight: '700', opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.25rem' }}>Total Commitment</span>
                                    <span style={{ fontSize: '2.25rem', fontWeight: '950', letterSpacing: '-0.03em' }}>${orderData.total.toLocaleString()}</span>
                                </div>
                                <div style={{ opacity: 0.2 }}>
                                    <ShoppingCart size={48} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

