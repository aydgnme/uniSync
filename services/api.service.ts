import { API_CONFIG } from '@/config/api.config';
import axios, { AxiosRequestConfig } from 'axios';

// Create an axios instance with base config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Helper for making requests (optional, for DRY usage)
export const apiRequest = async (options: AxiosRequestConfig) => {
  try {
    const response = await api(options);
    return response.data;
  } catch (error) {
    // You can add global error handling here
    throw error;
  }
};

export default api; 