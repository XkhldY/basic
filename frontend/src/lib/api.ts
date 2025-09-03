import axios from 'axios';
import Cookies from 'js-cookie';

// Get API URL from runtime config, environment variable, or default
const getApiBaseUrl = () => {
  // Check if runtime config is available (for production overrides)
  if (typeof window !== 'undefined' && window.APP_CONFIG?.API_URL) {
    return window.APP_CONFIG.API_URL;
  }
  
  // Check environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Check NODE_ENV for environment-specific defaults
  if (process.env.NODE_ENV === 'production') {
    // In production, try to detect if we're running on AWS
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // If we're on pom100.com, use api.pom100.com
      if (hostname === 'pom100.com' || hostname === 'www.pom100.com') {
        return 'https://api.pom100.com';
      }
      // For other domains, use the same hostname with port 8000
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:8000`;
      }
    }
  }
  
  // Default fallback for development
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL); // Debug log
console.log('Environment:', typeof window !== 'undefined' && window.APP_CONFIG?.ENVIRONMENT || 'unknown');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          // In a real app, you would call a refresh endpoint
          // For now, we'll just redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        }
      } else {
        // No refresh token, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
      }
    }

    // Enhanced error handling for different status codes
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = data?.detail || data?.message || 'An error occurred';

      switch (status) {
        case 400:
          console.error('Bad Request:', errorMessage);
          break;
        case 403:
          console.error('Forbidden:', errorMessage);
          break;
        case 404:
          console.error('Not Found:', errorMessage);
          break;
        case 422:
          console.error('Validation Error:', data);
          // For validation errors, extract field-specific errors
          if (data?.detail && Array.isArray(data.detail)) {
            const fieldErrors = data.detail.map((err: any) => 
              `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ');
            errorMessage = fieldErrors;
          }
          break;
        case 500:
          console.error('Server Error:', errorMessage);
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          console.error('HTTP Error:', status, errorMessage);
      }

      // Attach user-friendly error message
      error.userMessage = errorMessage;
    } else if (error.request) {
      console.error('Network Error:', error.request);
      error.userMessage = 'Network error. Please check your connection.';
    } else {
      console.error('Request Error:', error.message);
      error.userMessage = 'An unexpected error occurred.';
    }

    return Promise.reject(error);
  }
);

export default apiClient;