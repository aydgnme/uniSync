import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';

interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  email: string;
  role: string;
}

// Utility function for token validation
export const validateToken = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const tokenService = {
  // Save token
  saveToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.error('Error saving token:', error);
      throw new Error('Failed to save token');
    }
  },

  // Get token
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Remove token
  removeToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw new Error('Failed to remove token');
    }
  },

  // Check token validity
  isTokenValid: async (): Promise<boolean> => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) return false;
      return validateToken(token);
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  },

  // Extract user information from token
  getDecodedToken: async (): Promise<DecodedToken | null> => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) return null;
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error getting decoded token:', error);
      return null;
    }
  },

  // Calculate remaining time until token expiration (in seconds)
  getTokenExpirationTime: async (): Promise<number | null> => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) return null;

      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return Math.max(0, decoded.exp - currentTime);
    } catch (error) {
      console.error('Error calculating token expiration time:', error);
      return null;
    }
  }
}; 