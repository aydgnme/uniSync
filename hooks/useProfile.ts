import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { authService } from "../services/auth.service";
import { User, UserRole } from '../types/user.type';


interface UserProfileResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  cnp?: string;
  matriculationNumber?: string;
  academicInfo?: {
    program?: string;
    semester?: number;
    studentId?: string;
    advisor?: string;
    gpa?: number;
    groupName?: string;
    subgroupIndex?: string;
  };
  profileImageUrl?: string;
}

const mapResponseToUser = (response: UserProfileResponse): User => {
  // Rol kontrolü
  let userRole: UserRole;
  if (response.role === 'Student' || response.role === 'Professor' || response.role === 'Admin') {
    userRole = response.role;
  } else {
    console.warn(`Geçersiz rol "${response.role}" alındı, varsayılan olarak "Student" atandı`);
    userRole = 'Student';
  }

  // API yanıtından kullanıcı nesnesi oluştur
  return {
    id: response._id,
    email: response.email,
    name: response.name,
    role: userRole,
    phone: response.phone,
    address: response.address,
    cnp: response.cnp,
    matriculationNumber: response.matriculationNumber,
    profileImageUrl: response.profileImageUrl,
    academicInfo: response.academicInfo ? {
      program: response.academicInfo.program || '',
      semester: response.academicInfo.semester || 1,
      studentId: response.academicInfo.studentId || '',
      advisor: response.academicInfo.advisor || '',
      group: response.academicInfo.groupName || '',
      subgroup: response.academicInfo.subgroupIndex || '',
      gpa: response.academicInfo.gpa || 0,
    } : undefined
  };
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
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        throw new Error('Kullanıcı kimliği doğrulanmadı');
      }

      console.log('Profil getiriliyor, userId:', userId);
      const response = await authService.getUserProfile(userId);
      console.log('Profil yanıtı:', response);
      
      const mappedUser = mapResponseToUser(response);
      setUser(mappedUser);
      setError(null);
    } catch (err: any) {
      console.error('Profil getirme hatası:', err);
      setError(err.message || 'Profil yüklenemedi');
      
      if (err.response?.status === 401) {
        // Token geçersiz veya süresi dolmuş
        await handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Çıkış Yap',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['token', 'userId']);
              router.replace('/(auth)/login');
            } catch (err) {
              console.error('Çıkış hatası:', err);
              Alert.alert('Hata', 'Çıkış yapılamadı');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Helper getter functions to access additional properties that are not in the type
  const getGroup = (): string => {
    if (user?.academicInfo && '_groupName' in user.academicInfo) {
      return (user.academicInfo as any)._groupName || '';
    }
    return '';
  };

  const getSubgroup = (): string => {
    if (user?.academicInfo && '_subgroupIndex' in user.academicInfo) {
      return (user.academicInfo as any)._subgroupIndex || '';
    }
    return '';
  };

  const getProfileImageUrl = (): string => {
    if (user && '_profileImageUrl' in user) {
      return (user as any)._profileImageUrl || '';
    }
    return '';
  };

  return {
    user,
    loading,
    error,
    fetchUserProfile,
    handleLogout,
    getGroup,
    getSubgroup,
    getProfileImageUrl
  };
}; 