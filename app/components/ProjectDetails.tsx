import React from 'react';
import type { Project, ProjectStatus } from '../types/project';
import { FaEdit, FaCheck, FaTimes, FaHourglass, FaFileAlt, FaSpinner, FaExchangeAlt, FaSync } from 'react-icons/fa';

// Props interface for the ProjectDetails component
interface ProjectDetailsProps {
  project: Project;
  onEdit: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onRefresh?: () => void; // Optional refresh callback
  isRefreshing?: boolean; // Optional refreshing state
}

/**
 * Component to display project details
 * Includes edit and submit options if project is in draft state
 */
function ProjectDetails({ project, onEdit, onSubmit, isSubmitting, onRefresh, isRefreshing }: ProjectDetailsProps) {
  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Map interface ID to interface name
  const getInterfaceName = (id: string | null) => {
    if (!id) return '';
    
    const interfaceOptions = [
      { id: 1, name: 'CATI' },
      { id: 2, name: 'Incubator' },
      { id: 3, name: 'CDE' }
    ];
    
    // Convert the id to number for comparison
    const numId = Number(id);
    const interfaceOption = interfaceOptions.find(option => option.id === numId);
    return interfaceOption ? interfaceOption.name : id;
  };

  // Get status badge based on project status
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-500">
            <FaFileAlt className="mr-1" /> Draft
          </span>
        );
      case 'submitted':
      case 'sent':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <FaHourglass className="mr-1" /> Submitted
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <FaSpinner className="mr-1 animate-spin" /> Processing
          </span>
        );
      case 'directed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            <FaExchangeAlt className="mr-1" /> Directed {project.directed_to ? `to ${getInterfaceName(project.directed_to)}` : ''}
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <FaTimes className="mr-1" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  // Only allow editing if project is in draft status
  const canEditProject = project.status === 'draft';

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold dark:text-gray-500">Project Details</h2>
        <div className="flex items-center space-x-2">
          {getStatusBadge(project.status)}
          {project.status !== 'draft' && onRefresh && (
            <button 
              onClick={onRefresh}
              className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300 focus:outline-none" 
              title="Refresh project status"
              disabled={isRefreshing}
            >
              <FaSync className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4 transition-transform hover:rotate-180 duration-500"} />
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium dark:text-gray-500 flex justify-between items-center">
            {project.title}
            {canEditProject && (
              <button
                onClick={onEdit}
                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 flex items-center"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
            )}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-line">
            {project.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
            <p className="text-gray-900 dark:text-gray-500">{formatDate(project.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="text-gray-900 dark:text-gray-500">{formatDate(project.updated_at)}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Representative</p>
          <p className="text-gray-900 dark:text-gray-500">
            {project.representative_info.first_name} {project.representative_info.last_name} ({project.representative_info.email})
          </p>
        </div>
        
        {project.directed_to && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Directed To</p>
            <p className="text-gray-900 dark:text-gray-500">
              {getInterfaceName(project.directed_to)}
            </p>
          </div>
        )}
        
        {canEditProject && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF4D6D] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D6D] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Project...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" /> Submit Project for Review
                </>
              )}
            </button>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Warning: After submission, you will no longer be able to edit this project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails; 