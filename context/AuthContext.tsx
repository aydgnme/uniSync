import { authService } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  nationality?: string;
  cnp?: string;
  matriculationNumber?: string;
  profileImageUrl?: string;
  academicInfo?: {
    advisor?: string;
    gpa?: number;
    semester?: number;
    studyYear?: number;
    groupName?: string;
    subgroupIndex?: string;
    facultyId?: string;
    facultyName?: string;
    specializationId?: string;
    specializationShortName?: string;
    isModular?: boolean;
    studentId?: string;
    program?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  loginWithToken: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        
        if (!token) {
          console.log('No token found in SecureStore, redirecting to login');
          router.replace('/(auth)/login');
          return;
        }

        console.log('Token found in SecureStore, checking user data');
        const userData = await authService.checkUser();
        console.log('User data loaded successfully:', userData);
        
        if (!userData || !userData.id) {
          console.error('Invalid user data received');
          throw new Error('Invalid user data');
        }
        
        setUser(userData);
        console.log('User state updated successfully');
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Auth initialization failed:', error);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        router.replace('/(auth)/login');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login...');
      const response = await authService.login(email, password);
  
      if (response && response.token) {
        console.log('Saving token to SecureStore...');
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
  
        console.log('Login successful, fetching user data...');
        const userData = await authService.checkUser();
        console.log('User data fetched successfully:', userData);
        
        if (!userData || !userData.id) {
          throw new Error('Invalid user data received');
        }
        
        setUser(userData);
        console.log('User state updated successfully');
        router.replace('/(tabs)');
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithToken = async (token: string, userData: User) => {
    setLoading(true);
    try {
      console.log('Saving token to SecureStore...');
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      
      if (!userData || !userData.id) {
        throw new Error('Invalid user data');
      }
      
      setUser(userData);
      console.log('User state updated successfully');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login with token error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log('Logging out...');
      await SecureStore.deleteItemAsync(TOKEN_KEY);
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
    <AuthContext.Provider value={{ user, loading, login, loginWithToken, logout }}>
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
