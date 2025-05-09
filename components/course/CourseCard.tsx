import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Course {
    id: string;
    code: string;
    title: string;
    instructor: string;
    room: string;
    time: string;
    color: string;
    banner: string;
}

interface CourseCardProps {
    course: Course;
    onPress: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={[styles.banner, { backgroundColor: course.color }]}>
                <View style={styles.bannerContent}>
                    <Text style={styles.code}>{course.code}</Text>
                    <Text style={styles.title}>{course.title}</Text>
                    <Text style={styles.instructor}>{course.instructor}</Text>
                </View>
                <View style={styles.bannerOverlay}>
                    <ImageBackground
                        source={{ uri: course.banner }}
                        style={styles.bannerImage}
                        imageStyle={{ opacity: 0.2 }}
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