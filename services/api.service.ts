import { API_CONFIG } from '@/config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;
  private authToken: string | null = null;

  private constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public setAuthToken(token: string | null): void {
    console.log('Setting auth token');
    this.authToken = token;
  }

  private async getAuthToken(): Promise<string | null> {
    if (this.authToken) {
      return this.authToken;
    }
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        this.authToken = token;
      }
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async clearAuthToken(): Promise<void> {
    console.log('Clearing auth token');
    this.authToken = null;
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  }

  // Generic request method
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const url = `${this.api.defaults.baseURL}${endpoint}`;
      console.log(`Making ${method} request to:`, url);
  
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
  
      const token = await this.getAuthToken();
      if (token) {
        console.log('Adding auth token to request');
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.log('No auth token available for request');
      }
  
      const config: AxiosRequestConfig = {
        method,
        url,
        headers,
        data: data ? JSON.stringify(data) : undefined,
      };
  
      console.log('Request config:', {
        method,
        url,
        hasAuth: !!headers['Authorization'],
        hasData: !!data,
      });
  
      const response = await this.api.request<T>(config);
      return response.data;
    } catch (error) {
      console.error('API request error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log('Authentication error, clearing token');
          await this.clearAuthToken();
        }
        throw new Error(error.response?.data?.message || 'API request failed');
      }
      throw error;
    }
  }
  

  // HTTP method wrappers
  public async get<T>(url: string): Promise<T> {
    return this.request<T>('GET', url);
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('POST', url, data);
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('PUT', url, data);
  }

  public async delete<T>(url: string): Promise<T> {
    return this.request<T>('DELETE', url);
  }
}

export const apiService = ApiService.getInstance();