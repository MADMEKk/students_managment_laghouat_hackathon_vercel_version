import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/hooks/useAuth';
import type { User } from '../store/slices/auth';
import type { Project, TeamMember } from '../types/project';
import LogoutButton from '../components/LogoutButton';
import { projectService } from '../services/projectService';
import RoleSwitcher from '../components/RoleSwitcher';

function IncubateurDashboard() {
  const { isAuthenticated, user, hasRole, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [trainingDates, setTrainingDates] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);
  
  // Cache controls
  const projectsCache = useRef<{data: Project[] | null, timestamp: number}>({
    data: null,
    timestamp: 0
  });
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  // Check if the user is authenticated and has the INCUBATOR role
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/auth/signin');
      return;
    }

    // If authenticated but wrong role, redirect to appropriate dashboard
    if (!hasRole('INCUBATOR')) {
      // If user doesn't have the required role, redirect to their dashboard
      const dashboardRoutes: Record<Exclude<User['role'], 'INCUBATOR'>, string> = {
        'STUDENT': '/studentdashboard',
        'CDE': '/cdedashboard',
        'CATI': '/catidashboard',
        'ADMIN': '/admindashboard'
      };
      
      if (user && user.role !== 'INCUBATOR' && dashboardRoutes[user.role]) {
        navigate(dashboardRoutes[user.role]);
      } else {
        // If no matching role or no user, redirect to home
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate, hasRole]);

  // Memoized fetch projects function to prevent unnecessary re-fetches
  const fetchProjects = useCallback(async (forceRefresh = false) => {
    if (!token) return;
    
    // Check if we have cached data and it's still valid
    const now = Date.now();
    if (
      !forceRefresh && 
      projectsCache.current.data && 
      now - projectsCache.current.timestamp < CACHE_DURATION
    ) {
      setProjects(projectsCache.current.data);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // Get projects - filtering is handled in the service
      const data = await projectService.getIncubatorProjects(token);
      
      // Update cache
      projectsCache.current = {
        data,
        timestamp: now
      };
      
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load projects directed to Incubator
  useEffect(() => {
    if (isAuthenticated && hasRole('INCUBATOR') && token) {
      fetchProjects();
    }
  }, [isAuthenticated, token, hasRole, fetchProjects]);

  // Optimized team member fetching - only fetch if not already loaded for this project
  const fetchTeamMembers = useCallback(async (projectId: number) => {
    if (!token) return;
    
    // Check if team members are already in the selected project data
    if (selectedProject?.team_members?.length) {
      setTeamMembers(selectedProject.team_members);
      return;
    }
    
    try {
      const members = await projectService.getTeamMembers(projectId, token);
      
      // Handle case where the API might return an error but with status 200
      if (!Array.isArray(members)) {
        console.error('Unexpected response format for team members:', members);
        setTeamMembers([]);
        return;
      }
      
      setTeamMembers(members);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      // Set empty array on error to avoid showing loading indefinitely
      setTeamMembers([]);
    }
  }, [token, selectedProject]);

  // Load team members when a project is selected
  useEffect(() => {
    if (selectedProject && token) {
      fetchTeamMembers(selectedProject.id);
    }
  }, [selectedProject, token, fetchTeamMembers]);

  // Handle selecting a project to view details
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  // Handle back button to return to projects list
  const handleBackToProjects = () => {
    setSelectedProject(null);
    setTeamMembers([]);
  };

  // Handle refreshing the project list
  const handleRefreshProjects = () => {
    fetchProjects(true); // Force refresh
  };

  // Handle training program upload
  const handleTrainingProgramUpload = async () => {
    if (!fileInputRef.current?.files?.[0] || !trainingDates) {
      setUploadError('Please select a file and enter training dates');
      return;
    }

    try {
      setUploadError('');
      const file = fileInputRef.current.files[0];
      // Use interface ID 3 for Incubator
      await projectService.uploadTrainingProgram(file, trainingDates, token || '', 3);
      setUploadSuccess(true);
      // Reset form
      setTrainingDates('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to upload training program:', error);
      setUploadError('Failed to upload training program');
    }
  };

  // Handle exporting projects to Excel
  const handleExportProjects = async () => {
    if (!token) {
      setExportMessage({
        text: 'Authentication required. Please log in again.',
        type: 'error'
      });
      setTimeout(() => setExportMessage(null), 3000);
      return;
    }
    
    try {
      setExportLoading(true);
      // Clear any existing message
      setExportMessage(null);
      
      console.log('Starting export with token:', token ? 'Token available' : 'No token');
      
      try {
        const blob = await projectService.exportProjects(token);
        
        // Check if we received a valid blob with content
        if (!blob || blob.size === 0) {
          console.error('Received empty blob:', blob);
          throw new Error('Received empty file from server');
        }
        
        console.log('Export blob received, size:', blob.size, 'type:', blob.type);
        
        // Create download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // Determine file extension based on the content type if possible
        let fileExtension = 'xlsx';
        if (blob.type === 'application/vnd.ms-excel') {
          fileExtension = 'xls';
        } else if (blob.type === 'text/csv') {
          fileExtension = 'csv';
        } else if (blob.type === 'application/pdf') {
          fileExtension = 'pdf';
        }
        
        a.download = `incubator-projects-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message
        setExportMessage({
          text: 'Export completed successfully!',
          type: 'success'
        });
      } catch (exportError) {
        // Check if this is an authentication error
        const errorMsg = exportError instanceof Error ? exportError.message : 'Unknown error';
        if (
          errorMsg.includes('401') || 
          errorMsg.includes('authentication') || 
          errorMsg.includes('token') ||
          errorMsg.includes('Authorization')
        ) {
          console.error('Authentication error during export:', exportError);
          throw new Error('Authentication failed. Please log out and log in again.');
        } else {
          throw exportError;
        }
      }
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setExportMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to export projects:', error);
      // Show error message with more details
      setExportMessage({
        text: `${error instanceof Error ? error.message : 'Export failed. Please try again.'}`,
        type: 'error'
      });
      
      // Clear message after 5 seconds for errors (longer to read)
      setTimeout(() => {
        setExportMessage(null);
      }, 5000);
    } finally {
      setExportLoading(false);
    }
  };

  // If not authenticated or wrong role, don't render anything (will redirect)
  if (!isAuthenticated || !hasRole('INCUBATOR')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Add RoleSwitcher component */}
      <RoleSwitcher />
      
      <div className="bg-white dark:bg-gray-950 min-h-screen p-6 relative">
        {/* Export Toast Message */}
        {exportMessage && (
          <div 
            className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
              exportMessage.type === 'success' 
                ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100' 
                : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100'
            }`}
          >
            {exportMessage.text}
          </div>
        )}
        
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold dark:text-gray-500">
                Incubateur Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome back, {user?.first_name} {user?.last_name}
              </p>
            </div>
            <LogoutButton />
          </header>

          <main className="space-y-8">
            {/* User Profile Card */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-500">Your Profile</h2>
              <div className="space-y-2">
                <p className="dark:text-gray-300"><span className="font-medium">Name:</span> {user?.first_name} {user?.last_name}</p>
                <p className="dark:text-gray-300"><span className="font-medium">Email:</span> {user?.email}</p>
                <p className="dark:text-gray-300"><span className="font-medium">Role:</span> Incubator Manager</p>
              </div>
            </div>

            {/* Project Management Section */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold dark:text-gray-500">
                  {selectedProject ? 'Project Details' : 'Projects Directed to Incubator'}
                </h2>
                {!selectedProject && (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleRefreshProjects}
                      disabled={loading}
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-500 px-4 py-2 rounded-md flex items-center space-x-2 disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={handleExportProjects}
                      disabled={exportLoading || loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 disabled:bg-blue-400"
                    >
                      {exportLoading ? (
                        <span>Exporting...</span>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span>Export Projects</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {selectedProject ? (
                <div className="space-y-6">
                  {/* Project Details */}
                  <div>
                    <button
                      onClick={handleBackToProjects}
                      className="text-blue-600 dark:text-blue-400 flex items-center mb-4"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back to Projects
                    </button>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium dark:text-gray-500">{selectedProject.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedProject.description}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                          <p className="font-medium dark:text-gray-300 capitalize">{selectedProject.status.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                          <p className="font-medium dark:text-gray-300">{new Date(selectedProject.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                          <p className="font-medium dark:text-gray-300">{new Date(selectedProject.updated_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Team Size</p>
                          <p className="font-medium dark:text-gray-300">{selectedProject.team_size || teamMembers.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Representative</p>
                          <p className="font-medium dark:text-gray-300">
                            {selectedProject.representative_name || 
                            (selectedProject.representative_info ? 
                              `${selectedProject.representative_info.first_name} ${selectedProject.representative_info.last_name}` : 
                              selectedProject.representative_username)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Representative Email</p>
                          <p className="font-medium dark:text-gray-300">
                            {selectedProject.representative_email ||
                            (selectedProject.representative_info ? 
                              selectedProject.representative_info.email : 
                              '')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 dark:text-gray-500">Team Members</h3>
                    {teamMembers.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student ID</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Field</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {teamMembers.map((member) => (
                              <tr key={member.id || `${member.email}-${member.student_id}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-500">
                                  {member.first_name} {member.last_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {member.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {member.student_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {member.field} ({member.speciality})
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {member.is_representative ? 'Representative' : 'Member'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <p>Team member details are not available.</p>
                        <p className="text-sm mt-2">Please check with the project representative for team information.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                  ) : projects.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Representative</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {projects.map((project) => (
                            <tr key={project.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-500">
                                {project.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {project.representative_name || 
                                 (project.representative_info ? 
                                  `${project.representative_info.first_name} ${project.representative_info.last_name}` :
                                  project.representative_username)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                                {project.status.replace('_', ' ')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(project.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <button
                                  onClick={() => handleSelectProject(project)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                      No projects directed to Incubator at the moment.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Training Program Upload */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-500">Upload Training Program</h2>
              
              {uploadSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100 rounded-md">
                  Training program uploaded successfully!
                </div>
              )}
              
              {uploadError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100 rounded-md">
                  {uploadError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Training Program File (PDF)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md dark:text-gray-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Training Dates and Times
                  </label>
                  <textarea
                    value={trainingDates}
                    onChange={(e) => setTrainingDates(e.target.value)}
                    placeholder="e.g., Every Friday, 9-11 AM, starting June 1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md dark:text-gray-300"
                    rows={3}
                  ></textarea>
                </div>
                
                <div>
                  <button
                    onClick={handleTrainingProgramUpload}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Upload Training Program
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default IncubateurDashboard;