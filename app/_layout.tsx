import { AcademicCalendarProvider } from "@/context/AcademicCalendarContext";
import { AuthProvider } from "@/context/AuthContext";
import { ScheduleProvider } from "@/context/ScheduleContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <AcademicCalendarProvider>
      <AuthProvider>
        <ScheduleProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ScheduleProvider>
      </AuthProvider>
    </AcademicCalendarProvider>
  );
}
