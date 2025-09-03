import { useColorScheme } from 'react-native';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

const lightTheme: ThemeColors = {
  primary: '#1976D2',
  secondary: '#2196F3',
  background: '#FFFFFF',
  card: '#F5F5F5',
  text: '#000000',
  border: '#E0E0E0',
  notification: '#FF4081',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3'
};

const darkTheme: ThemeColors = {
  primary: '#90CAF9',
  secondary: '#64B5F6',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#2C2C2C',
  notification: '#FF80AB',
  error: '#EF5350',
  success: '#81C784',
  warning: '#FFD54F',
  info: '#64B5F6'
};

export const useThemeColor = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkTheme : lightTheme;

  return {
    colors,
    isDark: colorScheme === 'dark'
  };
}; 