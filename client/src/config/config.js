/**
 * Application configuration settings
 */

const config = {
  // API configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 30000,
    withCredentials: true,
  },
  
  // Authentication settings
  auth: {
    tokenKey: 'rehearsal_scheduler_token',
    refreshTokenKey: 'rehearsal_scheduler_refresh_token',
    tokenExpiry: 3600, // 1 hour in seconds
  },
  
  // App settings
  app: {
    name: 'Rehearsal Scheduler',
    version: '1.0.0',
    copyrightYear: new Date().getFullYear(),
  },
  
  // Feature flags
  features: {
    smartScheduling: true,
    fileUploads: true,
    notifications: true,
    analytics: true,
  },
  
  // External services
  services: {
    googleMaps: {
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      defaultZoom: 15,
    },
    notifications: {
      vapidPublicKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
    },
  },
};

export default config;