import { authService, LoginResponse } from '@/services/auth.service';
import { storageService } from '@/services/storage.service';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  user: LoginResponse['user'] | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const [token, userData] = await Promise.all([
        storageService.getAuthToken(),
        storageService.getUserData<LoginResponse['user']>(),
      ]);

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth state check error:', error);
      Alert.alert('Hata', 'Oturum durumu kontrol edilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      await Promise.all([
        storageService.setAuthToken(response.token),
        storageService.setUserData(response.user),
      ]);

      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Giriş Hatası',
        'Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol ediniz.'
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      await storageService.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 