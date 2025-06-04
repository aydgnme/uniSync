import DayView from "@/components/calendar/DayView";
import MonthView from "@/components/calendar/MonthView";
import WeekView from "@/components/calendar/WeekView";
import { useAcademicCalendar } from '@/contexts/AcademicCalendarContext';
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

const scheduleItemToCalendarCourse = (item: ScheduleItem, weekStart: moment.Moment): CalendarCourse => {
  const today = moment();
  const currentWeek = today.isoWeek();
  const itemWeekDay = Number(item.weekDay) || 1;
  
  // Parse weeks array from the API response
  let weeks: number[] = [];
  try {
    if (Array.isArray(item.weeks)) {
      weeks = item.weeks.map(w => typeof w === 'string' ? parseInt(w) : w);
    } else if (typeof item.weeks === 'string') {
      // If weeks is a string like "[1,2,3]", parse it
      weeks = JSON.parse(item.weeks);
    }
  } catch (error) {
    console.log('[scheduleItemToCalendarCourse] Error parsing weeks:', error);
    weeks = []; // Default to empty array if parsing fails
  }
  
  const courseDate = weekStart.add(itemWeekDay - 1, 'days').format('YYYY-MM-DD');
  
  console.log('[scheduleItemToCalendarCourse] Processing course:', {
    title: item.courseTitle,
    weekDay: item.weekDay,
    weeks: weeks,
    currentWeek: currentWeek,
    courseDate: courseDate
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
    time: `${moment(item.startTime, 'HH:mm:ss').format('HH:mm')} - ${moment(item.endTime, 'HH:mm:ss').format('HH:mm')}`,
    color: '#4A90E2',
    banner: item.courseCode.substring(0, 2),
    group: item.groupName,
    location: item.room,
    weeks: weeks,
    date: courseDate,
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
  const { calendarData } = useAcademicCalendar();
  
  const groupIndex = user?.academicInfo?.groupName 
    ? user.academicInfo.subgroupIndex 
      ? `${user.academicInfo.groupName}${user.academicInfo.subgroupIndex}`
      : user.academicInfo.groupName
    : 'N/A';

  useEffect(() => {
    if (scheduleItems) {
      // Seçili haftanın başı (Pazartesi)
      const weekStart = moment(selectedDate).startOf('isoWeek');
      const convertedCourses = scheduleItems.map(item => scheduleItemToCalendarCourse(item, weekStart));
      setCalendarCourses(convertedCourses);
    }
  }, [scheduleItems, selectedDate]);

  useEffect(() => {
    // Sadece seçili tarihe nokta koy
    setMarkedDates({
      [selectedDate]: { marked: true, dotColor: "#1a73e8", selected: true }
    });
  }, [selectedDate]);

  const getFilteredCourses = () => {
    const academicWeek = calendarData?.weekNumber ?? 0;
    //console.log('[getFilteredCourses] Academic week:', academicWeek);
    
    const filtered = calendarCourses.filter(course => {
      const shouldShow = !course.weeks || course.weeks.length === 0 || course.weeks.includes(academicWeek);
      //console.log('[getFilteredCourses] Course:', {
      //  title: course.title,
      //  weeks: course.weeks,
      //  shouldShow: shouldShow
      //});
      return shouldShow;
    });
    
    //console.log('[getFilteredCourses] Total courses:', calendarCourses.length);
    //console.log('[getFilteredCourses] Filtered courses:', filtered.length);
    
    return filtered;
  };

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

  const filteredCourses = getFilteredCourses();

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Day":
        return (
          <DayView
            selectedDate={selectedDate}
            courses={filteredCourses}
            events={filteredCourses}
          />
        );
      case "Week":
        return (
          <WeekView selectedDate={selectedDate} events={filteredCourses} />
        );
      case "Month":
        return (
          <MonthView
            selectedDate={selectedDate}
            markedDates={markedDates}
            onDateChange={setSelectedDate}
            events={filteredCourses}
            classes={filteredCourses.map(course => ({
              id: course.id,
              title: course.title,
              startTime: course.startTime,
              endTime: course.endTime,
              day: (course.weekDay || 1).toString(),
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