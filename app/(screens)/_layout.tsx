import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function ScreenLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="grades"
        options={{
          title: 'Grades',
        }}
      />
      <Stack.Screen
        name="messages"
        options={{
          title: 'Messages',
        }}
      />
    </Stack>
  );
} 