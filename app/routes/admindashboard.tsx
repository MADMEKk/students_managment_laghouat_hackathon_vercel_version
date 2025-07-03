import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/hooks/useAuth';
import LogoutButton from '../components/LogoutButton';
import { projectService } from '../services/projectService';
import Modal from '../components/Modal';
import Notification from '../components/Notification';
import type { NotificationType } from '../components/Notification';
import type { Project } from '../types/project';
import { FaEye, FaSpinner, FaSync, FaArrowRight, FaCog, FaCheckCircle, FaTimesCircle, FaChevronDown } from 'react-icons/fa';
import RoleSwitcher from '../components/RoleSwitcher';

/**
 * Admin Dashboard component
 * Manages projects review process and direction to appropriate interfaces
 */
function AdminDashboard() {
  // Auth state and navigation
  const { isAuthenticated, user, hasRole, token } = useAuth();
  const navigate = useNavigate();

  // Dashboard state
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInterfaceDropdown, setShowInterfaceDropdown] = useState(false);
  const [selectedInterface, setSelectedInterface] = useState<{ id: number, name: string } | null>(null);
  
  // Modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Direction interface options
  const interfaceOptions = [
    { id: 1, name: 'CATI' },
    { id: 2, name: 'Incubator' },
    { id: 3, name: 'CDE' }
  ];

  // Notification state
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  // Check authentication and role
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/signin');
      return;
    }

    if (!hasRole('ADMIN')) {
      const dashboardRoutes = {
        'STUDENT': '/studentdashboard',
        'INCUBATOR': '/incubateurdashboard',
        'CDE': '/cdedashboard',
        'CATI': '/catidashboard'
      };
      
      if (user && user.role !== 'ADMIN' && dashboardRoutes[user.role]) {
        navigate(dashboardRoutes[user.role]);
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate, hasRole]);

  // Load all projects
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAllProjects();
    }
  }, [isAuthenticated, token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showInterfaceDropdown && !(event.target as Element).closest('.interface-dropdown-container')) {
        setShowInterfaceDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInterfaceDropdown]);

  // Helper function to show notifications
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
  };

  // Fetch all projects from API
  const fetchAllProjects = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await projectService.getAllProjects(token);
      setProjects(response.results || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
      showNotification('error', 'Failed to load projects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle refreshing projects
  const handleRefresh = async () => {
    if (!token) return;
    
    setIsRefreshing(true);
    setError(null);
    
    try {
      const response = await projectService.getAllProjects(token);
      setProjects(response.results || []);
      showNotification('success', 'Projects refreshed successfully!');
    } catch (err) {
      console.error('Error refreshing projects:', err);
      setError('Failed to refresh projects. Please try again.');
      showNotification('error', 'Failed to refresh projects. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle updating project status
  const handleUpdateStatus = async (status: 'processing' | 'directed' | 'rejected', directedTo?: number) => {
    if (!token || !selectedProject) return;
    
    setIsUpdating(true);
    
    try {
      await projectService.updateProjectStatus(
        selectedProject.id,
        status,
        token,
        directedTo
      );
      
      // Fetch updated projects
      const response = await projectService.getAllProjects(token);
      setProjects(response.results || []);
      
      setShowStatusModal(false);
      setSelectedProject(null);
      
      const statusText = status === 'processing' 
        ? 'marked as processing' 
        : status === 'directed' 
          ? `directed to ${interfaceOptions.find(i => i.id === directedTo)?.name || 'interface'}` 
          : 'rejected';
      
      showNotification('success', `Project successfully ${statusText}!`);
    } catch (err) {
      console.error('Error updating project status:', err);
      setError('Failed to update project status. Please try again.');
      showNotification('error', `Failed to update project status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get status badge color based on project status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'sent':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'directed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // If not authenticated or wrong role, don't render anything (will redirect)
  if (!isAuthenticated || !hasRole('ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Add RoleSwitcher component */}
      <RoleSwitcher />
      
      {/* Rest of the dashboard */}
      <div className="bg-white dark:bg-gray-950 min-h-screen pb-10">
        {/* Header */}
        <header className="bg-gray-100 dark:bg-gray-900 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold dark:text-gray-500">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Welcome back, {user?.first_name} {user?.last_name}
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Notification */}
          {notification && (
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-red-900 dark:text-red-200" role="alert">
              <p>{error}</p>
              <button 
                className="font-bold hover:underline ml-2" 
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Project List Section */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-500">
                All Projects
              </h2>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF4D6D] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D6D]"
              >
                {isRefreshing ? <FaSpinner className="animate-spin mr-2" /> : <FaSync className="mr-2" />}
                Refresh
              </button>
            </div>

            {/* Loading state */}
            {isLoading ? (
              <div className="text-center py-12">
                <FaSpinner className="animate-spin text-[#FF4D6D] text-4xl mx-auto mb-4" />
                <p className="dark:text-gray-300">Loading projects...</p>
              </div>
            ) : (
              <>
                {/* No projects state */}
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No projects available at this time.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Representative</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Team Size</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {projects.map(project => (
                          <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-500">{project.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-500">{project.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(project.status)}`}>
                                {project.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-500">
                              {project.representative_name || 
                                (project.representative_info ? 
                                  `${project.representative_info.first_name} ${project.representative_info.last_name}` : 
                                  'Unknown')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-500">
                              {project.team_size || (project.team_members ? project.team_members.length : 'Unknown')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(project.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedProject(project);
                                  setShowDetailsModal(true);
                                }}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200"
                              >
                                <FaEye className="inline mr-1" /> View
                              </button>
                              
                              {(project.status === 'submitted' || project.status === 'sent' || project.status === 'processing') && (
                                <button
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setShowStatusModal(true);
                                  }}
                                  className="text-[#FF4D6D] hover:text-[#FF4D6D]/90 ml-2"
                                >
                                  <FaArrowRight className="inline mr-1" /> Update Status
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Project Details Modal */}
          {showDetailsModal && selectedProject && (
            <Modal
              isOpen={showDetailsModal}
              onClose={() => {
                setShowDetailsModal(false);
                setSelectedProject(null);
              }}
              title="Project Details"
              size="lg"
            >
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-500">
                    {selectedProject.title}
                  </h3>
                  <span className={`mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedProject.status)}`}>
                    {selectedProject.status.replace(/_/g, ' ')}
                  </span>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Description</h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {selectedProject.description}
                  </p>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Representative</h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {selectedProject.representative_name || 
                     (selectedProject.representative_info ? 
                      `${selectedProject.representative_info.first_name} ${selectedProject.representative_info.last_name}` : 
                      'Unknown')}
                    {' '}
                    ({selectedProject.representative_email || 
                      (selectedProject.representative_info ? selectedProject.representative_info.email : '')})
                  </p>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Team Size</h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {selectedProject.team_size || (selectedProject.team_members ? selectedProject.team_members.length : 0)} members
                  </p>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Dates</h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(selectedProject.created_at).toLocaleString()}<br />
                    Last Updated: {new Date(selectedProject.updated_at).toLocaleString()}
                  </p>
                </div>
                
                {selectedProject.directed_to && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Directed To</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {interfaceOptions.find(i => i.id === Number(selectedProject.directed_to))?.name || selectedProject.directed_to}
                    </p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedProject(null);
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-500 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Close
                  </button>
                  
                  {(selectedProject.status === 'submitted' || selectedProject.status === 'sent' || selectedProject.status === 'processing') && (
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowStatusModal(true);
                      }}
                      className="ml-3 px-4 py-2 bg-[#FF4D6D] text-white rounded-md hover:bg-[#FF4D6D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D6D]"
                    >
                      {selectedProject.status === 'processing' ? 'Make Final Decision' : 'Update Status'}
                    </button>
                  )}
                </div>
              </div>
            </Modal>
          )}

          {/* Update Status Modal */}
          {showStatusModal && selectedProject && (
            <Modal
              isOpen={showStatusModal}
              onClose={() => {
                setShowStatusModal(false);
                setSelectedProject(null);
                setShowInterfaceDropdown(false);
                setSelectedInterface(null);
              }}
              title={selectedProject.status === 'processing' ? "Make Final Decision" : "Update Project Status"}
              size="md"
            >
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-500">
                    {selectedProject.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Current Status: <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedProject.status)}`}>
                      {selectedProject.status.replace(/_/g, ' ')}
                    </span>
                  </p>
                  
                  {/* Workflow guidance */}
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-xs">
                    {selectedProject.status === 'processing' ? (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Workflow:</span> This project is currently being processed. 
                        You can now make a final decision to either direct it to an interface or reject it.
                      </p>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Workflow:</span> You can mark this project as "Processing" to indicate it's under review, 
                        or directly make a final decision (Direct/Reject).
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {(selectedProject.status === 'submitted' || selectedProject.status === 'sent') && (
                    <button
                      onClick={() => handleUpdateStatus('processing')}
                      disabled={isUpdating}
                      className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                    >
                      <div className="flex items-center">
                        <FaCog className="text-blue-500 mr-2" />
                        <span className="text-gray-900 dark:text-gray-500">Mark as Processing</span>
                      </div>
                      <FaArrowRight className="text-gray-400" />
                    </button>
                  )}
                  
                  {/* Final decision options - available for both initial and processing states */}
                  <div className="relative interface-dropdown-container">
                    <button
                      onClick={() => setShowInterfaceDropdown(!showInterfaceDropdown)}
                      disabled={isUpdating}
                      className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                    >
                      <div className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span className="text-gray-900 dark:text-gray-500">
                          {selectedInterface ? `Direct to ${selectedInterface.name}` : "Direct to Interface"}
                        </span>
                      </div>
                      <FaChevronDown className={`text-gray-400 transition-transform ${showInterfaceDropdown ? 'transform rotate-180' : ''}`} />
                    </button>
                    
                    {/* Interface Dropdown */}
                    {showInterfaceDropdown && (
                      <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-700 shadow-lg">
                        <div className="py-1 max-h-60 overflow-auto">
                          {interfaceOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => {
                                setSelectedInterface(option);
                                setShowInterfaceDropdown(false);
                                if (window.confirm(`Are you sure you want to direct this project to ${option.name}?`)) {
                                  handleUpdateStatus('directed', option.id);
                                }
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              {option.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reject this project?')) {
                        handleUpdateStatus('rejected');
                      }
                    }}
                    disabled={isUpdating}
                    className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                  >
                    <div className="flex items-center">
                      <FaTimesCircle className="text-red-500 mr-2" />
                      <span className="text-gray-900 dark:text-gray-500">Reject Project</span>
                    </div>
                    <FaArrowRight className="text-gray-400" />
                  </button>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedProject(null);
                      setShowInterfaceDropdown(false);
                      setSelectedInterface(null);
                    }}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-500 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
                
                {isUpdating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 dark:bg-opacity-40 rounded-md">
                    <FaSpinner className="animate-spin text-[#FF4D6D] text-4xl" />
                  </div>
                )}
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;