import { useColorScheme } from 'react-native';

interface Theme {
  colors: {
    primary: string;
    background: string;
    text: string;
    card: string;
    border: string;
    notification: string;
  };
  dark: boolean;
}

const lightTheme: Theme = {
  colors: {
    primary: '#2196F3',
    background: '#FFFFFF',
    text: '#000000',
    card: '#FFFFFF',
    border: '#E0E0E0',
    notification: '#FF3B30',
  },
  dark: false,
};

const darkTheme: Theme = {
  colors: {
    primary: '#90CAF9',
    background: '#121212',
    text: '#FFFFFF',
    card: '#1E1E1E',
    border: '#2C2C2C',
    notification: '#FF453A',
  },
  dark: true,
};

export function useTheme() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return { theme };
} 