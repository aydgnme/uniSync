import DayView from "@/components/calendar/DayView";
import MonthView from "@/components/calendar/MonthView";
import WeekView from "@/components/calendar/WeekView";
import { useProfile } from "@/hooks/useProfile";
import { useSchedule } from "@/hooks/useSchedule";
import { Course as CalendarCourse } from "@/types/calendar.type";
import { ScheduleItem } from "@/types/schedule.type";
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

const NUMBER_TO_WEEKDAY: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday'
};

const scheduleItemToCalendarCourse = (item: ScheduleItem): CalendarCourse => {
  const today = moment();
  const currentWeek = today.isoWeek();
  const itemWeekDay = Number(item.weekDay) || 1; // Convert string to number
  
  // Ensure weeks is an array of numbers
  const weeks = Array.isArray(item.weeks) 
    ? item.weeks.map(w => typeof w === 'string' ? parseInt(w) : w)
    : [];
  
  // Calculate the date for the course using a more reliable approach
  // Get the start of the current week (Monday)
  const startOfWeek = moment().startOf('isoWeek');
  // Add the appropriate number of days to get to the target weekday
  const courseDate = startOfWeek.add(itemWeekDay - 1, 'days').format('YYYY-MM-DD');
  
  console.log('[scheduleItemToCalendarCourse] Processing item:', {
    courseTitle: item.courseTitle,
    weekDay: item.weekDay,
    convertedWeekDay: itemWeekDay,
    weeks: weeks,
    currentWeek: currentWeek,
    courseDate: courseDate,
    startOfWeek: startOfWeek.format('YYYY-MM-DD')
  });
  return {
    id: item.scheduleId,
    title: item.courseTitle,
    type: item.courseType as 'LECTURE' | 'LAB' | 'SEMINAR',
    startTime: item.startTime,
    endTime: item.endTime,
    duration: moment(item.endTime, 'HH:mm').diff(moment(item.startTime, 'HH:mm'), 'minutes'),
    room: item.room,
    teacher: item.teacherName,
    weekDay: itemWeekDay,
    instructor: item.teacherName,
    time: `${item.startTime} - ${item.endTime}`,
    color: '#4A90E2',
    banner: item.courseCode.substring(0, 2),
    group: item.groupName,
    location: item.room,
    weeks: weeks,
    date: courseDate,
    code: item.courseCode,
    style: {
      backgroundColor: item.courseType === 'LAB' ? '#eaf4fb' : '#FFE0B2',
      borderLeftWidth: 3,
      borderLeftColor: item.courseType === 'LAB' ? '#2196F3' : '#FB8C00',
    }
  };
};

const ScheduleScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Day");
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [markedDates, setMarkedDates] = useState({});
  const { data: scheduleItems, loading, error } = useSchedule();
  const [calendarCourses, setCalendarCourses] = useState<CalendarCourse[]>([]);
  const { getGroup, getSubgroup, user } = useProfile();
  
  const groupIndex = user?.academicInfo?.groupName 
    ? user.academicInfo.subgroupIndex 
      ? `${user.academicInfo.groupName}${user.academicInfo.subgroupIndex}`
      : user.academicInfo.groupName
    : 'N/A';

  useEffect(() => {
    if (scheduleItems) {
      const convertedCourses = scheduleItems.map(scheduleItemToCalendarCourse);
      setCalendarCourses(convertedCourses);
    }
  }, [scheduleItems]);

  useEffect(() => {
    const marks: Record<string, { marked: boolean; dotColor: string }> = {};
    calendarCourses.forEach((course) => {
      marks[course.date] = { marked: true, dotColor: "#1a73e8" };
    });
    setMarkedDates(marks);
  }, [calendarCourses]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Schedule</Text>
          <Text style={styles.headerSubtitle}>{groupIndex}</Text>
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
          <Text style={styles.headerSubtitle}>{groupIndex}</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              window.location.reload();
            }}
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
            classes={calendarCourses.map(course => ({
              id: course.id,
              title: course.title,
              startTime: course.startTime,
              endTime: course.endTime,
              day: (course.weekDay || 1).toString(), // Default to 1 if undefined
              room: course.location || '',
              weeks: course.weeks || []
            }))}
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
        <Text style={styles.headerSubtitle}>{groupIndex}</Text>
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
    backgroundColor: '#FFF',
  },
  header: {
    padding: 20,
    paddingTop: Platform.select({
      ios: 5,
      android: 60,
    }),
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#202124',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1a73e8',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1a73e8',
  },
});

export default ScheduleScreen;