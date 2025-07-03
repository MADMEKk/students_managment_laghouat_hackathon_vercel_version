// Authentication store slice using Zustand
// This manages sign-in and sign-up related state

import { create } from 'zustand';

// User type definition matching the API response
export type User = {
  id: number;
  username?: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'STUDENT' | 'INCUBATOR' | 'CDE' | 'CATI' | 'ADMIN';
  token?: string;
  profile?: {
    student_id?: string;
    phone_number?: string;
    date_of_birth?: string;
    place_of_birth?: string;
    field?: string;
    speciality?: string;
  } | null;
}

// Dummy users for each role
const dummyUsers: Record<User['role'], User> = {
  'STUDENT': {
    id: 1001,
    username: 'student_user',
    email: 'student@example.com',
    first_name: 'Student',
    last_name: 'User',
    role: 'STUDENT',
    token: 'dummy_token_student',
    profile: {
      student_id: 'ST12345',
      phone_number: '0555123456',
      date_of_birth: '1998-05-15',
      place_of_birth: 'Algiers',
      field: 'Computer Science',
      speciality: 'Software Engineering'
    }
  },
  'INCUBATOR': {
    id: 2001,
    username: 'incubator_user',
    email: 'incubator@example.com',
    first_name: 'Incubator',
    last_name: 'Manager',
    role: 'INCUBATOR',
    token: 'dummy_token_incubator'
  },
  'CDE': {
    id: 3001,
    username: 'cde_user',
    email: 'cde@example.com',
    first_name: 'CDE',
    last_name: 'Engineer',
    role: 'CDE',
    token: 'dummy_token_cde'
  },
  'CATI': {
    id: 4001,
    username: 'cati_user',
    email: 'cati@example.com',
    first_name: 'CATI',
    last_name: 'Manager',
    role: 'CATI',
    token: 'dummy_token_cati'
  },
  'ADMIN': {
    id: 5001,
    username: 'admin_user',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    role: 'ADMIN',
    token: 'dummy_token_admin'
  }
};

// Define the interface for our authentication state
interface AuthState {
  // User authentication status
  isAuthenticated: boolean;
  
  // User data
  user: User | null;
  
  // Token for authenticated requests
  token: string | null;
  
  // Loading states for auth operations
  isLoading: boolean;
  
  // Error messages
  error: string | null;
  
  // Action to set the authenticated user
  setUser: (user: User | null, token: string | null) => void;
  
  // Action to initialize auth state from localStorage
  initAuth: () => void;
  
  // Action to handle sign in - updated return type to match implementation
  signIn: (email: string, password: string) => Promise<User>;
  
  // Action to handle sign out
  signOut: () => void;
  
  // Action to clear any errors
  clearError: () => void;
  
  // Action to switch between dummy users
  switchRole: (role: User['role']) => void;
}

// Create the auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state - ALWAYS AUTHENTICATED with STUDENT role by default
  isAuthenticated: true,
  user: dummyUsers.STUDENT,
  token: 'dummy_token_student',
  isLoading: false,
  error: null,
  
  // Initialize auth state - always set to authenticated with dummy user
  initAuth: () => {
    // Always set to authenticated with the current role or default to STUDENT
    const currentRole = localStorage.getItem('current_role') as User['role'] || 'STUDENT';
    const dummyUser = dummyUsers[currentRole] || dummyUsers.STUDENT;
    
    set({ 
      isAuthenticated: true, 
      user: dummyUser,
      token: dummyUser.token || 'dummy_token',
      error: null
    });
  },
  
  // Set the authenticated user
  setUser: (user, token) => {
    set({ 
      isAuthenticated: true, // Always authenticated
      user: user || dummyUsers.STUDENT, // Default to STUDENT if null
      token: token || 'dummy_token',
      error: null
    });
  },
  
  // Sign in implementation - always succeeds with dummy user
  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      // Determine which dummy user to use based on email
      let role: User['role'] = 'STUDENT';
      
      if (email.includes('admin')) {
        role = 'ADMIN';
      } else if (email.includes('incubator')) {
        role = 'INCUBATOR';
      } else if (email.includes('cde')) {
        role = 'CDE';
      } else if (email.includes('cati')) {
        role = 'CATI';
      }
      
      const dummyUser = dummyUsers[role];
      
      // Set user and token in store
      set({ 
        isAuthenticated: true, 
        user: dummyUser,
        token: dummyUser.token,
        isLoading: false,
        error: null
      });
      
      // Save to localStorage
      localStorage.setItem('current_role', role);
      
      return dummyUser;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to sign in' 
      });
      throw error;
    }
  },
  
  // Sign out implementation - still keeps user authenticated with STUDENT role
  signOut: () => {
    // Switch back to STUDENT role
    localStorage.setItem('current_role', 'STUDENT');
    
    set({ 
      isAuthenticated: true, 
      user: dummyUsers.STUDENT,
      token: dummyUsers.STUDENT.token,
      error: null
    });
  },
  
  // Clear error
  clearError: () => set({ error: null }),
  
  // Switch between dummy users
  switchRole: (role) => {
    const dummyUser = dummyUsers[role];
    localStorage.setItem('current_role', role);
    
    set({ 
      isAuthenticated: true, 
      user: dummyUser,
      token: dummyUser.token,
      error: null
    });
  }
})); 