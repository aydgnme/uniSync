import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';

LogBox.ignoreLogs([
  "The navigation state parsed from the URL contains routes not present in the root navigator"
]);

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await SecureStore.getItemAsync('token');
        const userId = await SecureStore.getItemAsync('userId');
        setInitialCheckDone(true);
      } catch (error) {
        console.error('Error checking auth:', error);
        setInitialCheckDone(true);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (initialCheckDone && !loading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [initialCheckDone, loading, isAuthenticated]);

  if (!initialCheckDone || loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add any custom fonts here if needed
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      onLayoutRootView();
    }
  }, [loaded, onLayoutRootView]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}