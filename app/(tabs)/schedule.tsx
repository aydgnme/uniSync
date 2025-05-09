import DayView from "@/components/calendar/DayView";
import MonthView from "@/components/calendar/MonthView";
import WeekView from "@/components/calendar/WeekView";
import { useSchedule } from "@/hooks/useSchedule";
import { styles } from "@/styles/calendar.styles";
import { Course as CalendarCourse } from "@/types/calendar.type";
import { Course } from "@/types/schedule.type";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const TABS = ["Day", "Week", "Month"];

const scheduleCourseToCalendarCourse = (course: Course): CalendarCourse => {
    const typeMapping = {
        'LAB': 'lecture',
        'LECTURE': 'course',
        'SEMINAR': 'seminar'
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
        duration: course.duration
    };
};

const ScheduleScreen: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState("Day");
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [markedDates, setMarkedDates] = useState({});
    const { courses, isLoading, error, refreshSchedule } = useSchedule();
    const [calendarCourses, setCalendarCourses] = useState<CalendarCourse[]>([]);

    useEffect(() => {
        const convertedCourses = courses.map(scheduleCourseToCalendarCourse);
        setCalendarCourses(convertedCourses);
    }, [courses]);

    useEffect(() => {
        const marks: any = {};
        calendarCourses.forEach(course => {
            marks[course.date] = { marked: true, dotColor: '#007AFF' };
        });
        setMarkedDates(marks);
    }, [calendarCourses]);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Classes</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Classes</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'red' }}>{error}</Text>
                    <TouchableOpacity onPress={refreshSchedule} style={{ marginTop: 10 }}>
                        <Text style={{ color: '#007AFF' }}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'Day':
                return <DayView selectedDate={selectedDate} courses={calendarCourses} events={calendarCourses} />;
            case 'Week':
                return <WeekView selectedDate={selectedDate} events={calendarCourses} />;
            case 'Month':
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
                <Text style={styles.headerTitle}>Classes</Text>
            </View>

            <View style={styles.tabContainer}>
                {TABS.map(tab => (
                    <TouchableOpacity 
                        key={tab} 
                        onPress={() => setSelectedTab(tab)} 
                        style={[styles.tab, selectedTab === tab && styles.selectedTab]}
                    >
                        <Text style={[styles.tabText, selectedTab === tab && { color: '#007AFF' }]}>
                            {tab === 'Day' ? 'Day' : tab === 'Week' ? 'Week' : 'Month'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {renderTabContent()}
        </SafeAreaView>
    );
};

export default ScheduleScreen;
