import { API_CONFIG } from '@/config/api.config';
import { apiService } from './api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  academicInfo?: {
    program?: string;
    semester?: number;
    groupName?: string;
    subgroupIndex?: string;
    advisor?: string;
    gpa?: number;
  };
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export interface RegisterRequest {
  email: string;
  password: string;
  cnp: string;
  matriculationNumber: string;
  name: string;
  phone: string;
  address: string;
  program: string;
  semester: number;
  groupName: string;
  subgroupIndex: string;
  advisor: string;
  gpa: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  cnp: string;
  matriculationNumber: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateUserRequest {
  name: string;
  phone: string;
  address: string;
  academicInfo: {
    program: string;
    semester: number;
    groupName: string;
    subgroupIndex: string;
    advisor: string;
    gpa: number;
  };
}

class AuthService {
  private static instance: AuthService;
  private readonly BASE_PATH = '/auth';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(`${this.BASE_PATH}/login`, data);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  public async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(`${this.BASE_PATH}/register`, data);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('An error occurred during logout.');
    }
  }

  public async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error('An error occurred while sending password reset request.');
    }
  }

  public async generateResetCode(cnp: string, matriculationNumber: string): Promise<void> {
    try {
      await apiService.post(`${this.BASE_PATH}/pr/generate-reset-code`, {
        cnp,
        matriculationNumber,
      });
    } catch (error) {
      console.error('Generate reset code error:', error);
      throw error;
    }
  }

  public async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await apiService.post(`${this.BASE_PATH}/pr/reset-password`, data);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  public async updateUser(userId: string, data: UpdateUserRequest): Promise<UserProfile> {
    try {
      const response = await apiService.put<UserProfile>(`/users/${userId}`, data);
      return response;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  public async updatePassword(userId: string, newPassword: string): Promise<void> {
    try {
      await apiService.put(`/users/${userId}/password`, { newPassword });
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  public async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await apiService.get<UserProfile>(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }
}

export const authService = AuthService.getInstance();
