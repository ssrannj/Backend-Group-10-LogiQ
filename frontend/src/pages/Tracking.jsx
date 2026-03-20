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

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Order Tracking</h1>
                        <p className="text-muted">Order #{order?.id}</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <p className="text-muted">Retrieving tracking details...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                    {/* Order Details Card */}
                    <div className="auth-card" style={{ maxWidth: '100%', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Order Details</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Package size={32} className="text-muted" />
                            </div>
                            <div>
                                <p style={{ fontWeight: '600' }}>{order.productName}</p>
                                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Price: ${order.price}</p>
                                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Est. Delivery: <strong>{order.estimatedDelivery}</strong></p>
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Shipping Address</p>
                            <p className="text-muted" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={16} /> {order.address}
                            </p>
                        </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="auth-card" style={{ maxWidth: '100%' }}>
                        <h3 style={{ marginBottom: '2rem', fontWeight: 'bold' }}>Shipment Status</h3>
                        <div style={{ position: 'relative', marginLeft: '1rem' }}>
                            {/* Vertical Line */}
                            <div style={{
                                position: 'absolute',
                                left: '11px',
                                top: '0',
                                bottom: '0',
                                width: '2px',
                                backgroundColor: '#e5e7eb',
                                zIndex: 0
                            }}></div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {trackingSteps.map((step, index) => {
                                    const isCompleted = index < currentStepIndex;
                                    const isCurrent = index === currentStepIndex;
                                    const isPending = index > currentStepIndex;
                                    
                                    return (
                                        <div key={step.key} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                backgroundColor: isCompleted ? '#10b981' : isCurrent ? 'var(--primary)' : 'white',
                                                border: `2px solid ${isCompleted ? '#10b981' : isCurrent ? 'var(--primary)' : '#e5e7eb'}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: isCompleted || isCurrent ? 'white' : '#9ca3af'
                                            }}>
                                                {isCompleted ? <Check size={14} /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isCurrent ? 'white' : '#e5e7eb' }}></div>}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ 
                                                    fontWeight: isCurrent || isCompleted ? '600' : '400',
                                                    color: isPending ? 'var(--text-muted)' : 'var(--text-main)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem'
                                                }}>
                                                    <step.icon size={18} style={{ color: isCompleted ? '#10b981' : isCurrent ? 'var(--primary)' : '#9ca3af' }} />
                                                    {step.label}
                                                </p>
                                                {isCurrent && <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.25rem', fontWeight: '500' }}>In Progress</p>}
                                                {isCompleted && <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Completed</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tracking;
