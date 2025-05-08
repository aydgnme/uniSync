import { ResetPasswordData, ResetPasswordRequest } from '@/types/auth.type';
import axios from 'axios';
import { storageService } from './storage.service';

class AuthService {
  private static instance: AuthService;
  private baseURL: string = 'https://api.unisync.com'; // API URL'nizi buraya ekleyin

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async generateResetCode(cnp: string, matriculationNumber: string): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/auth/reset-password/generate`, {
        cnp,
        matriculationNumber
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      const resetRequest: ResetPasswordRequest = {
        ...data,
        token: await storageService.getItem('resetToken') || ''
      };
      
      await axios.post(`${this.baseURL}/auth/reset-password`, resetRequest);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.message || 'Bir hata oluştu');
    }
    return error instanceof Error ? error : new Error('Bilinmeyen bir hata oluştu');
  }
}

export const authService = AuthService.getInstance(); 