import DayView from "@/components/calendar/DayView";
import MonthView from "@/components/calendar/MonthView";
import WeekView from "@/components/calendar/WeekView";
import { useProfile } from "@/hooks/useProfile";
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
  console.log('Converting schedule course to calendar course:', course);
  
  // Calculate the date for the current week and course's weekDay
  let date = course.date;
  if (!date) {
    // Find the current week's first day (Monday)
    const today = moment();
    const currentWeekDay = today.isoWeekday(); // 1 (Monday) - 7 (Sunday)
    // course.weekDay: 1 (Monday) - 7 (Sunday)
    date = today.clone().add(course.weekDay - currentWeekDay, 'days').format('YYYY-MM-DD');
    console.log('Generated date for course:', { 
      courseTitle: course.title, 
      weekDay: course.weekDay, 
      currentWeekDay, 
      generatedDate: date 
    });
  }
  
  const typeMapping = {
    LAB: "lecture",
    LECTURE: "course",
    SEMINAR: "seminar",
  } as const;

  const calendarCourse = {
    id: course.id,
    date,
    title: course.title,
    time: `${course.startTime} - ${course.endTime}`,
    location: course.room,
    type: typeMapping[course.type],
    teacher: course.teacher,
    group: course.group,
    duration: course.duration,
    style: {
      backgroundColor: course.type === 'LAB' ? '#eaf4fb' : '#FFE0B2',
      borderLeftWidth: 3,
      borderLeftColor: course.type === 'LAB' ? '#2196F3' : '#FB8C00',
    }
  };
  
  console.log('Converted calendar course:', calendarCourse);
  return calendarCourse;
};

const ScheduleScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Day");
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [markedDates, setMarkedDates] = useState({});
  const { courses, todayCourses, isLoading, error, refreshSchedule } = useSchedule();
  const [calendarCourses, setCalendarCourses] = useState<CalendarCourse[]>([]);
  const { getGroup, getSubgroup, user } = useProfile();
  
  const groupIndex = user?.academicInfo?.groupName 
    ? user.academicInfo.subgroupIndex 
      ? `${user.academicInfo.groupName}${user.academicInfo.subgroupIndex}`
      : user.academicInfo.groupName
    : 'N/A';

  useEffect(() => {
    console.log('Schedule Screen - User Academic Info:', {
      facultyId: user?.academicInfo?.facultyId,
      specializationShortName: user?.academicInfo?.specializationShortName,
      groupName: user?.academicInfo?.groupName,
      subgroupIndex: user?.academicInfo?.subgroupIndex,
      groupIndex
    });
  }, [user]);

  useEffect(() => {
    console.log('Schedule Screen - Courses from API:', courses);
    const coursesToConvert = selectedTab === "Day" ? todayCourses : courses;
    const convertedCourses = coursesToConvert.map(scheduleCourseToCalendarCourse);
    console.log('Schedule Screen - Converted Calendar Courses:', convertedCourses);
    setCalendarCourses(convertedCourses);
  }, [courses, todayCourses, selectedTab]);

  useEffect(() => {
    console.log('Schedule Screen - Generating marked dates for courses:', calendarCourses);
    const marks: any = {};
    calendarCourses.forEach((course) => {
      marks[course.date] = { marked: true, dotColor: "#1a73e8" };
    });
    console.log('Schedule Screen - Generated marked dates:', marks);
    setMarkedDates(marks);
  }, [calendarCourses]);

  if (isLoading) {
    console.log('Schedule Screen - Loading state');
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
    console.log('Schedule Screen - Error state:', error);
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
              console.log('Schedule Screen - Retrying schedule fetch');
              refreshSchedule();
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
              startTime: course.time.split(" - ")[0],
              endTime: course.time.split(" - ")[1],
              day: moment(course.date).isoWeekday().toString(),
              room: course.location,
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
      ios: 20,
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
    backgroundColor: '#fff',
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
