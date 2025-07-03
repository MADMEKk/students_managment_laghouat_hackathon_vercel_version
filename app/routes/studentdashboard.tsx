import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/hooks/useAuth';
import type { User } from '../store/slices/auth';
import LogoutButton from '../components/LogoutButton';
import type { Project, NewProjectData, NewTeamMemberData, TeamMember } from '../types/project';
import { projectService } from '../services/projectService';
import ProjectForm from '../components/ProjectForm';
import ProjectDetails from '../components/ProjectDetails';
import TeamMemberForm from '../components/TeamMemberForm';
import TeamMemberList from '../components/TeamMemberList';
import Modal from '../components/Modal';
import Notification from '../components/Notification';
import type { NotificationType } from '../components/Notification';
import { FaPlus, FaUserPlus, FaSave, FaSpinner, FaSync } from 'react-icons/fa';
import RoleSwitcher from '../components/RoleSwitcher';

/**
 * Student Dashboard component
 * Handles project creation, viewing, and team management
 */
function StudentDashboard() {
  // Auth state and navigation
  const { isAuthenticated, user, hasRole, token } = useAuth();
  const navigate = useNavigate();

  // Dashboard state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state for forms and modals
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  // Loading states for operations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

    if (!hasRole('STUDENT')) {
      const dashboardRoutes = {
        'INCUBATOR': '/incubateurdashboard',
        'CDE': '/cdedashboard',
        'CATI': '/catidashboard',
        'ADMIN': '/admindashboard'
      };
      
      if (user && user.role !== 'STUDENT' && dashboardRoutes[user.role]) {
        navigate(dashboardRoutes[user.role]);
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate, hasRole]);

  // Load student's project data
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProjectData();
    }
  }, [isAuthenticated, token]);

  // Helper function to show notifications
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
  };

  // Fetch project data from API
  const fetchProjectData = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await projectService.getMyProjects(token);
      // Get the projects from the results field
      if (response.results && response.results.length > 0) {
        setActiveProject(response.results[0]);
      }
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to load project data. Please try again later.');
      showNotification('error', 'Failed to load project data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle refreshing project status
  const handleRefresh = async () => {
    if (!token) return;
    
    setIsRefreshing(true);
    setError(null);
    
    try {
      const response = await projectService.getMyProjects(token);
      if (response.results && response.results.length > 0) {
        setActiveProject(response.results[0]);
        showNotification('success', 'Project status refreshed successfully!');
      }
    } catch (err) {
      console.error('Error refreshing project data:', err);
      setError('Failed to refresh project data. Please try again.');
      showNotification('error', 'Failed to refresh project data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle creating a new project
  const handleCreateProject = async (title: string, description: string) => {
    if (!token) return;
    
    setIsSaving(true);
    
    try {
      // Create project data with empty team members (will add representative automatically)
      const projectData: NewProjectData = {
        title,
        description,
        team_members: []
      };
      
      const newProject = await projectService.createProject(projectData, token);
      setActiveProject(newProject);
      setShowCreateProject(false);
      showNotification('success', 'Project created successfully!');
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
      showNotification('error', `Failed to create project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle updating project details
  const handleUpdateProject = async (title: string, description: string) => {
    if (!token || !activeProject) return;
    
    setIsSaving(true);
    
    try {
      const updatedProject = await projectService.updateProject(
        activeProject.id,
        { title, description },
        token
      );
      
      setActiveProject(updatedProject);
      setShowEditProject(false);
      showNotification('success', 'Project updated successfully!');
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project. Please try again.');
      showNotification('error', `Failed to update project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle submitting project for review
  const handleSubmitProject = async () => {
    if (!token || !activeProject) return;
    
    if (!window.confirm("Are you sure you want to submit this project for review? You won't be able to make changes after submission.")) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await projectService.submitProject(activeProject.id, token);
      
      // Fetch the updated project after submission
      const updatedProject = await projectService.getProject(activeProject.id, token);
      setActiveProject(updatedProject);
      
      showNotification('success', 'Project submitted successfully! It is now under review.');
    } catch (err) {
      console.error('Error submitting project:', err);
      setError('Failed to submit project. Please try again.');
      showNotification('error', `Failed to submit project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding a team member
  const handleAddTeamMember = async (memberData: NewTeamMemberData) => {
    if (!token || !activeProject) return;
    
    setIsSaving(true);
    
    try {
      await projectService.addTeamMember(activeProject.id, memberData, token);
      // Refresh project data to get updated team members
      const updatedProject = await projectService.getProject(activeProject.id, token);
      setActiveProject(updatedProject);
      setShowAddMember(false);
      showNotification('success', 'Team member added successfully!');
    } catch (err) {
      console.error('Error adding team member:', err);
      setError('Failed to add team member. Please try again.');
      showNotification('error', `Failed to add team member: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle editing a team member
  const handleEditTeamMember = async (memberData: NewTeamMemberData) => {
    if (!token || !activeProject || !editingMember || !editingMember.id) return;
    
    setIsSaving(true);
    
    try {
      await projectService.updateTeamMember(
        activeProject.id,
        editingMember.id,
        memberData,
        token
      );
      
      // Refresh project data to get updated team members
      const updatedProject = await projectService.getProject(activeProject.id, token);
      setActiveProject(updatedProject);
      setEditingMember(null);
      showNotification('success', 'Team member updated successfully!');
    } catch (err) {
      console.error('Error updating team member:', err);
      setError('Failed to update team member. Please try again.');
      showNotification('error', `Failed to update team member: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle removing a team member
  const handleRemoveTeamMember = async (memberId: number) => {
    if (!token || !activeProject) return;
    
    if (!window.confirm('Are you sure you want to remove this team member?')) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await projectService.removeTeamMember(activeProject.id, memberId, token);
      // Refresh project data to get updated team members
      const updatedProject = await projectService.getProject(activeProject.id, token);
      setActiveProject(updatedProject);
      showNotification('success', 'Team member removed successfully!');
    } catch (err) {
      console.error('Error removing team member:', err);
      setError('Failed to remove team member. Please try again.');
      showNotification('error', `Failed to remove team member: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Check if a new team member can be added (max 6 members total)
  const canAddTeamMember = activeProject && activeProject.team_members.length < 6;

  // If not authenticated or wrong role, don't render anything (will redirect)
  if (!isAuthenticated || !hasRole('STUDENT')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Add RoleSwitcher component */}
      <RoleSwitcher />
      
      {/* Header */}
      <header className="bg-gray-100 dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
          <div>
              <h1 className="text-2xl md:text-3xl font-bold dark:text-gray-500">
              Student Dashboard
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

        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin text-[#FF4D6D] text-4xl mx-auto mb-4" />
            <p className="dark:text-gray-300">Loading your project information...</p>
          </div>
        ) : (
          <>
            {/* No project state */}
            {!activeProject && !showCreateProject ? (
              <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 dark:text-gray-500">
                  No Project Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
                  You don't have any projects yet. Create a new project to get started.
                </p>
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF4D6D] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D6D]"
                >
                  <FaPlus className="mr-2" /> Create New Project
                </button>
              </div>
            ) : null}

            {/* Create Project Form Modal */}
            {showCreateProject && (
              <Modal
                isOpen={showCreateProject}
                onClose={() => setShowCreateProject(false)}
                title="Create New Project"
                size="lg"
              >
                <ProjectForm
                  onSubmit={handleCreateProject}
                  onCancel={() => setShowCreateProject(false)}
                  isSubmitting={isSaving}
                />
              </Modal>
            )}

            {/* Active Project Display */}
            {activeProject && (
              <div className="space-y-8">
                {/* Project Details Section */}
                {showEditProject ? (
                  <Modal
                    isOpen={showEditProject}
                    onClose={() => setShowEditProject(false)}
                    title="Edit Project"
                    size="lg"
                  >
                    <ProjectForm
                      initialData={activeProject}
                      onSubmit={handleUpdateProject}
                      onCancel={() => setShowEditProject(false)}
                      isSubmitting={isSaving}
                    />
                  </Modal>
                ) : null}
                
                <ProjectDetails
                  project={activeProject}
                  onEdit={() => setShowEditProject(true)}
                  onSubmit={handleSubmitProject}
                  isSubmitting={isSubmitting}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />

                {/* Team Members Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold dark:text-gray-500">
                      Project Team
                    </h2>
                    
                    {activeProject.status === 'draft' && canAddTeamMember && (
                      <button
                        onClick={() => setShowAddMember(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF4D6D] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D6D]"
                        disabled={isSaving}
                      >
                        <FaUserPlus className="mr-1" /> Add Member
                      </button>
                    )}
                  </div>

                  {/* Add Team Member Modal */}
                  {showAddMember && (
                    <Modal
                      isOpen={showAddMember}
                      onClose={() => setShowAddMember(false)}
                      title="Add Team Member"
                      size="lg"
                    >
                      <TeamMemberForm
                        onSubmit={handleAddTeamMember}
                        onCancel={() => setShowAddMember(false)}
                        isSubmitting={isSaving}
                      />
                    </Modal>
                  )}

                  {/* Edit Team Member Modal */}
                  {editingMember && (
                    <Modal
                      isOpen={!!editingMember}
                      onClose={() => setEditingMember(null)}
                      title="Edit Team Member"
                      size="lg"
                    >
                      <TeamMemberForm
                        initialData={editingMember}
                        onSubmit={handleEditTeamMember}
                        onCancel={() => setEditingMember(null)}
                        isSubmitting={isSaving}
                      />
                    </Modal>
                  )}

                  {/* Team Members List */}
                  <TeamMemberList
                    members={activeProject.team_members}
                    onEdit={(member) => {
                      setEditingMember(member);
                    }}
                    onDelete={handleRemoveTeamMember}
                    isEditable={activeProject.status === 'draft'}
                  />
                </div>
          </div>
            )}
          </>
        )}
        </main>
    </div>
  );
}

export default StudentDashboard;
