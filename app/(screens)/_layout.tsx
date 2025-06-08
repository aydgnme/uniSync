import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, useColorScheme } from 'react-native';

export default function ScreensLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        headerShown: true,
        presentation: 'modal',
      }}>
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="arrow-back" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="messages"
        options={{
          title: 'Messages',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="arrow-back" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="grades"
        options={{
          title: 'Grades',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="arrow-back" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: 'Privacy',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          title: 'Support',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: 'About',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="security/changePassword"
        options={{
          title: 'Change Password',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="security/sessions"
        options={{
          title: 'Session',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="secretary"
        options={{
          title: 'Secretary',
          headerShown: true,
        }}
      />
    </Stack>
  );
} 