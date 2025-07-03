import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/hooks/useAuth';
import { useAuthStore } from '../store/slices/auth';

export default function Home() {
  const { user, redirectToDashboard } = useAuth();
  const { switchRole } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Function to handle role selection
  const handleRoleSelect = (role: 'STUDENT' | 'INCUBATOR' | 'CDE' | 'CATI' | 'ADMIN') => {
    switchRole(role);
    
    // Redirect to appropriate dashboard
    const dashboardRoutes = {
      'STUDENT': '/studentdashboard',
      'INCUBATOR': '/incubateurdashboard',
      'CDE': '/cdedashboard',
      'CATI': '/catidashboard',
      'ADMIN': '/admindashboard'
    };
    
    navigate(dashboardRoutes[role]);
  };

  // Available routes in the application
  const availableRoutes = [
    { path: '/', name: 'Home' },
    { path: '/auth/signin', name: 'Sign In' },
    { path: '/studentdashboard', name: 'Student Dashboard' },
    { path: '/incubateurdashboard', name: 'Incubator Dashboard' },
    { path: '/cdedashboard', name: 'CDE Dashboard' },
    { path: '/catidashboard', name: 'CATI Dashboard' },
    { path: '/admindashboard', name: 'Admin Dashboard' }
  ];

  // Function to navigate to a selected route
  const navigateToRoute = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Algeria Orientation Committee Platform
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Select a user role to access different dashboards for screenshots
        </p>
        
        {/* Routes Dropdown */}
        <div className="mb-6 relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors flex justify-between items-center"
          >
            <span>Available Routes</span>
            <svg 
              className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
              <ul className="py-1">
                {availableRoutes.map((route) => (
                  <li key={route.path}>
                    <button
                      onClick={() => navigateToRoute(route.path)}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {route.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => handleRoleSelect('STUDENT')}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Student Dashboard
          </button>
          
          <button 
            onClick={() => handleRoleSelect('INCUBATOR')}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Incubator Dashboard
          </button>
          
          <button 
            onClick={() => handleRoleSelect('CDE')}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            CDE Dashboard
          </button>
          
          <button 
            onClick={() => handleRoleSelect('CATI')}
            className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
          >
            CATI Dashboard
          </button>
          
          <button 
            onClick={() => handleRoleSelect('ADMIN')}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
