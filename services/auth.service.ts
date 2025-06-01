import { User } from '@/context/AuthContext';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { API_CONFIG } from '../config/api.config';

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - add token
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
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
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_ID_KEY);
      // Redirect user to login page
      // This part will be handled by navigation
    }
    return Promise.reject(error);
  }
);

function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    // Add 5 minutes buffer to prevent edge cases
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now() + 5 * 60 * 1000;
    return expirationTime < currentTime;
  } catch (e) {
    console.error('Error decoding token:', e);
    return true;
  }
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

interface UserProfileResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    role: string;
    name: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    dateOfBirth?: string;
    nationality?: string;
    cnp?: string;
    matriculationNumber?: string;
    academicInfo?: {
      advisor?: string;
      facultyId?: string;
      facultyName?: string;
      gpa?: number;
      groupName?: string;
      isModular?: boolean;
      program?: string;
      semester?: number;
      specializationId?: string;
      specializationShortName?: string;
      studentId?: string;
      studyYear?: number;
      subgroupIndex?: string;
    };
  };
}

const mapUserProfileResponse = (response: UserProfileResponse): User => {
  if (!response.success || !response.data) {
    throw new Error('Invalid response format');
  }

  const { data } = response;
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
    phone: data.phone,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
    nationality: data.nationality,
    cnp: data.cnp,
    matriculationNumber: data.matriculationNumber,
    academicInfo: data.academicInfo ? {
      advisor: data.academicInfo.advisor,
      facultyId: data.academicInfo.facultyId,
      facultyName: data.academicInfo.facultyName,
      gpa: data.academicInfo.gpa,
      groupName: data.academicInfo.groupName,
      isModular: data.academicInfo.isModular,
      program: data.academicInfo.program,
      semester: data.academicInfo.semester,
      specializationId: data.academicInfo.specializationId,
      specializationShortName: data.academicInfo.specializationShortName,
      studentId: data.academicInfo.studentId,
      studyYear: data.academicInfo.studyYear,
      subgroupIndex: data.academicInfo.subgroupIndex
    } : undefined
  };
};

export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Making login request...');
      const response = await api.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password });
      console.log('Login API Response:', response.data);
      
      const { token, user } = response.data;
      if (!token || !user?.id) {
        throw new Error('Invalid login response: missing token or user id');
      }

      // Only check token expiration if it's not a fresh login
      const existingToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (existingToken && isTokenExpired(existingToken)) {
        throw new Error('Token is expired');
      }
      
      console.log('Saving token and userId to SecureStore...');
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, token, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        }),
        SecureStore.setItemAsync(USER_ID_KEY, user.id, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        })
      ]);
      console.log('Token and userId saved successfully');
      
      return { token, user };
    } catch (error) {
      console.error('Login API Error:', error);
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
      console.log('Checking user token and userId...');
      const [token, userId] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_ID_KEY)
      ]);

      if (!token) {
        console.error('No token found in SecureStore');
        throw new Error('No token found');
      }

      if (isTokenExpired(token)) {
        console.error('Token is expired');
        throw new Error('Token is expired');
      }

      if (!userId) {
        console.error('No userId found in SecureStore');
        throw new Error('No userId found');
      }

      console.log('Token and userId found, fetching user profile...');
      const response = await api.get<UserProfileResponse>(API_CONFIG.ENDPOINTS.USER.PROFILE);
      console.log('Raw API Response:', JSON.stringify(response.data, null, 2));
      
      if (!response.data.success) {
        console.error('API returned unsuccessful response:', response.data);
        throw new Error('Failed to fetch user profile');
      }

      if (!response.data.data) {
        console.error('API response missing data field:', response.data);
        throw new Error('Invalid user profile data');
      }

      const mappedUser = mapUserProfileResponse(response.data);
      console.log('Mapped user data:', JSON.stringify(mappedUser, null, 2));
      return mappedUser;
    } catch (error) {
      console.error('Check User Error:', error);
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
      console.log('Logging out...');
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_ID_KEY)
      ]);
      console.log('Logout successful');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshToken: async (): Promise<string | null> => {
    try {
      console.log('Refreshing token...');
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN);
      const { token } = response.data;

      if (!token) {
        throw new Error('Token not found in refresh response');
      }

      // Save new token
      await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      console.log('Token refreshed successfully');
      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  },
}; 