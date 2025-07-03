import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Project } from '../types/project';

// Props interface for the ProjectForm component
interface ProjectFormProps {
  initialData?: Project | null;
  onSubmit: (title: string, description: string) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
}

/**
 * Form component for adding or editing project details
 * Handles input validation and form submission
 */
function ProjectForm({ initialData, onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  // If initial data is provided, populate form (for editing)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    }
  }, [initialData]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      description?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(title, description);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-500">
        {initialData ? 'Edit Project' : 'Create New Project'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Project Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium dark:text-gray-300 mb-1">
            Project Title*
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({...errors, title: undefined});
            }}
            className={`w-full rounded-md border ${
              errors.title ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
            } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
            placeholder="Enter project title"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-[#FF4D6D]">{errors.title}</p>
          )}
        </div>

        {/* Project Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium dark:text-gray-300 mb-1">
            Project Description*
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({...errors, description: undefined});
            }}
            rows={5}
            className={`w-full rounded-md border ${
              errors.description ? 'border-[#FF4D6D]' : 'border-gray-300 dark:border-gray-600'
            } px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D6D]`}
            placeholder="Describe your project in detail..."
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-[#FF4D6D]">{errors.description}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4D6D]"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
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
            ) : initialData ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm; 