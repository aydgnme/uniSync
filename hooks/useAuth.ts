import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert } from "react-native";
import { authService } from "../services/auth.service";

type AuthStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const validateEmail = () => {
    console.log('Validating email:', email);
    const emailRegex = /^[A-Z0-9._%+-]+@([a-z]+\.)?usv\.ro$/i;
    const isValid = emailRegex.test(email.trim());
    console.log('Email validation result:', isValid);
    setEmailError(isValid ? "" : "Please enter a valid USV email address");
    return isValid;
  };

  const validatePassword = () => {
    console.log('Validating password length');
    const isValid = password.trim().length >= 6;
    console.log('Password validation result:', isValid);
    setPasswordError(isValid ? "" : "Password must be at least 6 characters");
    return isValid;
  };

  const handleLogin = async () => {
    console.log('Login attempt started');
    console.log('Email:', email.trim());
    console.log('Password length:', password.trim().length);

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      console.log('Validation failed:', { isEmailValid, isPasswordValid });
      return;
    }

    setLoading(true);
    console.log('Sending login request to server...');

    try {
      const response = await authService.login({
        email: email.trim(),
        password: password.trim(),
      });

      console.log('Login response:', response);

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from server');
      }

      if (!response.token || !response.user?.id) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }

      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('userId', response.user.id);

      console.log('Token and userId stored in AsyncStorage');
      navigation.replace("MainTabs");
    } catch (error: any) {
      console.error('Login error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });

      const status = error?.response?.status as number | undefined;
      let errorMessage = "An error has occurred. Please try again.";

      switch (status) {
        case 401:
          errorMessage = "Invalid email or password";
          break;
        case 404:
          errorMessage = "User not found";
          break;
        case 500:
          errorMessage = "Server error. Please try again later";
          break;
      }

      console.log('Showing error alert:', errorMessage);
      Alert.alert("Login Failed", errorMessage);
    } finally {
      console.log('Login attempt completed');
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    showForgotPassword,
    setShowForgotPassword,
    showPrivacyPolicy,
    setShowPrivacyPolicy,
    loading,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    validateEmail,
    validatePassword,
    handleLogin
  };
}; 