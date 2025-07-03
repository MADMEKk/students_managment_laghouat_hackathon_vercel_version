// Custom hook for authentication
// Makes it easier to use auth-related functionality throughout the application

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../slices/auth';
import type { User } from '../slices/auth';

// Custom hook that wraps useAuthStore for convenience
export const useAuth = () => {
  // Get all the auth state and actions from the auth store
  const {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    signIn,
    signOut,
    clearError,
    initAuth
  } = useAuthStore();

  const navigate = useNavigate();

  // Initialize auth state from localStorage when the app loads
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Function to login and redirect to appropriate dashboard
  const login = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      
      // Get the updated user from the store after login
      const updatedUser = useAuthStore.getState().user;
      
      if (updatedUser) {
        // Redirect based on user role
        redirectToDashboard(updatedUser);
      }
    } catch (error) {
      // Error is already handled by the store
      console.error('Login failed:', error);
    }
  };

  // Function for admin login
  const adminLogin = async (email: string, password: string) => {
    try {
      clearError();
      
      // Use the regular signIn function
      await signIn(email, password);
      
      // Get the updated user from the store after login
      const updatedUser = useAuthStore.getState().user;
      
      if (updatedUser) {
        if (updatedUser.role === 'ADMIN') {
          // If admin, redirect to admin dashboard
          navigate('/admindashboard');
        } else {
          // If not admin, log them out and show error
          signOut();
          // Set error message via the store
          useAuthStore.setState({ 
            error: 'This login is only for admin users. Please use the regular login.' 
          });
        }
      }
    } catch (error) {
      // Error is already handled by the store
      console.error('Admin login failed:', error);
    }
  };

  // Function to logout and redirect to signin page
  const logout = () => {
    signOut();
    navigate('/auth/signin');
  };

  // Helper to check if user has specific role
  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  // Helper to redirect to appropriate dashboard based on role
  const redirectToDashboard = (userData: User) => {
    const dashboardRoutes = {
      'STUDENT': '/studentdashboard',
      'INCUBATOR': '/incubateurdashboard',
      'CDE': '/cdedashboard',
      'CATI': '/catidashboard',
      'ADMIN': '/admindashboard'
    };
    
    const route = dashboardRoutes[userData.role];
    if (route) {
      navigate(route);
    } else {
      navigate('/');
    }
  };

  return {
    // State
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    hasRole,
    redirectToDashboard,
    clearError,
    adminLogin
  };
}; 