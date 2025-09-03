import { API_CONFIG } from '@/config/api.config';
import axios, { AxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';
const SESSION_ID_KEY = 'session_id';

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

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
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
        const sessionId = await SecureStore.getItemAsync(SESSION_ID_KEY);
        if (!sessionId) {
          throw new Error('No session ID found');
        }

        const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, { sessionId });
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
        await Promise.all([
          SecureStore.deleteItemAsync(TOKEN_KEY),
          SecureStore.deleteItemAsync(USER_ID_KEY),
          SecureStore.deleteItemAsync(SESSION_ID_KEY)
        ]);
        router.replace('/(auth)/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other types of errors
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 500) {
        if (data?.code === 'DATABASE_ERROR') {
          console.error('Database error:', data);
          return Promise.reject(new Error('Veritabanı bağlantısında bir sorun oluştu. Lütfen daha sonra tekrar deneyin.'));
        }
        console.error('Server error:', data);
        return Promise.reject(new Error('Sunucu hatası: Lütfen daha sonra tekrar deneyin.'));
      }
      
      if (status === 404) {
        console.error('API endpoint not found:', originalRequest.url);
        return Promise.reject(new Error('İstek yapılan adres bulunamadı.'));
      }
      
      if (status === 403) {
        console.error('Access forbidden:', data);
        return Promise.reject(new Error('Bu işlem için yetkiniz bulunmuyor.'));
      }
      
      if (status === 400) {
        console.error('Bad request:', data);
        return Promise.reject(new Error(data?.message || 'Geçersiz istek.'));
      }
    }
    
    if (error.request) {
      console.error('Network error:', error.request);
      return Promise.reject(new Error('Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.'));
    }

    console.error('Unknown error:', error);
    return Promise.reject(new Error('Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.'));
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