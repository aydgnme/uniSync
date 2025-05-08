import { useAuth } from "@/context/AuthContext";
import { scheduleService } from "@/services/schedule.service";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "../styles/main.styles";

interface AcademicInfo {
  group: string;
  subgroup: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  academicInfo: AcademicInfo;
}

type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Calendar: undefined;
  Grades: undefined;
  Courses: undefined;
  Messages: undefined;
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
  const { user } = useAuth() as { user: User | null };
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const appState = useRef(AppState.currentState);

  const transformToScheduleItem = (entry: any): ScheduleItem => ({
    time: `${entry.startTime} - ${entry.endTime}`,
    subject: entry.title,
    location: entry.room,
    professor: entry.teacher,
  });
  
  const fetchTodaySchedule = async () => {
    if (!user?.academicInfo?.group || !user?.academicInfo?.subgroup) {
      setError("Kullanıcı grup bilgisi eksik!");
      setSchedule([]);
      setScheduleLoading(false);
      return;
    }
    setScheduleLoading(true);
    setError(null);
    try {
      const response = await scheduleService.getTodaySchedule(
        user.academicInfo.group,
        user.academicInfo.subgroup
      );
      
      if (!response?.data?.data?.courses) {
        console.log('Debug - Invalid schedule response:', response);
        setError("Geçersiz program verisi.");
        setSchedule([]);
        return;
      }

      console.log('Today schedule response:', response.data);
      const transformedSchedule = response.data.data.courses.map(transformToScheduleItem);
      setSchedule(transformedSchedule);
    } catch (err: any) {
      console.error('Today schedule error:', err);
      setError("Program yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      setSchedule([]);
    } finally {
      setScheduleLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaySchedule();
  }, [user]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        fetchTodaySchedule();
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
            <Text style={styles.userName}>{user?.name}</Text>
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
            onPress={() => navigation.navigate("Calendar")}
          />
          <QuickActionButton
            icon="library-outline"
            label="Grades"
            onPress={() => navigation.navigate("Grades")}
          />
          <QuickActionButton
            icon="document-text-outline"
            label="Courses"
            onPress={() => navigation.navigate("Courses")}
          />
          <QuickActionButton
            icon="mail-outline"
            label="Messages"
            onPress={() => navigation.navigate("Messages")}
          />
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          {scheduleLoading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text>{error}</Text>
          ) : schedule.length > 0 ? (
            schedule.map((item, index) => (
              <View key={index} style={styles.classCard}>
                <View style={styles.classTime}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="rgb(0, 122, 255)"
                  />
                  <Text style={styles.classTimeText}>{item.time}</Text>
                </View>
                <Text style={styles.className}>{item.subject}</Text>
                <View style={styles.classDetails}>
                  <Text style={styles.classLocation}>
                    <Ionicons name="location-outline" size={16} color="#666" />{" "}
                    {item.location}
                  </Text>
                  <Text style={styles.classProfessor}>
                    <Ionicons name="person-outline" size={16} color="#666" />{" "}
                    {item.professor}
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
            <TouchableOpacity
              key={index}
              style={styles.announcementCard}
            >
              <View style={styles.announcementHeader}>
                <Text style={styles.announcementTitle}>
                  {announcement.title}
                </Text>
                <Text style={styles.announcementType}>
                  {announcement.type}
                </Text>
              </View>
              <Text style={styles.announcementDate}>
                {announcement.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
