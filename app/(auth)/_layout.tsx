import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "Login",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="resetPassword"
        options={{
          headerShown: true,
          headerTitle: "Reset Password"
        }}
      />
    </Stack>
  );
} 