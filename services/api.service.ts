import { API_CONFIG } from '@/config/api.config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';

// Create an axios instance with base config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  validateStatus: (status) => status >= 200 && status < 300, // Only accept 2xx status codes
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - add token
api.interceptors.request.use(async (config: any) => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
});

// Response interceptor - error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if response is HTML instead of JSON
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      console.error('Received HTML instead of JSON:', response.data);
      return Promise.reject(new Error('Invalid response format: received HTML instead of JSON'));
    }
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // Log the error for debugging
    console.error('API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error: Please check your internet connection'));
    }

    // Handle HTML responses
    const contentType = error.response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      console.error('Received HTML instead of JSON:', error.response.data);
      return Promise.reject(new Error('Invalid response format: received HTML instead of JSON'));
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN);
        const { token } = response.data;

        if (token) {
          await SecureStore.setItemAsync(TOKEN_KEY, token, {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          });

          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          processQueue(null, token);
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_ID_KEY);
        router.replace('/(auth)/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other types of errors
    if (error.response.status === 404) {
      console.error('API endpoint not found:', originalRequest.url);
      return Promise.reject(new Error('API endpoint not found'));
    } else if (error.response.status === 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject(new Error('Server error: Please try again later'));
    }

    return Promise.reject(error);
  }
);

// Helper for making requests
export const apiRequest = async (options: AxiosRequestConfig) => {
  try {
    const response = await api(options);
    return response.data;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export default api; 