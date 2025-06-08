import { useAcademicCalendar } from "@/contexts/AcademicCalendarContext";
import { styles } from "@/styles/calendar.styles";
import moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Course {
  id: string;
  code?: string;
  title: string;
  type: "LECTURE" | "SEMINAR" | "LAB";
  startTime?: string;
  endTime?: string;
  time?: string;
  duration: number;
  room?: string;
  location?: string;
  teacher: string;
  weekDay?: number;
  date?: string;
  style?: {
    backgroundColor: string;
    borderLeftColor: string;
    borderLeftWidth: number;
  };
  weeks?: number[];
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
  let startTime, endTime;

  if (course.time) {
    [startTime, endTime] = course.time.split(" - ");
  } else if (course.startTime && course.endTime) {
    startTime = course.startTime;
    endTime = course.endTime;
  } else {
    return { top: 0, height: 0 };
  }

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const dayStartMinutes = START_HOUR * 60;

  const top = ((startMinutes - dayStartMinutes) / 60) * HOUR_HEIGHT;
  const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;

  // Ensure minimum height for course block
  return { top, height: Math.max(height, 40) };
};

const getCourseStyle = (course: Course) => {
  if (course.style) {
    return {
      backgroundColor: course.style.backgroundColor,
      borderLeftColor: course.style.borderLeftColor,
      borderLeftWidth: course.style.borderLeftWidth,
      textColor: course.style.borderLeftColor,
    };
  }

  if (course.type === "LECTURE") {
    return {
      backgroundColor: "#FFF5D4",
      borderLeftColor: "#FFB74D",
      borderLeftWidth: 4,
      textColor: "#FFB74D",
    };
  } else if (course.type === "LAB") {
    return {
      backgroundColor: "#E9F5FF",
      borderLeftColor: "#2196F3",
      borderLeftWidth: 4,
      textColor: "#2196F3",
    };
  } else if (course.type === "SEMINAR") {
    return {
      backgroundColor: "#FFF3E0",
      borderLeftColor: "#FB8C00",
      borderLeftWidth: 4,
      textColor: "#FB8C00",
    };
  } else {
    // Default
    return {
      backgroundColor: "#E9F5FF",
      borderLeftColor: "#2196F3",
      borderLeftWidth: 4,
      textColor: "#2196F3",
    };
  }
};

const DayView: React.FC<DayViewProps> = ({ selectedDate, courses }) => {
  const { calendarData } = useAcademicCalendar();
  const selectedDayOfWeek = moment(selectedDate).isoWeekday();

  // Remove week restriction and show all classes for the selected day
  const filteredCourses = courses.filter((course) => {
    return course.weekDay === selectedDayOfWeek;
  });

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

        {filteredCourses.map((course) => {
          const { top, height } = calculateCoursePosition(course, selectedDate);
          const courseStyle = getCourseStyle(course);

          // Add week indicator
          const weekIndicator = course.weeks ? `Weeks: ${course.weeks.join(', ')}` : '';

          // Güvenli saat bilgisi
          const displayTime =
            course.time ||
            [
              course.startTime && course.endTime
                ? `${course.startTime} - ${course.endTime}`
                : "",
            ].join("");

          return (
            <View
              key={course.id}
              style={[
                stylesDay.courseCard,
                {
                  top,
                  height,
                  backgroundColor: courseStyle.backgroundColor,
                  borderLeftColor: courseStyle.borderLeftColor,
                  borderLeftWidth: courseStyle.borderLeftWidth,
                },
              ]}
            >
              <View style={stylesDay.courseTimeLocation}>
                <View style={stylesDay.courseTime}>
                  <Icon
                    name="time-outline"
                    size={16}
                    color={courseStyle.textColor}
                  />
                  <Text
                    style={[
                      styles.courseTimeText,
                      { color: courseStyle.textColor, marginLeft: 4 },
                    ]}
                  >
                    {displayTime}
                  </Text>
                </View>
                <View style={stylesDay.courseLocation}>
                  <Icon
                    name="location-outline"
                    size={16}
                    color={courseStyle.textColor}
                  />
                  <Text
                    style={[
                      styles.courseLocationText,
                      { color: courseStyle.textColor, marginLeft: 4 },
                    ]}
                  >
                    {course.location || course.room || "-"}
                  </Text>
                </View>
              </View>
              <Text
                style={[stylesDay.courseTitle, { color: "#020202" }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {course.title}
              </Text>
              <Text
                style={[stylesDay.courseTeacher, { color: "#010101" }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {course.teacher}
              </Text>
              {weekIndicator && (
                <Text style={stylesDay.courseGroup}>
                  {weekIndicator}
                </Text>
              )}
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
    paddingHorizontal: 8,
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
    width: 48,
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
    left: 72, // biraz daha sağa kaydırıldı
    right: 16,
    marginVertical: 4,
    borderRadius: 16,
    backgroundColor: "#E9F5FF",
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    padding: 16,
    minHeight: 40,
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