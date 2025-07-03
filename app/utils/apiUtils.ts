/**
 * Helper functions for API requests and error handling
 */

/**
 * Process API error response to extract relevant error messages
 * @param error - Error object from API request
 * @returns Formatted error message
 */
export const processApiError = (error: any): string => {
  // Case: standard error message
  if (error?.message) {
    return error.message;
  }
  
  // Case: API returned error details
  if (error?.response?.data) {
    const responseData = error.response.data;
    
    // Handle object of error messages
    if (typeof responseData === 'object' && !Array.isArray(responseData)) {
      // Extract the first error message
      const firstErrorKey = Object.keys(responseData)[0];
      if (firstErrorKey && responseData[firstErrorKey]) {
        const errorValue = responseData[firstErrorKey];
        
        // Handle array of error messages
        if (Array.isArray(errorValue)) {
          return `${firstErrorKey}: ${errorValue[0]}`;
        }
        
        // Handle string error message
        if (typeof errorValue === 'string') {
          return `${firstErrorKey}: ${errorValue}`;
        }
      }
      
      // Fallback if we couldn't extract a specific message
      return 'Request failed with validation errors.';
    }
    
    // Handle string error message
    if (typeof responseData === 'string') {
      return responseData;
    }
  }
  
  // Default error message
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Format date string for form inputs
 * @param dateString - ISO date string
 * @returns Formatted date string (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
};

/**
 * Truncate text with ellipsis if it exceeds a certain length
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}; 