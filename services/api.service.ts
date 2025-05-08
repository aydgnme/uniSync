import { API_CONFIG } from '@/config/api.config';
import axios, { AxiosInstance } from 'axios';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

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

  
  // Generic request method
  private async request<T>(method: string, url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.request<T>({
        method,
        url,
        data,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Bir hata oluştu';
        console.error(`API Error (${url}):`, errorMessage);
        throw new Error(errorMessage);
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