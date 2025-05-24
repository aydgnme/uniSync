import { useProfile } from "@/hooks/useProfile";
import { useSchedule } from "@/hooks/useSchedule";
import styles from "@/styles/main.styles";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  AppState,
  AppStateStatus,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Calendar: undefined;
  Courses: undefined;
  Announcements: undefined;
};

type MainScreenNavigationProp = BottomTabNavigationProp<MainTabParamList>;

interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

interface ScheduleItem {
  time: string;
  subject: string;
  location: string;
  professor: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  onPress,
}) => (
  <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
    <View style={styles.quickActionIcon}>
      <Ionicons name={icon} size={24} color="rgb(0, 122, 255)" />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function MainScreen() {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { user, loading } = useProfile();
  const { todayCourses, isLoading: scheduleLoading, error: scheduleError, refreshSchedule } = useSchedule();
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  useEffect(() => {
    console.log("User data:", user);
    console.log("Loading state:", loading);
  }, [user, loading]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        refreshSchedule();
      }
      appState.current = nextAppState;
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const announcements = [
    {
      title: "Midterm Schedule Released",
      date: "2024-03-15",
      type: "Academic",
    },
    {
      title: "Campus Wi-Fi Maintenance",
      date: "2024-03-16",
      type: "Technical",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hello, </Text>
            <Text style={styles.userName}>{user?.name || "Guest"}</Text>
            <Text style={styles.welcomeText}>Welcome!</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons
              name="person-circle-outline"
              size={40}
              color="rgb(0, 122, 255)"
            />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickActionButton
            icon="calendar-outline"
            label="Calendar"
            onPress={() => router.push("/schedule")}
          />
          <QuickActionButton
            icon="library-outline"
            label="Grades"
            onPress={() => router.push("/(screens)/grades")}
          />
          <QuickActionButton
            icon="document-text-outline"
            label="Courses"
            onPress={() => router.push("/courses")}
          />
          <QuickActionButton
            icon="mail-outline"
            label="Messages"
            onPress={() => router.push("/(screens)/messages")}
          />
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          {loading || scheduleLoading ? (
            <Text>Loading...</Text>
          ) : scheduleError ? (
            <Text>{scheduleError}</Text>
          ) : todayCourses.length > 0 ? (
            todayCourses.map((course, index) => (
              <View key={index} style={styles.classCard}>
                <View style={styles.classTime}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="rgb(0, 122, 255)"
                  />
                  <Text style={styles.classTimeText}>{`${course.startTime} - ${course.endTime}`}</Text>
                </View>
                <Text style={styles.className}>{course.title}</Text>
                <View style={styles.classDetails}>
                  <Text style={styles.classLocation}>
                    <Ionicons name="location-outline" size={16} color="#666" />{" "}
                    {course.room}
                  </Text>
                  <Text style={styles.classProfessor}>
                    <Ionicons name="person-outline" size={16} color="#666" />{" "}
                    {course.teacher}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text>No classes found for today.</Text>
          )}
        </View>

        {/* Announcements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          {announcements.map((announcement, index) => (
            <TouchableOpacity key={index} style={styles.announcementCard}>
              <View style={styles.announcementHeader}>
                <Text style={styles.announcementTitle}>
                  {announcement.title}
                </Text>
                <Text style={styles.announcementType}>{announcement.type}</Text>
              </View>
              <Text style={styles.announcementDate}>{announcement.date}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
