# Developer Documentation - Algeria Orientation Committee Platform

This document provides detailed technical information for developers working on the Algeria Orientation Committee Platform.

## Architecture Overview

The application follows a modern React architecture with the following key characteristics:

- **Client-Side Routing**: Uses React Router 7 for routing and navigation
- **Component-Based Structure**: Modular UI components for reusability
- **State Management**: Zustand for lightweight, flexible state handling
- **Type Safety**: TypeScript throughout for improved developer experience
- **API Integration**: Service layer for API communication
- **Authentication**: Token-based auth with role-based access control
- **Responsive Design**: Mobile-first approach with TailwindCSS

## Key Components

### Authentication System

Located in `/app/store/slices/auth.ts` and `/app/store/hooks/useAuth.ts`, the authentication system:

- Manages login/logout flows
- Stores user data and token in localStorage
- Provides role-based access control
- Handles redirection based on user roles
- Manages authentication state through Zustand

```typescript
// Example auth hook usage
const { isAuthenticated, user, login, logout } = useAuth();

// Role-based access control
if (hasRole('STUDENT')) {
  // Student-specific UI
}
```

### Dashboard Components

Each role has a dedicated dashboard (`cdedashboard.tsx`, `studentdashboard.tsx`, etc.) with:

- Role-specific functionality
- Data fetching from the API
- State management for UI interaction
- Responsive layouts for different devices
- Export capabilities for data analysis

### Project Service

The `/app/services/projectService.ts` handles all API communication for projects:

- CRUD operations for projects and team members
- Status updates and workflow transitions
- Data exports and report generation
- File uploads for documentation
- Error handling and response parsing

```typescript
// Example service usage
const projects = await projectService.getProjects(token);
const exportData = await projectService.exportProjects(token);
```

### Home Page Redirection

The home page (`/app/routes/home.tsx`) implements smart redirection:

- Checks authentication status
- Redirects to appropriate dashboard based on user role
- Redirects to sign-in for unauthenticated users
- Provides visual feedback during redirects

```typescript
// Redirection logic
useEffect(() => {
  if (isAuthenticated && user) {
    redirectToDashboard(user);
  } else {
    navigate('/auth/signin');
  }
}, [isAuthenticated, user, navigate, redirectToDashboard]);
```

## Type System

The application uses TypeScript types for better code organization and safety:

### Project Types

Defined in `/app/types/project.ts`:

```typescript
export type ProjectStatus = 
  'draft' | 'submitted' | 'under_review' | 
  'sent' | 'processing' | 'directed' | 'rejected';

export type Project = {
  id: number;
  title: string;
  description: string;
  representative: number;
  // ... other properties
  status: ProjectStatus;
  team_members: TeamMember[];
};
```

### User Types

Defined in `/app/store/slices/auth.ts`:

```typescript
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
    // ... other profile properties
  } | null;
}
```

## API Integration

The application communicates with a backend API at `http://192.168.92.224:9000`:

### Authentication Endpoints

- `POST /api/login/`: User login
- `POST /api/signup/`: User registration

### Project Endpoints

- `GET /api/projects/`: List projects
- `POST /api/projects/`: Create project
- `GET /api/projects/:id/`: Get project details
- `PUT /api/projects/:id/`: Update project
- `POST /api/projects/:id/submit/`: Submit project for review
- `GET /api/projects/:id/team-members/`: Get team members
- `POST /api/projects/:id/team-members/`: Add team member
- `PUT /api/projects/:id/team-members/:memberId/`: Update team member
- `DELETE /api/projects/:id/team-members/:memberId/`: Remove team member

### Admin Endpoints

- `GET /api/admin/projects/`: Get all projects
- `PUT /api/admin/projects/:id/status/`: Update project status
- `GET /api/admin/export/`: Export projects data

## State Management Strategy

The application uses Zustand for state management with the following patterns:

1. **Store Slices**: Modular state organization
2. **Custom Hooks**: Encapsulate store access
3. **Cached Data**: Time-based cache for performance
4. **Optimistic Updates**: Update UI before API confirmation

Example Zustand store structure:

```typescript
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  
  // Actions
  signIn: async (email, password) => {
    // Implementation
  },
  signOut: () => {
    // Implementation
  }
}));
```

## Component Design Patterns

The application uses several React patterns:

1. **Custom Hooks**: Encapsulate complex logic
2. **Compound Components**: Build complex UIs
3. **Container/Presentation**: Separate logic from UI
4. **Render Props**: For flexible component composition
5. **Error Boundaries**: Graceful error handling

## Error Handling

The application implements comprehensive error handling:

- **API Errors**: Processed through `processApiError` util
- **UI Feedback**: Clear user messaging on errors
- **Retries**: For transient network issues
- **Fallbacks**: Graceful degradation on failure
- **Logging**: Console errors for debugging

## Testing Strategy

For adding tests, consider these approaches:

1. **Component Tests**: Test UI components with React Testing Library
2. **Hook Tests**: Test custom hooks with renderHook
3. **Service Tests**: Mock API calls for service testing
4. **Integration Tests**: End-to-end flows with testing user journeys
5. **Snapshot Tests**: For UI regression testing

## Optimization Techniques

The application implements several performance optimizations:

1. **Data Caching**: Time-based cache for API responses
2. **Memoization**: React.memo and useCallback to prevent rerenders
3. **Code Splitting**: Lazy loading for routes
4. **Virtualization**: For handling large lists efficiently
5. **Bundle Optimization**: Minimal dependencies

## Code Style and Standards

Follow these guidelines when contributing:

1. **TypeScript**: Use strict type checking
2. **ESLint**: Follow the project's linting rules
3. **Comments**: Document complex logic and component props
4. **Naming**: Use descriptive, consistent naming
5. **File Structure**: Group related files in directories
6. **CSS**: Use TailwindCSS utility classes

## Common Workflows

### Adding a New Feature

1. Create any necessary types in the appropriate type file
2. Add API methods to the relevant service
3. Create UI components in the components directory
4. Add state management if needed
5. Integrate with routing as appropriate
6. Test and verify the feature

### Debugging Tips

1. Use React DevTools for component inspection
2. Check browser console for errors
3. Verify network requests in the Network tab
4. Add temporary console logs for state tracking
5. Verify authentication state and tokens
6. Check for type issues with TypeScript

## Environment Configuration

The application supports these environments:

- **Development**: Local API or test backend
- **Production**: Production API endpoints
- **Testing**: Mock API for automated tests

## Deployment Process

1. Run the build command: `npm run build`
2. Verify the build output
3. Deploy using Docker or direct deployment
4. Verify the deployment with smoke tests
5. Monitor for any post-deployment issues

## Contribution Guidelines

1. Follow the code style guide
2. Write clear commit messages
3. Add appropriate comments
4. Update documentation for significant changes
5. Create focused pull requests
6. Add necessary tests

---

For additional questions or support, contact the project maintainers. 