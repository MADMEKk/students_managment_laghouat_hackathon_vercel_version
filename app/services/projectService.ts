import type { NewProjectData, Project, UpdateProjectData, TeamMember, NewTeamMemberData, UpdateTeamMemberData } from '../types/project';
import { processApiError } from '../utils/apiUtils';
import { 
  mockProjects, 
  mockStatistics,
  getProjectsByStatus,
  getProjectsByStudentId,
  getProjectsByIncubatorId,
  getProjectsByCDEId,
  getProjectsByCATIId,
  getProjectById
} from '../utils/mockData';

// For screenshot purposes, we're using mock data instead of real API calls
// const API_BASE_URL = 'http://192.168.92.224:9000';

/**
 * Project API service for managing student projects
 * MOCK VERSION: Uses local mock data instead of real API calls
 */
export const projectService = {
  /**
   * Create a new project with the current student as representative
   * @param projectData - Project data including title, description, and team members
   * @param token - Authentication token 
   * @returns New project data
   */
  async createProject(projectData: NewProjectData, token: string): Promise<Project> {
    try {
      // Create a new mock project with the provided data
      const newProject = {
        id: mockProjects.length + 1,
        title: projectData.title,
        description: projectData.description,
        status: 'DRAFT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        student_id: 1001, // Default to the current student ID
        team_members: [],
        feedback: []
      } as Project;
      
      // Add the new project to the mock projects
      mockProjects.push(newProject);
      
      return Promise.resolve(newProject);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Get a project by ID
   * @param projectId - Project ID to retrieve
   * @param token - Authentication token
   * @returns Project data
   */
  async getProject(projectId: number, token: string): Promise<Project> {
    try {
      const project = getProjectById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      return Promise.resolve(project);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Get all projects for the current student
   * @param token - Authentication token
   * @returns Array of projects
   */
  async getProjects(token: string): Promise<Project[]> {
    try {
      // Return all projects for demo purposes
      return Promise.resolve(mockProjects);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Update project details (only available before submission)
   * @param projectId - Project ID to update
   * @param updateData - Data to update
   * @param token - Authentication token
   * @returns Updated project data
   */
  async updateProject(projectId: number, updateData: UpdateProjectData, token: string): Promise<Project> {
    try {
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        throw new Error('Project not found');
      }
      
      // Update the project with the new data
      const updatedProject = {
        ...mockProjects[projectIndex],
        ...updateData,
        updated_at: new Date().toISOString()
      };
      
      mockProjects[projectIndex] = updatedProject;
      
      return Promise.resolve(updatedProject);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Submit a project for review (changes status from "draft" to "submitted")
   * @param projectId - Project ID to submit
   * @param token - Authentication token
   * @returns Updated project data with submitted status
   */
  async submitProject(projectId: number, token: string): Promise<Project> {
    try {
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        throw new Error('Project not found');
      }
      
      // Update the project status to submitted
      const updatedProject = {
        ...mockProjects[projectIndex],
        status: 'SUBMITTED',
        updated_at: new Date().toISOString()
      };
      
      mockProjects[projectIndex] = updatedProject;
      
      return Promise.resolve(updatedProject);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Get all team members for a specific project
   * @param projectId - Project ID
   * @param token - Authentication token
   * @returns Array of team members
   */
  async getTeamMembers(projectId: number, token: string): Promise<TeamMember[]> {
    try {
      const project = getProjectById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      return Promise.resolve(project.team_members || []);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Add a new team member to a project
   * @param projectId - Project ID
   * @param memberData - New team member data
   * @param token - Authentication token
   * @returns Created team member data
   */
  async addTeamMember(projectId: number, memberData: NewTeamMemberData, token: string): Promise<TeamMember> {
    try {
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        throw new Error('Project not found');
      }
      
      // Create a new team member
      const newMember = {
        id: Date.now(),
        name: memberData.name,
        email: memberData.email,
        role: memberData.role,
        student_id: memberData.student_id
      };
      
      // Add the team member to the project
      if (!mockProjects[projectIndex].team_members) {
        mockProjects[projectIndex].team_members = [];
      }
      
      mockProjects[projectIndex].team_members?.push(newMember);
      
      return Promise.resolve(newMember);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Update a team member's details
   * @param projectId - Project ID
   * @param memberId - Team member ID to update
   * @param updateData - Data to update
   * @param token - Authentication token
   * @returns Updated team member data
   */
  async updateTeamMember(
    projectId: number, 
    memberId: number, 
    updateData: UpdateTeamMemberData, 
    token: string
  ): Promise<TeamMember> {
    try {
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        throw new Error('Project not found');
      }
      
      const memberIndex = mockProjects[projectIndex].team_members?.findIndex(m => m.id === memberId);
      
      if (memberIndex === undefined || memberIndex === -1) {
        throw new Error('Team member not found');
      }
      
      // Update the team member
      const updatedMember = {
        ...mockProjects[projectIndex].team_members![memberIndex],
        ...updateData
      };
      
      mockProjects[projectIndex].team_members![memberIndex] = updatedMember;
      
      return Promise.resolve(updatedMember);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Remove a team member from a project
   * @param projectId - Project ID
   * @param memberId - Team member ID to remove
   * @param token - Authentication token
   * @returns Success status
   */
  async removeTeamMember(projectId: number, memberId: number, token: string): Promise<{ success: boolean }> {
    try {
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        throw new Error('Project not found');
      }
      
      // Filter out the team member to remove
      if (mockProjects[projectIndex].team_members) {
        mockProjects[projectIndex].team_members = mockProjects[projectIndex].team_members?.filter(
          m => m.id !== memberId
        );
      }
      
      return Promise.resolve({ success: true });
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Get all projects for the current student with pagination
   * @param token - Authentication token
   * @returns Array of projects with pagination data
   */
  async getMyProjects(token: string): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Project[];
  }> {
    try {
      // Get projects for student with ID 1001 (default student)
      const studentProjects = getProjectsByStudentId(1001);
      
      return Promise.resolve({
        count: studentProjects.length,
        next: null,
        previous: null,
        results: studentProjects
      });
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Admin: Get all projects (admins see all except drafts)
   * @param token - Admin authentication token
   * @returns Array of projects with pagination data
   */
  async getAllProjects(token: string): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Project[];
  }> {
    try {
      // Filter out draft projects for admin view
      const adminProjects = mockProjects.filter(p => p.status !== 'DRAFT');
      
      return Promise.resolve({
        count: adminProjects.length,
        next: null,
        previous: null,
        results: adminProjects
      });
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Admin: Update project status
   * @param projectId - Project ID to update
   * @param status - New status for the project
   * @param token - Admin authentication token
   * @param directedTo - Optional interface ID to direct the project to
   * @returns Updated project data
   */
  async updateProjectStatus(
    projectId: number, 
    status: 'processing' | 'directed' | 'rejected', 
    token: string,
    directedTo?: number
  ): Promise<Project> {
    try {
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        throw new Error('Project not found');
      }
      
      // Map the status to our mock status format
      let newStatus: string;
      switch (status) {
        case 'processing':
          newStatus = 'UNDER_REVIEW';
          break;
        case 'directed':
          newStatus = 'APPROVED';
          break;
        case 'rejected':
          newStatus = 'REJECTED';
          break;
        default:
          newStatus = status.toUpperCase();
      }
      
      // Update the project status
      const updatedProject = {
        ...mockProjects[projectIndex],
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      // Set the directed entity if provided
      if (status === 'directed' && directedTo) {
        switch (directedTo) {
          case 1:
            updatedProject.cati_id = 4001;
            break;
          case 2:
            updatedProject.cde_id = 3001;
            break;
          case 3:
            updatedProject.incubator_id = 2001;
            break;
        }
      }
      
      mockProjects[projectIndex] = updatedProject;
      
      return Promise.resolve(updatedProject);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Get projects directed to CDE
   * @param token - Authentication token
   * @returns Array of projects directed to CDE
   */
  async getCDEProjects(token: string): Promise<Project[]> {
    try {
      // Get projects for CDE with ID 3001
      return Promise.resolve(getProjectsByCDEId(3001));
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Get projects directed to CATI
   * @param token - Authentication token
   * @returns Array of projects directed to CATI
   */
  async getCATIProjects(token: string): Promise<Project[]> {
    try {
      // Get projects for CATI with ID 4001
      return Promise.resolve(getProjectsByCATIId(4001));
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Get projects directed to Incubator
   * @param token - Authentication token
   * @returns Array of projects directed to Incubator
   */
  async getIncubatorProjects(token: string): Promise<Project[]> {
    try {
      // Get projects for Incubator with ID 2001
      return Promise.resolve(getProjectsByIncubatorId(2001));
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Add feedback to a project
   * @param projectId - Project ID
   * @param feedback - Feedback content
   * @param token - Authentication token
   * @returns Updated project with new feedback
   */
  async addFeedback(projectId: number, feedback: string, token: string): Promise<Project> {
    try {
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        throw new Error('Project not found');
      }
      
      // Get user info from the token (in a real app)
      // For mock purposes, we'll use the current user role
      const currentRole = localStorage.getItem('current_role') || 'STUDENT';
      let userId: number;
      let userName: string;
      
      switch (currentRole) {
        case 'STUDENT':
          userId = 1001;
          userName = 'Student User';
          break;
        case 'INCUBATOR':
          userId = 2001;
          userName = 'Incubator Manager';
          break;
        case 'CDE':
          userId = 3001;
          userName = 'CDE Engineer';
          break;
        case 'CATI':
          userId = 4001;
          userName = 'CATI Manager';
          break;
        case 'ADMIN':
          userId = 5001;
          userName = 'Admin User';
          break;
        default:
          userId = 1001;
          userName = 'User';
      }
      
      // Create a new feedback entry
      const newFeedback = {
        id: Date.now(),
        content: feedback,
        created_at: new Date().toISOString(),
        user_id: userId,
        user_role: currentRole,
        user_name: userName
      };
      
      // Add the feedback to the project
      if (!mockProjects[projectIndex].feedback) {
        mockProjects[projectIndex].feedback = [];
      }
      
      mockProjects[projectIndex].feedback?.push(newFeedback);
      
      return Promise.resolve(mockProjects[projectIndex]);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Get statistics for admin dashboard
   * @param token - Authentication token
   * @returns Statistics data
   */
  async getStatistics(token: string): Promise<any> {
    try {
      // Return mock statistics
      return Promise.resolve(mockStatistics);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Export list of projects for record-keeping in Excel format
   * @param token - Authentication token
   * @returns Blob containing Excel data
   */
  async exportProjects(token: string): Promise<Blob> {
    try {
      // Create a mock blob that simulates an Excel file
      const mockExcelData = new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      return Promise.resolve(mockExcelData);
    } catch (error) {
      throw new Error(processApiError(error));
    }
  },

  /**
   * Upload training program and set dates
   * @param trainingProgramFile - Training program PDF file 
   * @param trainingDates - Description of training dates and times
   * @param token - Authentication token
   * @param interfaceId - Interface ID (1=CATI, 2=CDE, 3=Incubator)
   * @returns Success message
   */
  async uploadTrainingProgram(
    trainingProgramFile: File,
    trainingDates: string,
    token: string,
    interfaceId: number = 2 // Default to CDE (2) for backward compatibility
  ): Promise<{ message: string }> {
    try {
      // Mock successful upload
      return Promise.resolve({ message: "Training program uploaded successfully" });
    } catch (error) {
      throw new Error(processApiError(error));
    }
  }
}; 