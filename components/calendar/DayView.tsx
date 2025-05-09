import { styles } from "@/styles/calendar.styles";
import { Course } from "@/types/calendar.type";
import moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

interface DayViewProps {
  selectedDate: string;
  courses: Course[];
  events: Course[];
}

const START_HOUR = 8;
const END_HOUR = 21;
const HOUR_HEIGHT = 60;

const calculateCoursePosition = (course: Course, selectedDate: string) => {
    const [startTime, endTime] = course.time.split(" - ");
    const start = moment(`${selectedDate} ${startTime}`, "YYYY-MM-DD HH:mm");
    const end = moment(`${selectedDate} ${endTime}`, "YYYY-MM-DD HH:mm");
    const dayStart = moment(`${selectedDate} ${START_HOUR}:00`, "YYYY-MM-DD HH:mm");
    const offset = start.diff(dayStart, "minutes");
    const durationInMinutes = end.diff(start, "minutes");

    const top = (offset / 60) * HOUR_HEIGHT;
    const height = (durationInMinutes / 60) * HOUR_HEIGHT;
    return { top, height };
};

const DayView: React.FC<DayViewProps> = ({ selectedDate, courses }) => {
    const hours = Array.from(
        { length: END_HOUR - START_HOUR + 1 },
        (_, i) => START_HOUR + i
    );

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

                {courses.filter(course => course.date === selectedDate).map((course) => {
                    const { top, height } = calculateCoursePosition(course, selectedDate);
                    return (
                        <View
                            key={course.id}
                            style={[
                                stylesDay.courseCard,
                                {
                                    top,
                                    height,
                                },
                            ]}
                        >
                            <View style={stylesDay.courseTimeLocation}>
                                <View style={stylesDay.courseTime}>
                                    <Icon name="time-outline" size={16} color="#007AFF" />
                                    <Text style={[styles.courseTimeText, { color: "#007AFF", marginLeft: 4 }]}> {course.time} </Text>
                                </View>
                                <View style={stylesDay.courseLocation}>
                                    <Icon name="location-outline" size={16} color="#007AFF" />
                                    <Text style={[styles.courseLocationText, { color: "#007AFF", marginLeft: 4 }]}> {course.location} </Text>
                                </View>
                            </View>
                            <Text style={stylesDay.courseTitle}>{course.title}</Text>
                            <Text style={stylesDay.courseTeacher}>{course.teacher}</Text>
                            <Text style={stylesDay.courseGroup}>{course.group}</Text>
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
        minHeight: (21 - 8 + 1) * 60, // Saat 8:00 - 21:00
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