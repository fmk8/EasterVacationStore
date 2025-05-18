/**
 * Error handling service for consistent error management across the application
 */

import axios from 'axios';

export interface ErrorResponse {
  message: string;
  details?: string;
}

/**
 * Formats error messages consistently based on error type
 */
export const formatError = (error: unknown): ErrorResponse => {
  // If it's an Axios error
  if (axios.isAxiosError(error)) {
    // Server responded with error data
    if (error.response?.data?.message) {
      return {
        message: error.response.data.message,
        details: error.response.data.details
      };
    }

    // Network or server unreachable errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      return {
        message: 'Unable to connect to server. Please check your connection.',
      };
    }

    // Other HTTP errors
    return {
      message: `Request failed (${error.response?.status || 'unknown'})`,
      details: error.message
    };
  }
  
  // If it's a standard error object
  if (error instanceof Error) {
    return {
      message: 'An error occurred',
      details: error.message
    };
  }
  
  // For unknown error types
  return {
    message: 'An unexpected error occurred',
    details: String(error)
  };
};

/**
 * Logs errors to console in development mode only
 */
export const logError = (context: string, error: unknown): void => {
  if (import.meta.env.DEV) {
    console.error(`Error in ${context}:`, error);
  }
};

export const errorService = {
  formatError,
  logError
};

export default errorService;
