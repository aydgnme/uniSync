import { styles } from "@/styles/calendar.styles";
import moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

interface Course {
    id: string;
    code: string;
    title: string;
    type: 'LECTURE' | 'SEMINAR' | 'LAB';
    startTime: string;
    endTime: string;
    duration: number;
    room: string;
    teacher: string;
    weekDay: number;
    date?: string;
}

interface DayViewProps {
    selectedDate: string;
    courses: Course[];
    events: Course[];
}

const START_HOUR = 8;
const END_HOUR = 21;
const HOUR_HEIGHT = 60;

const calculateCoursePosition = (course: Course, selectedDate: string) => {
    if (!course.startTime || !course.endTime) {
        // Defensive: If times are missing, don't render the course
        return { top: 0, height: 0 };
    }
    const [startHour, startMinute] = course.startTime.split(":").map(Number);
    const [endHour, endMinute] = course.endTime.split(":").map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const dayStartMinutes = START_HOUR * 60;
    
    const top = ((startMinutes - dayStartMinutes) / 60) * HOUR_HEIGHT;
    const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;
    
    return { top, height };
};

const DayView: React.FC<DayViewProps> = ({ selectedDate, courses }) => {
    const hours = Array.from(
        { length: END_HOUR - START_HOUR + 1 },
        (_, i) => START_HOUR + i
    );

    // Convert moment's day (0-6) to API's weekDay format (1-7)
    const selectedDayOfWeek = moment(selectedDate).isoWeekday();
    console.log('DayView - Selected date:', selectedDate);
    console.log('DayView - Selected day of week:', selectedDayOfWeek);
    console.log('DayView - Available courses:', courses);
    
    const filteredCourses = courses.filter(course => course.date === selectedDate);

    console.log('DayView - Filtered courses:', filteredCourses);

    return (
        <ScrollView style={stylesDay.dayView}>
            <View style={stylesDay.timelineContainer}>
                {hours.map((hour) => (
                    <View key={hour} style={stylesDay.timeSlot}>
                        <View style={stylesDay.timeCell}>
                            <Text style={stylesDay.timeText}>
                                {hour.toString().padStart(2, "0")}
                            </Text>
                        </View>
                    </View>
                ))}

                {filteredCourses.map((course) => {
                    // Defensive: skip if startTime or endTime is missing
                    if (!course.startTime || !course.endTime) return null;
                    const { top, height } = calculateCoursePosition(course, selectedDate);
                    console.log('DayView - Rendering course:', {
                        courseTitle: course.title,
                        top,
                        height,
                        startTime: course.startTime,
                        endTime: course.endTime
                    });
                    const selected = moment(selectedDate); // selected day
                    const weekStart = selected.clone().startOf('isoWeek'); // Pazartesi
                    const courseDate = weekStart.clone().add(course.weekDay - 1, 'days').format('YYYY-MM-DD');
                    return (
                        <View
                            key={course.id}
                            style={[
                                stylesDay.courseCard,
                                {
                                    top,
                                    height,
                                    backgroundColor: course.type === 'LECTURE' ? '#E9F5FF' : '#FFF3E0',
                                    borderLeftColor: course.type === 'LECTURE' ? '#2196F3' : '#FB8C00',
                                },
                            ]}
                        >
                            <View style={stylesDay.courseTimeLocation}>
                                <View style={stylesDay.courseTime}>
                                    <Icon 
                                        name="time-outline" 
                                        size={16} 
                                        color={course.type === 'LECTURE' ? '#2196F3' : '#FB8C00'} 
                                    />
                                    <Text style={[
                                        styles.courseTimeText, 
                                        { 
                                            color: course.type === 'LECTURE' ? '#2196F3' : '#FB8C00',
                                            marginLeft: 4 
                                        }
                                    ]}> {`${course.startTime} - ${course.endTime}`} </Text>
                                </View>
                                <View style={stylesDay.courseLocation}>
                                    <Icon 
                                        name="location-outline" 
                                        size={16} 
                                        color={course.type === 'LECTURE' ? '#2196F3' : '#FB8C00'} 
                                    />
                                    <Text style={[
                                        styles.courseLocationText, 
                                        { 
                                            color: course.type === 'LECTURE' ? '#2196F3' : '#FB8C00',
                                            marginLeft: 4 
                                        }
                                    ]}> {course.room} </Text>
                                </View>
                            </View>
                            <Text style={[
                                stylesDay.courseTitle,
                                { color: '#020202' }
                            ]}>{course.title}</Text>
                            <Text style={[
                                stylesDay.courseTeacher,
                                { color: '#010101' }
                            ]}>{course.teacher}</Text>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default DayView;



const stylesDay = StyleSheet.create({
    dayView: {
        flex: 1,
        backgroundColor: "#F6F6F6",
    },
    timelineContainer: {
        position: "relative",
        flex: 1,
        minHeight: (21 - 8 + 1) * 60,
        paddingHorizontal: 16,
        marginVertical: 8,
    },
    timeSlot: {
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    timeCell: {
        position: "absolute",
        left: 0,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    },
    timeText: {
        fontSize: 14,
        color: "#999",
    },
    courseCard: {
        position: "absolute",
        left: 60,
        right: 16,
        marginVertical: 4,
        borderRadius: 16,
        backgroundColor: "#E9F5FF",
        borderLeftWidth: 4,
        borderLeftColor: "#007AFF",
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        zIndex: 2,
    },
    courseTimeLocation: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    courseTime: {
        flexDirection: "row",
        alignItems: "center",
    },
    courseLocation: {
        flexDirection: "row",
        alignItems: "center",
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    courseTeacher: {
        fontSize: 14,
        color: "#666",
        marginBottom: 2,
    },
    courseGroup: {
        fontSize: 12,
        color: "#999",
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: "flex-start",
    },
});