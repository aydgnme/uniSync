import { useAuth as useAuthContext } from '@/context/AuthContext';
import type { LoginRequest } from '@/services/auth.service';
import { authService } from '@/services/auth.service';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useAuth = () => {
  const { login: contextLogin } = useAuthContext();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@([a-z]+\.)?usv\.ro$/i;
    const isValid = emailRegex.test(formData.email.trim());
    if (!isValid) {
      Alert.alert('Error', 'Please enter a valid USV email address');
    }
    return isValid;
  };

  const validatePassword = () => {
    const isValid = formData.password.trim().length >= 6;
    if (!isValid) {
      Alert.alert('Error', 'Password must be at least 6 characters');
    }
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateEmail() || !validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Login attempt with:', { email: formData.email });
      const response = await authService.login({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });
      console.log('Login response received');

      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      await contextLogin(response.user, response.token);
      console.log('Login successful, navigating to main screen');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'An error occurred during login. Please try again.';

      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found';
      }

      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    showPassword,
    setShowPassword,
    handleLogin
  };
}; 