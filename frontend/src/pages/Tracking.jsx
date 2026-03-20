import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Package, Truck, Check, Clock, ShieldCheck, MapPin, ArrowLeft } from 'lucide-react';

const Tracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Simplified order tracking steps
    const trackingSteps = [
        { key: 'VERIFYING', label: 'Verifying Payment', icon: Clock },
        { key: 'PROCESSING', label: 'Processing', icon: Package },
        { key: 'PACKED', label: 'Packed', icon: ShieldCheck },
        { key: 'SHIPPED', label: 'Out for Delivery', icon: Truck },
        { key: 'DELIVERED', label: 'Delivered', icon: Check }
    ];

    useEffect(() => {
        // Mock data for tracking - real backend integration would replace this
        setTimeout(() => {
            setOrder({
                id: orderId || 'ORD-5542',
                status: 'PACKED', // Current status for demonstration
                productName: 'Premium Leather Sofa',
                price: 899,
                estimatedDelivery: 'Oct 25, 2026',
                address: '123 Supply Chain Road, Logistics City'
            });
            setLoading(false);
        }, 800);
    }, [orderId]);

    const getCurrentStepIndex = () => {
        const statusMap = {
            'VERIFYING': 0,
            'PROCESSING': 1,
            'PACKED': 2,
            'SHIPPED': 3,
            'DELIVERED': 4
        };
        return statusMap[order?.status] ?? 0;
    };

    const currentStepIndex = getCurrentStepIndex();

    if (loading) {
        return (
            <div className="dashboard-container">
                <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                    <div style={{ width: '50px', height: '50px', border: '4px solid #f3f4f6', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }}></div>
                    <p className="text-muted" style={{ fontSize: '1.2rem' }}>Locating your shipment in our network...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
                <div className="auth-card" style={{ textAlign: 'center', padding: '6rem 4rem', maxWidth: '36rem', margin: '4rem auto' }}>
                    <div style={{ backgroundColor: '#fef2f2', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <Package size={48} color="#ef4444" style={{ opacity: 0.5 }} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Order Not Found</h2>
                    <p className="text-muted mb-8" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        We couldn't find any tracking information for the requested Order ID. 
                        Please double-check the ID or contact support if you believe this is an error.
                    </p>
                    <Link to="/customer/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '1rem 3rem' }}>
                        Back to Dashboard
                    </Link>
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
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>Order Tracking</h1>
                        <p className="text-muted">Live status for shipment <strong>#{order.id}</strong></p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2.5rem' }}>
                {/* Order Details Card */}
                <div className="auth-card card-hover" style={{ maxWidth: '100%', height: 'fit-content', padding: '2rem', border: '1px solid var(--border)' }}>
                    <h3 style={{ marginBottom: '2rem', fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.01em' }}>Shipment Details</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '2px dashed #f1f5f9' }}>
                        <div style={{ width: '90px', height: '90px', backgroundColor: '#f8fafc', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                            <Package size={40} className="text-primary" style={{ opacity: 0.8 }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '700', fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{order.productName}</p>
                            <p className="text-muted" style={{ fontWeight: '600' }}>${order.price.toLocaleString()}</p>
                            <div style={{ marginTop: '1rem', padding: '0.5rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                <Clock size={14} className="text-primary" /> Delivery: <strong>{order.estimatedDelivery}</strong>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Destination</p>
                        <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                            <p className="text-main" style={{ fontSize: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', lineHeight: '1.5' }}>
                                <MapPin size={20} className="text-primary" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                                <span>{order.address}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tracking Timeline */}
                <div className="auth-card card-hover" style={{ maxWidth: '100%', padding: '2.5rem', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h3 style={{ fontWeight: '800', fontSize: '1.25rem' }}>Journey Timeline</h3>
                        <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: '700', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
                            ETA: {order.estimatedDelivery}
                        </div>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div style={{ 
                        height: '0.75rem', 
                        backgroundColor: '#f1f5f9', 
                        borderRadius: '1rem', 
                        marginBottom: '4rem',
                        position: 'relative',
                        boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ 
                            height: '100%', 
                            width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%`,
                            background: 'linear-gradient(90deg, var(--primary) 0%, #60a5fa 100%)',
                            borderRadius: '1rem',
                            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                        }}></div>
                    </div>

                    <div style={{ position: 'relative', marginLeft: '1.25rem' }}>
                        {/* Vertical Connector Line */}
                        <div style={{
                            position: 'absolute',
                            left: '12px',
                            top: '5px',
                            bottom: '5px',
                            width: '3px',
                            backgroundColor: '#f1f5f9',
                            zIndex: 0
                        }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {trackingSteps.map((step, index) => {
                                const isCompleted = index < currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                const isPending = index > currentStepIndex;
                                
                                return (
                                    <div key={step.key} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            backgroundColor: isCompleted ? '#10b981' : isCurrent ? 'var(--primary)' : 'white',
                                            border: `3px solid ${isCompleted ? '#10b981' : isCurrent ? 'var(--primary)' : '#e2e8f0'}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: isCompleted || isCurrent ? 'white' : '#cbd5e1',
                                            transition: 'all 0.4s ease',
                                            boxShadow: isCurrent ? '0 0 0 5px rgba(59, 130, 246, 0.2)' : 'none'
                                        }}>
                                            {isCompleted ? <Check size={16} strokeWidth={3} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isCurrent ? 'white' : '#e2e8f0' }}></div>}
                                        </div>
                                        <div style={{ flex: 1, marginTop: '-2px' }}>
                                            <p style={{ 
                                                fontSize: '1.1rem',
                                                fontWeight: isCurrent || isCompleted ? '700' : '500',
                                                color: isPending ? '#94a3b8' : 'var(--text-main)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem'
                                            }}>
                                                <step.icon size={22} style={{ color: isCompleted ? '#10b981' : isCurrent ? 'var(--primary)' : '#cbd5e1' }} />
                                                {step.label}
                                            </p>
                                            {isCurrent && (
                                                <div style={{ marginTop: '0.75rem', animation: 'pulse 2s infinite' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', backgroundColor: '#eff6ff', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', fontWeight: '700', border: '1px solid #dbeafe' }}>
                                                        CURRENT STATUS
                                                    </span>
                                                </div>
                                            )}
                                            {isCompleted && <p style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.5rem', fontWeight: '600' }}>Verification Complete</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tracking;
