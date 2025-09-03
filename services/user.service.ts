import { User } from '@/contexts/AuthContext';
import { API_CONFIG } from '../config/api.config';
import api from './api.service';

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

export const userService = {
  getUserProfile: async (userId: string): Promise<User> => {
    try {
      //console.log('Fetching user profile...');
      const response = await api.get<UserProfileResponse>(API_CONFIG.ENDPOINTS.USER.PROFILE);
      //console.log('Raw API Response:', JSON.stringify(response.data, null, 2));
      
      if (!response.data.success) {
        console.error('API returned unsuccessful response:', response.data);
        throw new Error('Failed to fetch user profile');
      }

      if (!response.data.data) {
        console.error('API response missing data field:', response.data);
        throw new Error('Invalid user profile data');
      }

      const mappedUser = mapUserProfileResponse(response.data);
      //console.log('Mapped user data:', JSON.stringify(mappedUser, null, 2));
      return mappedUser;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  updateUserProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    try {
      //console.log('Updating user profile...');
      const response = await api.put<UserProfileResponse>(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, data);
      //console.log('Update profile response:', response.data);
      
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

      const response = await api.put<UserProfileResponse>(
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