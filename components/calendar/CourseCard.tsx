import { styles } from '@/styles/calendar.styles';
import { Course as CalendarCourse } from '@/types//calendar.type';
import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CourseCardProps {
    course: CalendarCourse;
}

const LECTURE_COLOR = '#FB8C00';
const COURSE_COLOR = '#007AFF';
const SEMINAR_COLOR = '#43A047';

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const isLectureOrSeminar = course.type === 'lecture' || course.type === 'seminar';
    const backgroundColor = isLectureOrSeminar ? '#FFE0B2' : '#E3F2FD';
    const borderColor = course.type === 'lecture' ? LECTURE_COLOR : 
                       course.type === 'seminar' ? SEMINAR_COLOR : COURSE_COLOR;

    return (
        <View style={[styles.eventCard, { backgroundColor, borderLeftColor: borderColor }]}>  
            <View style={styles.eventTimeLocation}>
                <View style={styles.eventTimeContainer}>
                    <Icon name="time-outline" size={16} color={borderColor} />
                    <Text style={[styles.eventInfo, { color: borderColor }]}>{course.time}</Text>
                </View>
                <View style={styles.eventLocationContainer}>
                    <Icon name="location-outline" size={16} color={borderColor} />
                    <Text style={[styles.eventInfo, { color: borderColor }]}>{course.location}</Text>
                </View>
            </View>
            <Text style={styles.eventTitle}>{course.title}</Text>
            {course.teacher && <Text style={styles.eventTeacher}>{course.teacher}</Text>}
            {course.group && <Text style={styles.eventGroup}>{course.group}</Text>}
        </View>
    );
};

export default CourseCard;