import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../store/hooks/useAuth';

interface LogoutButtonProps {
  className?: string;
}

/**
 * A reusable logout button component that can be used across all dashboards
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '' }) => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-[#FF4D6D] rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D6D] transition-colors ${className}`}
    >
      <FaSignOutAlt className="mr-2" />
      Logout
    </button>
  );
};

export default LogoutButton; 