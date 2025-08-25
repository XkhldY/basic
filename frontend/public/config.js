// Runtime configuration - will be overridden by deployment scripts for different environments
window.APP_CONFIG = {
  // Default to localhost for development
  // This will be dynamically updated by deployment scripts for production
  API_URL: 'http://localhost:8000',
  
  // Environment indicator
  ENVIRONMENT: 'development'
};
