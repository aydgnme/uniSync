import { authService } from '@/services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  nationality: string;
  cnp: string;
  matriculationNumber: string;
  academicInfo: {
    advisor: string;
    gpa: number;
    semester: number;
    studyYear: number;
    groupName: string;
    subgroupIndex: string;
    facultyId: string;
    studentId: string;
    isModular: boolean;
    specializationShortName: string;
    program: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/(auth)/login');
          return;
        }

        const response = await authService.checkUser();
        if (response && response.user) {
          setUser(response.user);
          router.replace('/(tabs)');
        } else {
          await AsyncStorage.removeItem('token');
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await AsyncStorage.removeItem('token');
        router.replace('/(auth)/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response && response.user) {
        setUser(response.user);
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      await AsyncStorage.removeItem('token');
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
