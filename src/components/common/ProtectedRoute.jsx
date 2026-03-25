import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';

const ProtectedRoute = ({ children, role }) => {
    const { user } = useStore();
    const location = useLocation();

    if (!user) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user.role !== role) {
        // User is logged in but doesn't have the required role
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
