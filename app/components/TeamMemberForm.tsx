import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { NewTeamMemberData, TeamMember } from '../types/project';
import { formatDateForInput } from '../utils/apiUtils';

// Props interface for the TeamMemberForm component
interface TeamMemberFormProps {
  initialData?: TeamMember | null;
  onSubmit: (data: NewTeamMemberData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

/**
 * Form component for adding or editing team members
 * Handles input validation and form submission
 */
function TeamMemberForm({ initialData, onSubmit, onCancel, isSubmitting }: TeamMemberFormProps) {
  // Form state
  const [formData, setFormData] = useState<NewTeamMemberData>({
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    student_id: '',
    date_of_birth: '',
    place_of_birth: '',
    field: '',
    speciality: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If initial data is provided, populate form (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        phone_number: initialData.phone_number,
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        student_id: initialData.student_id,
        date_of_birth: formatDateForInput(initialData.date_of_birth),
        place_of_birth: initialData.place_of_birth,
        field: initialData.field,
        speciality: initialData.speciality,
      });
    }
  }, [initialData]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation (Algerian format)
    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^0[567][0-9]{8}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be in format 05/6/7XXXXXXXX';
    }
    
    // Name validation
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    
    // Student ID validation
    if (!formData.student_id) newErrors.student_id = 'Student ID is required';
    
    // Date of birth validation
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }
    
    // Place of birth validation
    if (!formData.place_of_birth) newErrors.place_of_birth = 'Place of birth is required';
    
    // Field and speciality validation
    if (!formData.field) newErrors.field = 'Field is required';
    if (!formData.speciality) newErrors.speciality = 'Speciality is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-500">
        {initialData ? 'Edit Team Member' : 'Add Team Member'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium dark:text-gray-300 mb-1">
              First Name*
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.first_name ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
              disabled={isSubmitting}
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-[#FF4D6D]">{errors.first_name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium dark:text-gray-300 mb-1">
              Last Name*
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.last_name ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
              disabled={isSubmitting}
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-[#FF4D6D]">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium dark:text-gray-300 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.email ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-[#FF4D6D]">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium dark:text-gray-300 mb-1">
              Phone Number*
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="05/6/7XXXXXXXX"
              className={`w-full rounded-md border ${
                errors.phone_number ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
              disabled={isSubmitting}
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-[#FF4D6D]">{errors.phone_number}</p>
            )}
          </div>
        </div>

        {/* Student Information */}
        <div>
          <label htmlFor="student_id" className="block text-sm font-medium dark:text-gray-300 mb-1">
            Student ID*
          </label>
          <input
            type="text"
            id="student_id"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              errors.student_id ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
            } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
            disabled={isSubmitting}
          />
          {errors.student_id && (
            <p className="mt-1 text-sm text-[#FF4D6D]">{errors.student_id}</p>
          )}
        </div>
        
        {/* Birth Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium dark:text-gray-300 mb-1">
              Date of Birth*
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.date_of_birth ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
              disabled={isSubmitting}
            />
            {errors.date_of_birth && (
              <p className="mt-1 text-sm text-[#FF4D6D]">{errors.date_of_birth}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="place_of_birth" className="block text-sm font-medium dark:text-gray-300 mb-1">
              Place of Birth*
            </label>
            <input
              type="text"
              id="place_of_birth"
              name="place_of_birth"
              value={formData.place_of_birth}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.place_of_birth ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
              disabled={isSubmitting}
            />
            {errors.place_of_birth && (
              <p className="mt-1 text-sm text-[#FF4D6D]">{errors.place_of_birth}</p>
            )}
          </div>
        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field" className="block text-sm font-medium dark:text-gray-300 mb-1">
              Field*
            </label>
            <input
              type="text"
              id="field"
              name="field"
              value={formData.field}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.field ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
              disabled={isSubmitting}
            />
            {errors.field && (
              <p className="mt-1 text-sm text-[#FF4D6D]">{errors.field}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="speciality" className="block text-sm font-medium dark:text-gray-300 mb-1">
              Speciality*
            </label>
            <input
              type="text"
              id="speciality"
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.speciality ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
              disabled={isSubmitting}
            />
            {errors.speciality && (
              <p className="mt-1 text-sm text-[#FF4D6D]">{errors.speciality}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D6D]"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF4D6D] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D6D] disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : initialData ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TeamMemberForm; 