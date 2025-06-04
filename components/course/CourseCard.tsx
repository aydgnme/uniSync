import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Course {
    id: string;
    code: string;
    title: string;
    type: 'LECTURE' | 'LAB' | 'SEMINAR';
    room: string;
    time: string;
    color: string;
    teacher: {
        full_name: string;
    };
}

// Helper function to transform backend course to frontend format
export const transformBackendCourse = (backendCourse: any): Course => {
    return {
        id: backendCourse.course_id || '',
        code: backendCourse.course_code || '',
        title: backendCourse.course_title || '',
        type: (backendCourse.course_type || 'LECTURE') as 'LECTURE' | 'LAB' | 'SEMINAR',
        room: backendCourse.schedule_room || '',
        time: backendCourse.schedule_start_time && backendCourse.schedule_end_time 
            ? `${backendCourse.schedule_start_time} - ${backendCourse.schedule_end_time}`
            : '',
        color: '#4A90E2', // Default color
        teacher: {
            full_name: backendCourse.teacher_first_name && backendCourse.teacher_last_name
                ? `${backendCourse.teacher_first_name} ${backendCourse.teacher_last_name}`
                : 'Unknown Teacher'
        }
    };
};

interface CourseCardProps {
    course: Course;
    onPress: () => void;
}

const getBannerByType = (type: 'LECTURE' | 'LAB' | 'SEMINAR') => {
    switch (type) {
        case 'LAB':
            return require('@/assets/images/img_code.jpg');
        case 'LECTURE':
            return require('@/assets/images/img_bookclub.jpg');
        case 'SEMINAR':
            return require('@/assets/images/img_reachout.jpg');
        default:
            return require('@/assets/images/img_bookclub.jpg');
    }
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress}
            key={course.id}
        >
            <View style={[styles.banner, { backgroundColor: course.color }]}>
                <View style={styles.bannerContent}>
                    <Text style={styles.code}>{course.code}</Text>
                    <Text style={styles.title}>{course.title}</Text>
                    <Text style={styles.instructor}>{course.teacher.full_name}</Text>
                </View>
                <View style={styles.bannerOverlay}>
                    <ImageBackground
                        source={getBannerByType(course.type)}
                        style={styles.bannerImage}
                    />
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>{course.time}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>{course.room}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    banner: {
        height: 140,
        position: 'relative',
    },
    bannerContent: {
        padding: 16,
        height: '100%',
        justifyContent: 'flex-end',
        zIndex: 2,
    },
    bannerOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    code: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 4,
        opacity: 0.9,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    instructor: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    details: {
        padding: 16,
        backgroundColor: '#fff',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
});

export default CourseCard;