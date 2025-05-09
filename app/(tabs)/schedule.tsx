import DayView from "@/components/calendar/DayView";
import MonthView from "@/components/calendar/MonthView";
import WeekView from "@/components/calendar/WeekView";
import { useSchedule } from "@/hooks/useSchedule";
import { Course as CalendarCourse } from "@/types/calendar.type";
import { Course } from "@/types/schedule.type";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TABS = ["Day", "Week", "Month"];

const scheduleCourseToCalendarCourse = (course: Course): CalendarCourse => {
  const typeMapping = {
    LAB: "lecture",
    LECTURE: "course",
    SEMINAR: "seminar",
  } as const;

  return {
    id: course.id,
    date: course.date || moment().day(course.weekDay).format("YYYY-MM-DD"),
    title: course.title,
    time: `${course.startTime} - ${course.endTime}`,
    location: course.room,
    type: typeMapping[course.type],
    teacher: course.teacher,
    group: course.group,
    duration: course.duration,
  };
};

const ScheduleScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Day");
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [markedDates, setMarkedDates] = useState({});
  const { courses, isLoading, error, refreshSchedule } = useSchedule();
  const [calendarCourses, setCalendarCourses] = useState<CalendarCourse[]>([]);

  useEffect(() => {
    const convertedCourses = courses.map(scheduleCourseToCalendarCourse);
    setCalendarCourses(convertedCourses);
  }, [courses]);

  useEffect(() => {
    const marks: any = {};
    calendarCourses.forEach((course) => {
      marks[course.date] = { marked: true, dotColor: "#1a73e8" };
    });
    setMarkedDates(marks);
  }, [calendarCourses]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Schedule</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a73e8" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Schedule</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={refreshSchedule}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Day":
        return (
          <DayView
            selectedDate={selectedDate}
            courses={calendarCourses}
            events={calendarCourses}
          />
        );
      case "Week":
        return (
          <WeekView selectedDate={selectedDate} events={calendarCourses} />
        );
      case "Month":
        return (
          <MonthView
            selectedDate={selectedDate}
            markedDates={markedDates}
            onDateChange={setSelectedDate}
            events={calendarCourses}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
      </View>

      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderTabContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: '#F2F2F7',
      android: '#F0F0F0',
    }),
    marginTop: -100,
  },
  content: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  header: {
    padding: 20,
    paddingTop: 100,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#202124',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#1a73e8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#1a73e8",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#1a73e8",
  },
});

export default ScheduleScreen;
