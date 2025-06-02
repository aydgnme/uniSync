import { AuthContext } from '@/contexts/AuthContext';
import { useCallback, useContext } from 'react';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, login, logout, loading } = context;


  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      await login(email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [login]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }, [logout]);

  return {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!user,
  };
};