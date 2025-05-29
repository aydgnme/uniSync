import { API_CONFIG } from '@/config/api.config';
import * as SecureStore from 'expo-secure-store';
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
    studentId?: string;
    advisor?: string;
    gpa?: number;
    facultyId?: string;
    specializationShortName?: string;
    _id?: string;
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

interface VerifyResetCodeResponse {
  isValid: boolean;
  message: string;
}

class AuthService {
  private static instance: AuthService;
  private readonly BASE_PATH = '/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async storeToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  }

  private async storeUser(user: UserProfile): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
      throw error;
    }
  }

  public async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  public async getUser(): Promise<UserProfile | null> {
    try {
      const userStr = await SecureStore.getItemAsync(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  public async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', { email: data.email });
      const response = await apiService.post<LoginResponse>(`${this.BASE_PATH}/login`, data);
      console.log('Login response received:', { token: response.token ? 'present' : 'missing' });
      
      if (!response.token || !response.user?._id) {
        throw new Error('Invalid login response: missing token or user ID');
      }
      
      // Store token and user data
      await this.storeToken(response.token);
      
      // Set token in API service for future requests
      apiService.setAuthToken(response.token);
      
      try {
        // Fetch complete user profile
        console.log('Fetching user profile after login');
        const userProfile = await this.getUserProfile(response.user._id);
        console.log('User profile fetched:', { 
          id: userProfile._id,
          hasAcademicInfo: !!userProfile.academicInfo 
        });
        
        await this.storeUser(userProfile);
        
        return {
          token: response.token,
          user: userProfile
        };
      } catch (profileError) {
        console.error('Error fetching user profile:', profileError);
        // If profile fetch fails, still return the initial login response
        // but log the error for debugging
        return {
          token: response.token,
          user: response.user
        };
      }
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
      // Clear stored data
      await SecureStore.deleteItemAsync(this.TOKEN_KEY);
      await SecureStore.deleteItemAsync(this.USER_KEY);
      // Clear token from API service
      apiService.setAuthToken(null);
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
      console.log('Calling generate reset code API:', {
        endpoint: API_CONFIG.ENDPOINTS.AUTH.GENERATE_RESET_CODE,
        data: { cnp, matriculationNumber }
      });

      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.GENERATE_RESET_CODE, {
        cnp,
        matriculationNumber,
      });

      console.log('Generate reset code API call successful');
    } catch (error: any) {
      console.error('Generate reset code error:', {
        status: error.response?.status,
        data: error.response?.data,
        error
      });
      throw error;
    }
  }

  public async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, data);
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
      console.log('Fetching user profile for ID:', userId);
  
      const token = await this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      // Set token in API service
      apiService.setAuthToken(token);
  
      // Call with proper ID, no extra query params
      const response = await apiService.get<UserProfile>(`/users/${userId}`);
      console.log('User profile response:', JSON.stringify(response, null, 2));
  
      if (!response) {
        throw new Error('No response from profile API');
      }
  
      return response;
    } catch (error: any) {
      console.error('Get user profile error:', {
        status: error.response?.status,
        data: error.response?.data,
        error
      });
      throw error;
    }
  }
  

  public async verifyResetCode(cnp: string, matriculationNumber: string, code: string): Promise<VerifyResetCodeResponse> {
    try {
      console.log('Calling verify reset code API:', {
        endpoint: API_CONFIG.ENDPOINTS.AUTH.VERIFY_RESET_CODE,
        data: { cnp, matriculationNumber, code }
      });

      const response = await apiService.post<VerifyResetCodeResponse>(API_CONFIG.ENDPOINTS.AUTH.VERIFY_RESET_CODE, {
        cnp,
        matriculationNumber,
        code,
      });

      console.log('Verify reset code API response:', response);
      return response;
    } catch (error: any) {
      console.error('Verify reset code error:', {
        status: error.response?.status,
        data: error.response?.data,
        error
      });
      throw error;
    }
  }
}

export const authService = AuthService.getInstance();
