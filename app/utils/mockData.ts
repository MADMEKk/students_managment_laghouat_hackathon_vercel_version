/**
 * Mock data for the application
 * This file provides dummy data for screenshots and testing
 */

// Import the actual project types to ensure compatibility
import type { Project, ProjectStatus, TeamMember } from '../types/project';

// Extended Project type with our custom properties for mock data
interface ExtendedProject extends Project {
  category?: string;
  domain?: string;
  technologies?: string[];
  incubator_id?: number;
  cde_id?: number;
  cati_id?: number;
  feedback?: Feedback[];
}

// Feedback type for mock data
export interface Feedback {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  user_role: string;
  user_name: string;
}

// Generate mock projects
export const mockProjects: ExtendedProject[] = [
  {
    id: 1,
    title: "Smart Agriculture IoT System",
    description: "A system that uses IoT sensors to monitor soil moisture, temperature, and other environmental factors to optimize crop growth and water usage.",
    status: "draft" as ProjectStatus,
    created_at: "2023-10-15T14:30:00Z",
    updated_at: "2023-10-18T09:45:00Z",
    representative: 1001,
    representative_username: "student_user",
    representative_info: {
      id: 1001,
      username: "student_user",
      email: "student@example.com",
      first_name: "Student",
      last_name: "User",
      role: "STUDENT"
    },
    directed_to: null,
    team_members: [
      {
        id: 101,
        user_id: 1001,
        username: "student_user",
        email: "ahmed.benali@example.com",
        phone_number: "0555123456",
        first_name: "Ahmed",
        last_name: "Benali",
        student_id: "ST12345",
        date_of_birth: "1998-05-15",
        place_of_birth: "Algiers",
        field: "Computer Science",
        speciality: "Software Engineering",
        is_representative: true
      },
      {
        id: 102,
        user_id: 1002,
        username: "fatima_z",
        email: "fatima.z@example.com",
        phone_number: "0555123457",
        first_name: "Fatima",
        last_name: "Zahra",
        student_id: "ST12346",
        date_of_birth: "1999-03-20",
        place_of_birth: "Oran",
        field: "Computer Science",
        speciality: "Data Science",
        is_representative: false
      }
    ],
    team_size: 2,
    // Custom properties for mock data
    category: "Agriculture",
    domain: "IoT",
    technologies: ["Arduino", "Raspberry Pi", "Node.js", "React"],
    feedback: [
      {
        id: 201,
        content: "Interesting project with good potential. Consider adding more details about the sensor calibration process.",
        created_at: "2023-10-16T10:20:00Z",
        user_id: 3001,
        user_role: "CDE",
        user_name: "CDE Engineer"
      }
    ]
  },
  {
    id: 2,
    title: "Renewable Energy Monitoring Platform",
    description: "A platform to monitor and analyze the performance of solar panels and wind turbines in real-time, helping users optimize their renewable energy systems.",
    status: "directed" as ProjectStatus,
    created_at: "2023-09-20T11:15:00Z",
    updated_at: "2023-10-05T16:30:00Z",
    representative: 1002,
    representative_username: "karim_h",
    representative_info: {
      id: 1002,
      username: "karim_h",
      email: "karim.h@example.com",
      first_name: "Karim",
      last_name: "Hadj",
      role: "STUDENT"
    },
    directed_to: "INCUBATOR",
    team_members: [
      {
        id: 103,
        user_id: 1002,
        username: "karim_h",
        email: "karim.h@example.com",
        phone_number: "0555123458",
        first_name: "Karim",
        last_name: "Hadj",
        student_id: "ST12347",
        date_of_birth: "1997-07-10",
        place_of_birth: "Constantine",
        field: "Electrical Engineering",
        speciality: "Renewable Energy",
        is_representative: true
      },
      {
        id: 104,
        user_id: 1003,
        username: "amina_b",
        email: "amina.b@example.com",
        phone_number: "0555123459",
        first_name: "Amina",
        last_name: "Berrada",
        student_id: "ST12348",
        date_of_birth: "1998-11-25",
        place_of_birth: "Annaba",
        field: "Computer Science",
        speciality: "Data Analysis",
        is_representative: false
      }
    ],
    team_size: 2,
    // Custom properties for mock data
    category: "Energy",
    domain: "Renewable Energy",
    technologies: ["Python", "TensorFlow", "React", "AWS"],
    incubator_id: 2001,
    feedback: [
      {
        id: 202,
        content: "Excellent project with clear market potential. The team has a solid understanding of renewable energy challenges.",
        created_at: "2023-09-25T14:10:00Z",
        user_id: 3001,
        user_role: "CDE",
        user_name: "CDE Engineer"
      },
      {
        id: 203,
        content: "Approved for incubation. Please schedule a meeting to discuss next steps and resource allocation.",
        created_at: "2023-10-05T16:25:00Z",
        user_id: 2001,
        user_role: "INCUBATOR",
        user_name: "Incubator Manager"
      }
    ]
  },
  {
    id: 3,
    title: "Medical Appointment Scheduling App",
    description: "A mobile application that allows patients to schedule appointments with doctors, receive reminders, and manage their medical records securely.",
    status: "processing" as ProjectStatus,
    created_at: "2023-10-10T09:00:00Z",
    updated_at: "2023-10-12T11:20:00Z",
    representative: 1004,
    representative_username: "youssef_m",
    representative_info: {
      id: 1004,
      username: "youssef_m",
      email: "youssef.m@example.com",
      first_name: "Youssef",
      last_name: "Mansouri",
      role: "STUDENT"
    },
    directed_to: "CDE",
    team_members: [
      {
        id: 105,
        user_id: 1004,
        username: "youssef_m",
        email: "youssef.m@example.com",
        phone_number: "0555123460",
        first_name: "Youssef",
        last_name: "Mansouri",
        student_id: "ST12349",
        date_of_birth: "1996-04-18",
        place_of_birth: "Algiers",
        field: "Computer Science",
        speciality: "Mobile Development",
        is_representative: true
      },
      {
        id: 106,
        user_id: 1005,
        username: "leila_b",
        email: "leila.b@example.com",
        phone_number: "0555123461",
        first_name: "Leila",
        last_name: "Bouaziz",
        student_id: "ST12350",
        date_of_birth: "1997-09-30",
        place_of_birth: "Blida",
        field: "Design",
        speciality: "UI/UX Design",
        is_representative: false
      }
    ],
    team_size: 2,
    // Custom properties for mock data
    category: "Healthcare",
    domain: "Mobile Apps",
    technologies: ["Flutter", "Firebase", "Node.js", "MongoDB"],
    cde_id: 3001,
    feedback: []
  },
  {
    id: 4,
    title: "E-Learning Platform for STEM Education",
    description: "An interactive e-learning platform focused on STEM subjects for high school students, featuring virtual labs, quizzes, and personalized learning paths.",
    status: "directed" as ProjectStatus,
    created_at: "2023-08-05T13:45:00Z",
    updated_at: "2023-10-15T10:30:00Z",
    representative: 1006,
    representative_username: "omar_t",
    representative_info: {
      id: 1006,
      username: "omar_t",
      email: "omar.t@example.com",
      first_name: "Omar",
      last_name: "Tazi",
      role: "STUDENT"
    },
    directed_to: "CATI",
    team_members: [
      {
        id: 107,
        user_id: 1006,
        username: "omar_t",
        email: "omar.t@example.com",
        phone_number: "0555123462",
        first_name: "Omar",
        last_name: "Tazi",
        student_id: "ST12351",
        date_of_birth: "1998-01-22",
        place_of_birth: "Setif",
        field: "Computer Science",
        speciality: "Web Development",
        is_representative: true
      },
      {
        id: 108,
        user_id: 1007,
        username: "nadia_a",
        email: "nadia.a@example.com",
        phone_number: "0555123463",
        first_name: "Nadia",
        last_name: "Alami",
        student_id: "ST12352",
        date_of_birth: "1999-06-15",
        place_of_birth: "Tlemcen",
        field: "Education",
        speciality: "STEM Education",
        is_representative: false
      }
    ],
    team_size: 2,
    // Custom properties for mock data
    category: "Education",
    domain: "EdTech",
    technologies: ["React", "Django", "PostgreSQL", "Three.js"],
    incubator_id: 2001,
    cati_id: 4001,
    feedback: [
      {
        id: 204,
        content: "Project shows great promise. The team has made significant progress on the virtual lab components.",
        created_at: "2023-09-10T15:40:00Z",
        user_id: 2001,
        user_role: "INCUBATOR",
        user_name: "Incubator Manager"
      },
      {
        id: 205,
        content: "CATI will provide technical support for the 3D modeling aspects of the virtual labs.",
        created_at: "2023-10-01T11:15:00Z",
        user_id: 4001,
        user_role: "CATI",
        user_name: "CATI Manager"
      }
    ]
  },
  {
    id: 5,
    title: "Waste Management Tracking System",
    description: "A system that uses QR codes and mobile apps to track waste collection, sorting, and recycling processes, helping municipalities improve their waste management efficiency.",
    status: "draft" as ProjectStatus,
    created_at: "2023-10-19T08:20:00Z",
    updated_at: "2023-10-19T08:20:00Z",
    representative: 1001,
    representative_username: "student_user",
    representative_info: {
      id: 1001,
      username: "student_user",
      email: "student@example.com",
      first_name: "Student",
      last_name: "User",
      role: "STUDENT"
    },
    directed_to: null,
    team_members: [
      {
        id: 101,
        user_id: 1001,
        username: "student_user",
        email: "ahmed.benali@example.com",
        phone_number: "0555123456",
        first_name: "Ahmed",
        last_name: "Benali",
        student_id: "ST12345",
        date_of_birth: "1998-05-15",
        place_of_birth: "Algiers",
        field: "Computer Science",
        speciality: "Software Engineering",
        is_representative: true
      }
    ],
    team_size: 1,
    // Custom properties for mock data
    category: "Environment",
    domain: "Waste Management",
    technologies: ["React Native", "Node.js", "MongoDB", "QR Code"],
    feedback: []
  },
  {
    id: 6,
    title: "AI-Powered Language Learning Assistant",
    description: "An AI-powered application that helps users learn foreign languages through personalized exercises, real-time pronunciation feedback, and adaptive learning paths.",
    status: "rejected" as ProjectStatus,
    created_at: "2023-09-01T10:10:00Z",
    updated_at: "2023-09-15T14:50:00Z",
    representative: 1008,
    representative_username: "samir_k",
    representative_info: {
      id: 1008,
      username: "samir_k",
      email: "samir.k@example.com",
      first_name: "Samir",
      last_name: "Khalil",
      role: "STUDENT"
    },
    directed_to: null,
    team_members: [
      {
        id: 109,
        user_id: 1008,
        username: "samir_k",
        email: "samir.k@example.com",
        phone_number: "0555123464",
        first_name: "Samir",
        last_name: "Khalil",
        student_id: "ST12353",
        date_of_birth: "1997-11-05",
        place_of_birth: "Batna",
        field: "Computer Science",
        speciality: "Artificial Intelligence",
        is_representative: true
      },
      {
        id: 110,
        user_id: 1009,
        username: "yasmine_b",
        email: "yasmine.b@example.com",
        phone_number: "0555123465",
        first_name: "Yasmine",
        last_name: "Benkaddour",
        student_id: "ST12354",
        date_of_birth: "1998-08-12",
        place_of_birth: "Oran",
        field: "Computer Science",
        speciality: "Machine Learning",
        is_representative: false
      }
    ],
    team_size: 2,
    // Custom properties for mock data
    category: "Education",
    domain: "Language Learning",
    technologies: ["Python", "TensorFlow", "React Native", "AWS"],
    feedback: [
      {
        id: 206,
        content: "While the concept is interesting, the project lacks originality and there are already many similar solutions on the market. Consider pivoting to a more unique approach or target audience.",
        created_at: "2023-09-15T14:45:00Z",
        user_id: 3001,
        user_role: "CDE",
        user_name: "CDE Engineer"
      }
    ]
  }
];

// Generate mock statistics for admin dashboard
export const mockStatistics = {
  totalProjects: 42,
  activeProjects: 28,
  completedProjects: 14,
  totalStudents: 156,
  projectsByStatus: {
    draft: 8,
    submitted: 12,
    under_review: 6,
    directed: 10,
    rejected: 4,
    processing: 8,
    sent: 14
  },
  projectsByDomain: {
    'IoT': 10,
    'Mobile Apps': 8,
    'Web Applications': 7,
    'AI/ML': 6,
    'EdTech': 5,
    'Healthcare': 4,
    'Other': 2
  },
  projectsByMonth: {
    'Jan': 2,
    'Feb': 3,
    'Mar': 4,
    'Apr': 5,
    'May': 3,
    'Jun': 4,
    'Jul': 2,
    'Aug': 5,
    'Sep': 6,
    'Oct': 8,
    'Nov': 0,
    'Dec': 0
  }
};

// Mock notifications
export const mockNotifications = [
  {
    id: 1,
    title: "Project Approved",
    message: "Your project 'Renewable Energy Monitoring Platform' has been approved for incubation.",
    date: "2023-10-05T16:30:00Z",
    read: false
  },
  {
    id: 2,
    title: "New Feedback",
    message: "You have received new feedback on your project 'Smart Agriculture IoT System'.",
    date: "2023-10-16T10:25:00Z",
    read: true
  },
  {
    id: 3,
    title: "Meeting Scheduled",
    message: "A meeting has been scheduled with the incubator team on October 25, 2023 at 14:00.",
    date: "2023-10-18T09:15:00Z",
    read: false
  }
];

// Export a function to get projects filtered by status
export const getProjectsByStatus = (status: ProjectStatus): Project[] => {
  return mockProjects.filter(project => project.status === status);
};

// Export a function to get projects by student ID (representative)
export const getProjectsByStudentId = (studentId: number): Project[] => {
  return mockProjects.filter(project => project.representative === studentId);
};

// Export a function to get projects by incubator ID
export const getProjectsByIncubatorId = (incubatorId: number): Project[] => {
  return mockProjects.filter(project => 
    project.directed_to === 'INCUBATOR' || 
    project.incubator_id === incubatorId
  );
};

// Export a function to get projects by CDE ID
export const getProjectsByCDEId = (cdeId: number): Project[] => {
  return mockProjects.filter(project => 
    project.directed_to === 'CDE' || 
    project.cde_id === cdeId
  );
};

// Export a function to get projects by CATI ID
export const getProjectsByCATIId = (catiId: number): Project[] => {
  return mockProjects.filter(project => 
    project.directed_to === 'CATI' || 
    project.cati_id === catiId
  );
};

// Export a function to get a project by ID
export const getProjectById = (projectId: number): Project | undefined => {
  return mockProjects.find(project => project.id === projectId);
}; 