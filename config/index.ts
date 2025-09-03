import { API_CONFIG } from './api.config';

// API Configuration
export const API_URL = API_CONFIG.BASE_URL;

// Authentication Routes
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refreshToken',
  USER_ID: 'userId',
  SESSION_ID: 'session_id',
  PROFILE_CACHE: 'profile_cache',
  PROFILE_CACHE_TIMESTAMP: 'profile_cache_timestamp',
};

// Cache Configuration
export const CACHE_CONFIG = {
  PROFILE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
};

// Retry Configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Export API Configuration
export type { ApiEndpoint } from './api.config';
export { API_CONFIG };

