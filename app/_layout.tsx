import { AcademicCalendarProvider } from "@/contexts/AcademicCalendarContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GradesProvider } from '@/contexts/GradesContext';
import { ScheduleProvider } from "@/contexts/ScheduleContext";
import { Stack } from "expo-router";
import React from "react";

const AppContent = () => {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AcademicCalendarProvider>
      <AuthProvider>
        <ScheduleProvider>
          <GradesProvider>
            <AppContent />
          </GradesProvider>
        </ScheduleProvider>
      </AuthProvider>
    </AcademicCalendarProvider>
  );
}
