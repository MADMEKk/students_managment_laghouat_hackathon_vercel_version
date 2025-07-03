import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/slices/auth';

interface ProtectedRouteProps {
  allowedRoles?: Array<'STUDENT' | 'INCUBATOR' | 'CDE' | 'CATI' | 'ADMIN'>;
}

/**
 * ProtectedRoute component handles role-based access control
 * It can be used to protect routes based on user authentication and roles
 * 
 * NOTE: Authentication checks are currently bypassed for screenshot purposes
 * 
 * @param allowedRoles - Optional array of roles that are allowed to access the route
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  // For screenshot purposes, we're bypassing all authentication checks
  // and simply rendering the child routes
  return <Outlet />;
};

export default ProtectedRoute; 