import { API_CONFIG } from '@/config/api.config';
import { apiService } from './api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    studentId: string;
    department: string;
    role: 'student' | 'teacher' | 'admin';
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  studentId: string;
  department: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

class AuthService {
  private static instance: AuthService;
  private readonly BASE_PATH = '/api/auth';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      return await apiService.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol ediniz.');
    }
  }

  public async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      return await apiService.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Kayıt olurken bir hata oluştu. Lütfen bilgilerinizi kontrol ediniz.');
    }
  }

  public async logout(): Promise<void> {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Çıkış yapılırken bir hata oluştu.');
    }
  }

  public async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error('Şifre sıfırlama isteği gönderilirken bir hata oluştu.');
    }
  }

  public async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, data);
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error('Şifre sıfırlanırken bir hata oluştu.');
    }
  }

  public async getUserProfile(userId: string): Promise<any> {
    const response = await apiService.get(`${this.BASE_PATH}/profile/${userId}`);
    return response;
  }
}

export const authService = AuthService.getInstance();
