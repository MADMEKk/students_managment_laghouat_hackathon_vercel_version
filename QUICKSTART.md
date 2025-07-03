# Quick Start Guide for Developers

This guide will help you get started with the Algeria Orientation Committee Platform development quickly.

## Prerequisites

Make sure you have the following installed:

- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **Git**: For version control
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Environment Configuration

If needed, you can configure the API endpoint by editing:

- Base URL in `app/services/projectService.ts`

## Project Structure Overview

Key directories to understand:

- `/app/components/`: Reusable UI components
- `/app/routes/`: Application pages and routes
- `/app/services/`: API integration services
- `/app/store/`: State management with Zustand
- `/app/types/`: TypeScript type definitions

## Authentication

The application uses token-based authentication:

1. Token is stored in localStorage
2. `useAuth` hook provides auth-related functions
3. Protected routes check authentication status

Example:

```typescript
import { useAuth } from '../store/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  // Use auth state and functions
}
```

## Roles and Permissions

The application supports multiple user roles:

- **STUDENT**: Project creation and team management
- **INCUBATOR**: Project review and incubation
- **CDE**: Community Development Engineer
- **CATI**: Center for Technology and Innovation
- **ADMIN**: System administration

Check user roles with:

```typescript
const { hasRole } = useAuth();

if (hasRole('STUDENT')) {
  // Student-specific functionality
}
```

## API Integration

All API calls are in the `projectService.ts` file:

```typescript
import { projectService } from '../services/projectService';

// Example usage
const fetchProjects = async () => {
  const token = '...'; // Get from auth store
  const projects = await projectService.getProjects(token);
  // Handle the response
};
```

## Core Application Flow

1. User authentication (login/signup)
2. Role-based redirection to dashboards
3. Project creation (students)
4. Project review workflow
5. Project direction to appropriate entities
6. Feedback and status updates

## Common Development Tasks

### Adding a New Component

1. Create a new file in `/app/components/`
2. Import and use in relevant routes
3. Add TypeScript types for props

### Adding a New Route

1. Create a new file in `/app/routes/`
2. Export a default React component
3. Update imports if necessary

### Adding a New API Service

1. Add the function to `/app/services/projectService.ts`
2. Add appropriate TypeScript types
3. Implement error handling

### Working with State

The application uses Zustand for state management:

```typescript
import { create } from 'zustand';

// Define state interface
interface MyState {
  data: string[];
  addItem: (item: string) => void;
}

// Create store
export const useMyStore = create<MyState>((set) => ({
  data: [],
  addItem: (item) => set((state) => ({ data: [...state.data, item] })),
}));

// Use in component
const { data, addItem } = useMyStore();
```

## Testing Your Changes

Currently, the project focuses on manual testing. When implementing new features:

1. Test across different roles
2. Verify responsive design on mobile and desktop
3. Check for console errors
4. Test error handling paths

## Getting Help

For more detailed documentation:

- Check the `DEVELOPER.md` file for in-depth technical details
- Refer to `README.md` for general project information
- See `USER_GUIDE.md` for understanding the user experience

## Common Issues and Solutions

### Authentication Issues

If facing login problems:
- Check browser storage
- Verify API endpoint configuration
- Ensure proper token handling

### State Management

If components don't update:
- Verify the store is updated correctly
- Check for circular dependencies
- Ensure hooks are used at component level

### API Connection Issues

If API calls fail:
- Verify network connectivity
- Check API endpoint URL
- Confirm proper token usage
- Inspect network requests in browser DevTools

---

Happy coding! If you have any questions, reach out to the project maintainers. 