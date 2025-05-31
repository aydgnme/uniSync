import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - add token
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Redirect user to login page
      // This part will be handled by navigation
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password });
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generateResetCode: async (cnp: string, matriculationNumber: string) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        cnp,
        matriculationNumber,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyResetCode: async (cnp: string, matriculationNumber: string, reset_code: string) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, {
        cnp,
        matriculationNumber,
        reset_code,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (
    cnp: string,
    matriculationNumber: string,
    code: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
        cnp,
        matriculationNumber,
        code,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  checkUser: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  findUserByCnpAndMatriculation: async (cnp: string, matriculationNumber: string) => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.USER.GET_BY_MATRICULATION(matriculationNumber));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      await AsyncStorage.removeItem('token');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 