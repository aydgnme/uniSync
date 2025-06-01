import { TOKEN_KEY, User } from '@/context/AuthContext';
import { mapUserProfileResponse } from '@/utils/user.mapper';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Add request interceptor to include auth token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  getUserProfile: async (userId: string): Promise<User> => {
    try {
      console.log('Fetching user profile...');
      const response = await api.get(API_CONFIG.ENDPOINTS.USER.PROFILE(userId));
      console.log('User profile response:', response.data);
      
      const mappedUser = mapUserProfileResponse(response.data);
      return mappedUser;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  updateUserProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    try {
      console.log('Updating user profile...');
      const response = await api.put(API_CONFIG.ENDPOINTS.USER.PROFILE(userId), data);
      console.log('Update profile response:', response.data);
      
      const mappedUser = mapUserProfileResponse(response.data);
      return mappedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  updateProfileImage: async (userId: string, imageUri: string): Promise<User> => {
    try {
      console.log('Updating profile image...');
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await api.put(
        API_CONFIG.ENDPOINTS.USER.UPLOAD_AVATAR,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Update profile image response:', response.data);
      
      const mappedUser = mapUserProfileResponse(response.data);
      return mappedUser;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  },
}; 