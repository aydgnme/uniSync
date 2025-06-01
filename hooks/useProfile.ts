import { useAuth, User } from '@/context/AuthContext';
import { userService } from '@/services/user.service';
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Alert } from "react-native";

interface UserProfile {
  _id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  nationality?: string;
  cnp?: string;
  matriculationNumber?: string;
  academicInfo?: {
    semester: number;
    studyYear: number;
    groupName: string;
    subgroupIndex: string;
    advisor: string;
    gpa: number;
    facultyId: string;
    specializationShortName: string;
    isModular: boolean;
    studentId: string;
    program: string;
  };
  student_info?: {
    cnp: string;
    matriculation_number: string;
    advisor?: string;
    is_modular?: boolean;
    gpa?: number;
    group_id: string;
    faculty_id?: string;
    semester?: number;
    study_year?: number;
    group_name?: string;
    subgroup_index?: string;
    specialization_short_name?: string;
    specialization_name?: string;
    student_id?: string;
  };
}

const mapResponseToUser = (response: UserProfile): User => {
  const info = response.student_info || {
    cnp: '',
    matriculation_number: '',
    advisor: '',
    is_modular: false,
    gpa: 0,
    group_id: '',
    faculty_id: '',
    semester: 1,
    study_year: 1,
    group_name: '',
    subgroup_index: '',
    specialization_short_name: '',
    specialization_name: '',
    student_id: ''
  };

  const user: User = {
    id: response._id,
    email: response.email,
    name: response.name || '',
    role: response.role || 'student',
    phone: response.phone,
    nationality: response.nationality,
    cnp: info.cnp || response.cnp,
    matriculationNumber: info.matriculation_number || response.matriculationNumber,
    academicInfo: {
      semester: info.semester || response.academicInfo?.semester || 1,
      studyYear: info.study_year || response.academicInfo?.studyYear || 1,
      groupName: info.group_name || response.academicInfo?.groupName || '',
      subgroupIndex: info.subgroup_index || response.academicInfo?.subgroupIndex || '',
      advisor: info.advisor || response.academicInfo?.advisor || '',
      gpa: info.gpa || response.academicInfo?.gpa || 0,
      facultyId: info.faculty_id || response.academicInfo?.facultyId || '',
      specializationShortName: info.specialization_short_name || response.academicInfo?.specializationShortName || '',
      isModular: info.is_modular ?? response.academicInfo?.isModular ?? false,
      studentId: info.student_id || response.academicInfo?.studentId || '',
      program: info.specialization_name || response.academicInfo?.program || ''
    }
  };

  return user;
};

export const useProfile = () => {
  const { user: authUser, logout: authLogout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authUser?.id) {
      fetchUserProfile();
    }
  }, [authUser?.id]);

  const fetchUserProfile = async () => {
    if (!authUser?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getUserProfile(authUser.id);
      setUser(userData);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Could not load profile');
      if (err.response?.status === 401) {
        await handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!authUser?.id) return;

    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.updateUserProfile(authUser.id, data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Could not update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfileImage = async (imageUri: string) => {
    if (!authUser?.id) return;

    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.updateProfileImage(authUser.id, imageUri);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      console.error('Error updating profile image:', err);
      setError(err.message || 'Could not update profile image');
      throw err;
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
              await authLogout();
              router.replace('/(auth)/login');
            } catch (err) {
              Alert.alert('Error', 'Could not complete logout');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const getGroup = (): string => {
    return user?.academicInfo?.groupName ?? '';
  };

  const getSubgroup = (): string => {
    return user?.academicInfo?.subgroupIndex ?? '';
  };

  const getAcademicInfo = () => {
    return user?.academicInfo || null;
  };

  return {
    user,
    loading,
    error,
    fetchUserProfile,
    updateProfile,
    updateProfileImage,
    handleLogout,
    getGroup,
    getSubgroup,
    getAcademicInfo
  };
};