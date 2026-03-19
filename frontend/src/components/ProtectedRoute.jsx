import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
    const { user, isAuthenticated } = useAuth();

    // If not authenticated, redirect to login page
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // If role isn't matched and a specific role is required
    if (requiredRole && user.role !== requiredRole) {
        // Redirect wrong role to their proper dashboard or homepage
        if (user.role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/customer/dashboard" replace />;
        }
    }

    // If all checks pass, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
