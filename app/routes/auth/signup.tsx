import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaBook, FaGraduationCap } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Define the roles for the signup process
const ROLES = {
  STUDENT: 'STUDENT',
  INCUBATOR: 'INCUBATOR',
  CDE: 'CDE',
  CATI: 'CATI'
};

// Define role display names
const ROLE_NAMES = {
  [ROLES.STUDENT]: 'Representative Student',
  [ROLES.INCUBATOR]: 'The Incubator Manager',
  [ROLES.CDE]: 'The CDE Manager',
  [ROLES.CATI]: 'The CATI Manager'
};

// Define API response type
interface SignupResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  profile: {
    student_id?: string;
    phone_number?: string;
    date_of_birth?: string;
    place_of_birth?: string;
    field?: string;
    speciality?: string;
  } | null;
  token: string;
}

// Define form data type
interface FormData {
  // Common fields for all roles
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  role: string;
  
  // Student-specific fields
  student_id?: string;
  phone_number?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  field?: string;
  speciality?: string;
}

function Signup() {
  // Navigation hook
  const navigate = useNavigate();
  
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    role: ROLES.STUDENT,
    student_id: '',
    phone_number: '',
    date_of_birth: '',
    place_of_birth: '',
    field: '',
    speciality: ''
  });

  // Define steps based on the selected role
  const getSteps = () => {
    // Common steps for all roles
    const steps = [
      { id: 1, name: 'Account Type' },
      { id: 2, name: 'Account Information' },
    ];

    // Add additional steps for students
    if (selectedRole === ROLES.STUDENT) {
      steps.push(
        { id: 3, name: 'Personal Information' },
        { id: 4, name: 'Academic Information' }
      );
    }

    return steps;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle role selection
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      role: role
    }));
    
    // Reset step to 1 when changing roles
    setCurrentStep(1);
  };

  // Handle next step
  const handleNext = () => {
    const steps = getSteps();
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Prepare request data based on role
      const requestData: FormData = {
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role
      };
      
      // Add student-specific fields if role is STUDENT
      if (formData.role === ROLES.STUDENT) {
        requestData.student_id = formData.student_id;
        requestData.phone_number = formData.phone_number;
        requestData.date_of_birth = formData.date_of_birth;
        requestData.place_of_birth = formData.place_of_birth;
        requestData.field = formData.field;
        requestData.speciality = formData.speciality;
      }
      
      // Make API request to signup endpoint
      const response = await fetch('http://192.168.92.224:9000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      // Handle non-successful responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = 'An error occurred during signup';
        
        // Extract error messages if available
        if (errorData.email) errorMessage = `Email: ${errorData.email}`;
        else if (errorData.password) errorMessage = `Password: ${errorData.password}`;
        else if (errorData.non_field_errors) errorMessage = errorData.non_field_errors;
        else if (errorData.detail) errorMessage = errorData.detail;
        
        throw new Error(errorMessage);
      }
      
      // Parse successful response
      const userData: SignupResponse = await response.json();
      
      // Store user data and token in localStorage
      localStorage.setItem('auth_token', userData.token);
      localStorage.setItem('user_data', JSON.stringify({
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        profile: userData.profile
      }));
      
      // Show success message
      console.log('Signup successful:', userData);
      
      // Navigate to the appropriate dashboard based on user role
      const dashboardRoutes = {
        [ROLES.STUDENT]: '/studentdashboard',
        [ROLES.INCUBATOR]: '/incubateurdashboard',
        [ROLES.CDE]: '/cdedashboard',
        [ROLES.CATI]: '/catidashboard'
      };
      
      // Navigate to the appropriate dashboard
      navigate(dashboardRoutes[userData.role] || '/');
      
    } catch (err) {
      // Handle errors
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render form step based on current step and selected role
  const renderStep = () => {
    switch (currentStep) {
      case 1: // Account Type Step
        return (
          <div className="space-y-6">
            <div className="text-gray-500 mb-4">Select your account type to continue</div>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <select
                name="role"
                value={selectedRole}
                onChange={handleRoleChange}
                className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
              >
                {Object.entries(ROLE_NAMES).map(([role, displayName]) => (
                  <option key={role} value={role}>
                    {displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      
      case 2: // Account Information Step
        return (
          <div className="space-y-6">
            <div className="text-gray-500 mb-4">Enter your account credentials</div>
            
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaEnvelope className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="Email address"
                  required
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="Password"
                  required
                />
              </div>
            </div>
            
            {/* Confirm Password */}
            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="password"
                  name="password_confirmation"
                  id="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            
            {/* First Name */}
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                First Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="First name"
                  required
                />
              </div>
            </div>
            
            {/* Last Name */}
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Last Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
          </div>
        );
      
      case 3: // Personal Information (Student Only)
        return (
          <div className="space-y-6">
            <div className="text-gray-500 mb-4">Enter your personal information</div>
            
            {/* Student ID */}
            <div>
              <label
                htmlFor="student_id"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Student ID
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaIdCard className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="student_id"
                  id="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="Student ID (e.g., ST12345)"
                  required
                />
              </div>
            </div>
            
            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Phone Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaPhone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="Phone number (e.g., 0561234567)"
                  required
                />
              </div>
            </div>
            
            {/* Date of Birth */}
            <div>
              <label
                htmlFor="date_of_birth"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Date of Birth
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  required
                />
              </div>
            </div>
            
            {/* Place of Birth */}
            <div>
              <label
                htmlFor="place_of_birth"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Place of Birth
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="place_of_birth"
                  id="place_of_birth"
                  value={formData.place_of_birth}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="Place of birth (e.g., Algiers)"
                  required
                />
              </div>
            </div>
          </div>
        );
      
      case 4: // Academic Information (Student Only)
        return (
          <div className="space-y-6">
            <div className="text-gray-500 mb-4">Enter your academic information</div>
            
            {/* Field of Study */}
            <div>
              <label
                htmlFor="field"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Field of Study
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaBook className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="field"
                  id="field"
                  value={formData.field}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="Field of study (e.g., Computer Science)"
                  required
                />
              </div>
            </div>
            
            {/* Speciality */}
            <div>
              <label
                htmlFor="speciality"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Speciality
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaGraduationCap className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="speciality"
                  id="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-700 py-2 pl-10 pr-3 text-gray-500 bg-gray-800 placeholder:text-gray-500 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="Speciality (e.g., Software Engineering)"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Get steps based on selected role
  const steps = getSteps();
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 p-4 font-sans">
      <div className="flex flex-1">
        {/* Left sidebar with steps */}
        <div className="hidden lg:block w-64 bg-gray-900 p-8 rounded-l-xl">
          <div className="mb-8">
            <img
              src="/images/logo.svg"
              alt="Logo"
              className="h-12 w-auto"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/200x60/cccccc/ffffff?text=Logo+Error';
              }}
            />
          </div>
          <div className="space-y-6">
            <div className="text-lg font-medium mb-4 text-gray-500">Step {currentStep}</div>
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center relative">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-white
                  ${currentStep === step.id ? 'bg-[#FF4D6D]' : 'bg-gray-600'}
                  ${currentStep > step.id ? 'bg-green-500' : ''}
                `}>
                  {step.id}
                </div>
                <span className={`ml-4 text-sm ${currentStep === step.id ? 'text-gray-500' : 'text-gray-400'}`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`absolute left-4 top-8 w-0.5 h-12 -ml-0.5
                    ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-600'}`} 
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-gray-900 lg:rounded-r-xl rounded-xl lg:rounded-l-none shadow-lg">
          <div className="p-8">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 flex justify-center">
              <img
                src="/images/logo.svg"
                alt="Logo"
                className="h-12 w-auto"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://placehold.co/200x60/cccccc/ffffff?text=Logo+Error';
                }}
              />
            </div>
            
            {/* Mobile step indicator */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-md">
                <span className="text-sm text-gray-500">Step {currentStep} of {steps.length}</span>
                <span className="text-sm font-medium text-gray-500">{steps[currentStep - 1].name}</span>
              </div>
            </div>
            
            <header className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-500">
                Create your account
              </h1>
              <p className="text-gray-400 mt-1">
                {selectedRole === ROLES.STUDENT
                  ? "Register as a Representative Student"
                  : `Register as ${ROLE_NAMES[selectedRole]}`}
              </p>
            </header>

            {/* Error messages */}
            {error && (
              <div
                className="bg-opacity-30 bg-[#FF4D6D] border border-[#FF4D6D] text-[#FF4D6D] px-4 py-3 rounded-md relative mb-6"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Form content */}
            <form onSubmit={handleSubmit}>
              {renderStep()}
              
              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2.5 bg-gray-700 text-gray-500 rounded-md hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition duration-150 ease-in-out"
                    disabled={isLoading}
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-[#FF4D6D] text-white rounded-md hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4D6D] transition duration-150 ease-in-out"
                    disabled={isLoading}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#FF4D6D] text-white rounded-md hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4D6D] transition duration-150 ease-in-out"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                )}
              </div>
            </form>
            
            {/* Sign in link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <a
                  href="/auth/signin"
                  className="font-medium text-[#FF4D6D] hover:text-opacity-90"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Footer */}
      <div className="mt-10 text-center text-xs text-gray-400">
        Copyright © {new Date().getFullYear()}
        <a href="https://www.mesrs.dz/" className="font-medium text-gray-300 hover:text-gray-500 ml-1" target="_blank" rel="noopener noreferrer">
          Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
        </a>
        <br />
        Tous droits réservés.
      </div>
    </div>
  );
}

export default Signup;