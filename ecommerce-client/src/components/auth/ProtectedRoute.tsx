import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading if authentication is being checked
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required but user is not admin, redirect to home
  if (requireAdmin && user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  // If authenticated (and admin if required), render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 