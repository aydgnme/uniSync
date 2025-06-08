import { styles } from '@/styles/calendar.styles';
import { Course as CalendarCourse } from '@/types//calendar.type';
import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CourseCardProps {
    course: CalendarCourse;
}

const getCourseStyle = (type: string) => {
    switch (type) {
        case 'LECTURE':
            return {
                backgroundColor: '#FFF3E0',
                borderColor: '#FB8C00',
                textColor: '#FB8C00'
            };
        case 'SEMINAR':
            return {
                backgroundColor: '#FFF5D4',
                borderColor: '#FFB74D',
                textColor: '#FFB74D'
            };
        case 'LAB':
            return {
                backgroundColor: '#E9F5FF',
                borderColor: '#2196F3',
                textColor: '#2196F3'
            };
        default:
            return {
                backgroundColor: '#E9F5FF',
                borderColor: '#2196F3',
                textColor: '#2196F3'
            };
    }
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const courseStyle = getCourseStyle(course.type);

    return (
        <View style={[
            styles.eventCard, 
            { 
                backgroundColor: courseStyle.backgroundColor,
                borderLeftColor: courseStyle.borderColor,
                borderLeftWidth: 4,
                borderRadius: 12,
                padding: 16,
                marginVertical: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
            }
        ]}>  
            <View style={styles.eventTimeLocation}>
                <View style={styles.eventTimeContainer}>
                    <Icon name="time-outline" size={16} color={courseStyle.textColor} />
                    <Text style={[styles.eventInfo, { color: courseStyle.textColor, marginLeft: 4 }]}>
                        {course.time}
                    </Text>
                </View>
                <View style={styles.eventLocationContainer}>
                    <Icon name="location-outline" size={16} color={courseStyle.textColor} />
                    <Text style={[styles.eventInfo, { color: courseStyle.textColor, marginLeft: 4 }]}>
                        {course.location || course.room || '-'}
                    </Text>
                </View>
            </View>
            <Text style={[styles.eventTitle, { color: '#020202', marginTop: 8 }]}>
                {course.title}
            </Text>
            {course.teacher && (
                <Text style={[styles.eventTeacher, { color: '#010101', marginTop: 4 }]}>
                    {course.teacher.full_name}
                </Text>
            )}
            {course.group && (
                <Text style={[styles.eventGroup, { 
                    backgroundColor: courseStyle.backgroundColor,
                    color: courseStyle.textColor,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                    alignSelf: 'flex-start',
                    marginTop: 8
                }]}>
                    {course.group}
                </Text>
            )}
        </View>
    );
};

export default CourseCard;