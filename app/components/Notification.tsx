import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Type for the notification type
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Props interface for the Notification component
interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

/**
 * Notification component for displaying success, error, info, and warning messages
 * Can be configured to auto-close after a specified time
 */
function Notification({ 
  type, 
  message, 
  onClose, 
  autoClose = true, 
  autoCloseTime = 5000 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-close the notification after a specified time
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, isVisible, onClose]);
  
  // Handle manual close
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  // Return null if not visible
  if (!isVisible) return null;
  
  // Define styles based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-100 dark:bg-green-900',
          border: 'border-green-500',
          text: 'text-green-700 dark:text-green-200',
          icon: <FaCheckCircle className="h-5 w-5 text-green-500 dark:text-green-300" />
        };
      case 'error':
        return {
          bg: 'bg-red-100 dark:bg-red-900',
          border: 'border-red-500',
          text: 'text-red-700 dark:text-red-200',
          icon: <FaExclamationTriangle className="h-5 w-5 text-red-500 dark:text-red-300" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900',
          border: 'border-yellow-500',
          text: 'text-yellow-700 dark:text-yellow-200',
          icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-300" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-900',
          border: 'border-blue-500',
          text: 'text-blue-700 dark:text-blue-200',
          icon: <FaInfoCircle className="h-5 w-5 text-blue-500 dark:text-blue-300" />
        };
    }
  };
  
  const styles = getTypeStyles();
  
  return (
    <div className={`${styles.bg} border-l-4 ${styles.border} p-4 mb-4 rounded-md shadow-md`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className={`ml-3 ${styles.text} flex-1`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={handleClose}
              className={`inline-flex ${styles.text} rounded-md p-1.5 hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500`}
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification; 