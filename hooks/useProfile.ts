import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { authService } from "../services/auth.service";
import { User, UserRole } from '../types/user.type';

interface UserProfileResponse {
  _id: string;
  email: string;
  password?: string;
  cnp?: string;
  matriculationNumber?: string;
  name: string;
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
    specializationShortName?: string;
    facultyId?: string;
    _id?: string;
    studyYear?: number;
  };
  enrolledLectures?: string[];
  __v?: number;
}

const mapResponseToUser = (response: UserProfileResponse): User => {
  console.log('Mapping user profile response:', JSON.stringify(response, null, 2));
  
  // Role validation
  let userRole: UserRole;
  if (response.role === 'Student' || response.role === 'Professor' || response.role === 'Admin') {
    userRole = response.role;
  } else {
    console.warn(`Invalid role "${response.role}" received, defaulting to "Student"`);
    userRole = 'Student';
  }

  // Create user object from API response
  const user = {
    id: response._id,
    email: response.email,
    name: response.name,
    role: userRole,
    phone: response.phone || '',
    address: response.address || '',
    cnp: response.cnp || '',
    matriculationNumber: response.matriculationNumber || '',
    enrolledLectures: response.enrolledLectures || [],
    academicInfo: response.academicInfo ? {
      program: response.academicInfo.program || '',
      semester: response.academicInfo.semester || 1,
      studyYear: response.academicInfo.studyYear || Math.ceil((response.academicInfo.semester || 1) / 2),
      studentId: response.academicInfo.studentId || '',
      advisor: response.academicInfo.advisor || '',
      groupName: response.academicInfo.groupName || '',
      subgroupIndex: response.academicInfo.subgroupIndex || '',
      gpa: response.academicInfo.gpa || 0,
      facultyId: response.academicInfo.facultyId || '',
      specializationShortName: response.academicInfo.specializationShortName || '',
      _id: response.academicInfo._id || ''
    } : undefined
  };

  console.log('Mapped user object:', JSON.stringify(user, null, 2));
  return user;
};

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const storedUser = await authService.getUser();
      const token = await authService.getToken();

      if (!storedUser || !token) {
        console.log('No stored user or token found');
        throw new Error('User not authenticated');
      }

      console.log('Fetching profile, userId:', storedUser._id);
      const response = await authService.getUserProfile(storedUser._id);
      console.log('Profile response:', JSON.stringify(response, null, 2));
      
      if (!response) {
        throw new Error('No response from profile API');
      }

      const mappedUser = mapResponseToUser(response);
      console.log('User data:', JSON.stringify(mappedUser, null, 2));
      
      setUser(mappedUser);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Could not load profile');
      
      if (err.response?.status === 401) {
        // Token invalid or expired
        await handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await authService.logout();
              router.replace('/(auth)/login');
            } catch (err) {
              console.error('Logout error:', err);
              Alert.alert('Error', 'Could not complete logout');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Helper getter functions to access additional properties that are not in the type
  const getGroup = (): string => {
    if (user?.academicInfo?.groupName) {
      return user.academicInfo.groupName;
    }
    return '';
  };

  const getSubgroup = (): string => {
    if (user?.academicInfo?.subgroupIndex) {
      return user.academicInfo.subgroupIndex;
    }
    return '';
  };

  const getProfileImageUrl = (): string => {
    if (user?.profileImageUrl) {
      return user.profileImageUrl || '';
    }
    return '';
  };

  const getAcademicInfo = () => {
    if (user?.academicInfo) {
      console.log('Academic Info:', JSON.stringify(user.academicInfo, null, 2));
      return user.academicInfo;
    }
    return null;
  };

  return {
    user,
    loading,
    error,
    fetchUserProfile,
    handleLogout,
    getGroup,
    getSubgroup,
    getProfileImageUrl,
    getAcademicInfo
  };
}; 