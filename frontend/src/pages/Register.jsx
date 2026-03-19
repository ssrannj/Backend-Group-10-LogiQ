import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER' // Default to CUSTOMER as required
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { fullName, email, password, confirmPassword } = formData;

        // Client-side validation
        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        setSuccess('');
        try {
            const payload = {
                fullName,
                email,
                password,
                role: formData.role
            };
            await authService.register(payload);

            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="text-center" style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Create LogiQ Account
                </h2>

                {error && <div className="form-error text-center mb-6" style={{ background: '#fee2e2', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}
                {success && <div className="form-success text-center mb-6" style={{ background: '#dcfce3', color: '#166534', padding: '0.5rem', borderRadius: '0.5rem' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="form-input"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Role selector is hidden as per requirements, default is customer */}
                    <input type="hidden" id="role" value={formData.role} />

                    <button type="submit" className="btn-primary mt-4" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-6 text-muted" style={{ fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" className="link">Sign in here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
