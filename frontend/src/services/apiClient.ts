import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle different error statuses
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('auth_token');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden
          toast.error('You do not have permission to perform this action');
          break;
          
        case 404:
          // Not found
          toast.error('Resource not found');
          break;
          
        case 422:
          // Validation error
          const validationError = data.message || 'Validation failed';
          toast.error(validationError);
          break;
          
        case 500:
          // Server error
          toast.error('Internal server error. Please try again later.');
          break;
          
        default:
          // Other errors
          const errorMessage = data.message || `Error ${status}: ${error.message}`;
          toast.error(errorMessage);
      }
    } else if (error.request) {
      // Network error
      toast.error('Backend server not available. Please ensure the backend server is running at http://localhost:8080/api');
    } else {
      // Other errors
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;