import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/slices/auth';

/**
 * RoleSwitcher component for quickly switching between different user roles
 * This is useful for taking screenshots of different dashboards
 */
const RoleSwitcher = () => {
  const { switchRole } = useAuthStore();
  const navigate = useNavigate();

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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Quick Role Switch
        </h3>
        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => handleRoleSelect('STUDENT')}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            Student
          </button>
          
          <button 
            onClick={() => handleRoleSelect('INCUBATOR')}
            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors"
          >
            Incubator
          </button>
          
          <button 
            onClick={() => handleRoleSelect('CDE')}
            className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition-colors"
          >
            CDE
          </button>
          
          <button 
            onClick={() => handleRoleSelect('CATI')}
            className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded transition-colors"
          >
            CATI
          </button>
          
          <button 
            onClick={() => handleRoleSelect('ADMIN')}
            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher; 