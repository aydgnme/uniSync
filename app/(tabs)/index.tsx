import { useAcademicCalendar } from '@/contexts/AcademicCalendarContext';
import { useScheduleContext } from "@/contexts/ScheduleContext";
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from "@/hooks/useProfile";
import { useSchedule } from '@/hooks/useSchedule';
import { Announcement } from '@/services/announcement.service';
import styles, { colors } from "@/styles/main.styles";
import { ScheduleItem } from '@/types/schedule.type';
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import moment from 'moment';
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
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

// Temporary loading component for loading states
function LoadingComponent() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const MainScreen = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { user, loading } = useProfile();
  const { schedule, isLoading, error } = useScheduleContext();
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const { announcements, loading: announcementsLoading, error: announcementsError, fetchAnnouncements } = useAnnouncements();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const { loading: authLoading } = useAuth();
  const { calendarData, academicCalendar } = useAcademicCalendar();
  const academicWeek = calendarData?.weekNumber || 0;
  const { data: scheduleItems, loading: scheduleLoading, error: scheduleError } = useSchedule();
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));

  useEffect(() => {
    //("User data:", user);
    //console.log("Loading state:", loading);
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

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Refresh schedule
  const handleRefresh = () => {
    refreshSchedule();
  };

  const getTodayCourses = () => {
    // Eğer calendarData henüz gelmediyse, boş dizi döndür
    if (!calendarData || !schedule || schedule.length === 0) return [];

    const today = moment();
    const weekNumber = calendarData.weekNumber;
    const parity = calendarData.parity;
    const todayWeekDay = today.isoWeekday().toString();

    console.log('Today\'s schedule check:', {
      date: today.format('YYYY-MM-DD'),
      weekNumber,
      parity,
      weekDay: todayWeekDay
    });

    const filtered = schedule.filter((course: ScheduleItem) => {
      // Week number check
      if (!course.weeks || course.weeks.length === 0 || !course.weeks.includes(academicWeek)) {
        console.log(`Course ${course.courseTitle} not in current week ${academicWeek}`);
        return false;
      }
      // Parity check
      if (course.parity !== 'all' && course.parity !== parity) {
        console.log(`Course ${course.courseTitle} parity mismatch: ${course.parity} vs ${parity}`);
        return false;
      }
      // Day check
      if (course.weekDay !== todayWeekDay) {
        console.log(`Course ${course.courseTitle} not on current day: ${course.weekDay} vs ${todayWeekDay}`);
        return false;
      }
      console.log(`Course ${course.courseTitle} is valid for today`);
      return true;
    });

    return filtered;
  };

  const scheduleItemToCalendarCourse = (item: ScheduleItem, weekStart: moment.Moment, academicWeek: number): CalendarCourse => {
    console.log('[scheduleItemToCalendarCourse] Processing course:', {
      title: item.courseTitle,
      weekDay: item.weekDay,
      weeks: weeks,
      academicWeek: academicWeek,
      courseDate: courseDate
    });
    // ... existing code ...
  };

  useEffect(() => {
    if (scheduleItems && calendarData) {
      const weekStart = moment(selectedDate).startOf('isoWeek');
      const convertedCourses = scheduleItems.map(item =>
        scheduleItemToCalendarCourse(item, weekStart, calendarData.weekNumber)
      );
      setCalendarCourses(convertedCourses);
    }
  }, [scheduleItems, selectedDate, calendarData]);

  if (authLoading) {
    return <LoadingComponent />;
  }

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
          {isLoading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text>{error}</Text>
          ) : getTodayCourses().length > 0 ? (
            getTodayCourses().map((course: ScheduleItem, index: number) => (
              <View key={index} style={styles.classCard}>
                <View style={styles.classTime}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="rgb(0, 122, 255)"
                  />
                  <Text style={styles.classTimeText}>{`${moment(course.startTime, 'HH:mm:ss').format('HH:mm')} - ${moment(course.endTime, 'HH:mm:ss').format('HH:mm')}`}</Text>
                </View>
                <Text style={styles.className}>{course.courseTitle}</Text>
                <View style={styles.classDetails}>
                  <Text style={styles.classLocation}>
                    <Ionicons name="location-outline" size={16} color="#666" />{" "}
                    {course.room}
                  </Text>
                  <Text style={styles.classProfessor}>
                    <Ionicons name="person-outline" size={16} color="#666" />{" "}
                    {course.groupName}
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
          {announcementsLoading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : announcementsError ? (
            <Text style={styles.errorText}>Error loading announcements</Text>
          ) : Array.isArray(announcements) && announcements.length > 0 ? (
            announcements.map((announcement: Announcement) => (
              <TouchableOpacity 
                key={announcement.id} 
                style={styles.announcementCard}
                onPress={() => setSelectedAnnouncement(announcement)}
              >
                <View style={styles.announcementHeader}>
                  <Text style={styles.announcementTitle}>
                    {announcement.title}
                  </Text>
                  <Text style={styles.announcementType}>{announcement.category}</Text>
                </View>
                <Text style={styles.announcementContent}>
                  {truncateText(announcement.content, 100)}
                </Text>
                <Text style={styles.announcementDate}>
                  {new Date(announcement.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No announcements available.</Text>
          )}
        </View>

        {/* Announcement Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={selectedAnnouncement !== null}
          onRequestClose={() => setSelectedAnnouncement(null)}
        >
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
            <View style={styles.modalContent}>
              {selectedAnnouncement && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedAnnouncement.title}</Text>
                    <TouchableOpacity
                      onPress={() => setSelectedAnnouncement(null)}
                      style={styles.modalCloseButton}
                    >
                      <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalTypeContainer}>
                    <Text style={styles.modalType}>{selectedAnnouncement.category}</Text>
                    <Text style={styles.modalDate}>
                      {new Date(selectedAnnouncement.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <ScrollView style={styles.modalScrollView}>
                    <Text style={styles.modalContentText}>{selectedAnnouncement.content}</Text>
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainScreen;
