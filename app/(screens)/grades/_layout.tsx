import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function CoursesLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        headerTintColor: Colors[colorScheme ?? "light"].text,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Grades",
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          title: "Grade Details",
          headerStyle: {
            backgroundColor: "#f5f5f5",
          },
        }}
      />
    </Stack>
  );
}
