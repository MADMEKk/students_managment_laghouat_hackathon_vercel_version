# Algeria Orientation Committee Platform

A full-stack React application for managing student projects, incubation, and orientation within the Algerian educational system.

## Overview

This platform provides a comprehensive system for students, incubators, Community Development Engineers (CDE), CATI (Center for Technology and Innovation), and administrators to manage project proposals, reviews, and the incubation process.

## Features

- 🔒 Role-based authentication (Student, Incubator, CDE, CATI, Admin)
- 📝 Student project submission and management
- 👥 Team member management 
- 📊 Project evaluation and routing
- 📋 Project status tracking and workflow
- 📤 Data export capabilities
- 🔄 Real-time dashboard updates

## Project Structure

### Core Technologies

- **Frontend**: React 19 with React Router 7
- **State Management**: Zustand for lightweight, action-based state
- **Styling**: TailwindCSS 4.0
- **UI Components**: Custom components with responsive design
- **Icons**: React Icons
- **Authentication**: Token-based auth with local storage persistence

### Directory Structure

```
project-root/
├── app/                        # Main application code
│   ├── components/             # Reusable UI components
│   ├── MultiStepForm/          # Forms with multiple steps
│   ├── routes/                 # Application routes
│   │   ├── auth/               # Authentication routes
│   │   │   ├── signin.tsx      # Sign in page
│   │   │   └── signup.tsx      # Sign up page
│   │   ├── home.tsx            # Home page with auth redirection
│   │   ├── cdedashboard.tsx    # CDE dashboard
│   │   ├── catidashboard.tsx   # CATI dashboard
│   │   ├── incubateurdashboard.tsx # Incubator dashboard
│   │   ├── studentdashboard.tsx # Student dashboard
│   │   └── admindashboard.tsx  # Admin dashboard
│   ├── services/               # API integration services
│   │   └── projectService.ts   # Project-related API functions
│   ├── store/                  # State management
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useAuth.ts      # Authentication hook
│   │   └── slices/             # State slices
│   │       └── auth.ts         # Authentication state
│   ├── types/                  # TypeScript type definitions
│   │   └── project.ts          # Project-related types
│   ├── utils/                  # Utility functions
│   ├── app.css                 # Global styles
│   ├── root.tsx                # Application root component
│   └── routes.ts               # Route definitions
├── public/                     # Static assets
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Role-Based Workflow

### Student
- Sign up with personal and academic details
- Create and manage project proposals
- Add team members to projects
- Submit projects for review
- Track project status

### Incubator
- Review projects directed to incubation
- Provide feedback on student projects
- Track incubation progress
- Export project data

### CDE (Community Development Engineer)
- Review projects directed to CDE
- Upload training programs
- Track project development
- Export project data

### CATI (Center for Technology and Innovation)
- Review projects directed to CATI
- Provide technical evaluation
- Track innovation projects
- Export project data

### Admin
- Manage all users and projects
- System configuration
- View statistics
- Full access to all platform features

## Authentication and Authorization

The platform implements a token-based authentication system:

1. User signs in with email and password
2. Backend validates credentials and returns a token
3. Token is stored in local storage for session persistence
4. Protected routes verify token and user role
5. Redirects to appropriate dashboard based on user role

## Project Workflow

1. **Draft**: Student creates project and team
2. **Submitted**: Project is submitted for review
3. **Under Review**: Initial evaluation by admin
4. **Directed**: Project is sent to appropriate entity (CATI, CDE, or Incubator)
5. **Processing**: Entity is working on the project
6. **Rejected**: Project rejected with feedback

## API Integration

The application communicates with a backend API located at `http://192.168.92.224:9000` with endpoints for:

- User authentication
- Project management
- Team member management
- File uploads
- Data export

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Docker Deployment

```bash
docker build -t orientation-platform .
docker run -p 3000:3000 orientation-platform
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

## License

This project is licensed under the MIT License
