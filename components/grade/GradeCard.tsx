import { styles } from '@/styles/gradeCard.styles';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface GradeCardProps {
    course: {
        id: string;
        name: string;
        code: string;
        credits: number;
        grade: number;
    };
}

const GradeCard: React.FC<GradeCardProps> = ({ course }) => {
    const getGradeColor = (grade: number) => {
        if (grade >= 8) return '#4CAF50'; // Good (Green)
        if (grade >= 5) return '#FF9800'; // Medium (Orange)
        return '#F44336'; // Failed (Red)
    };

    const handlePress = () => {
        router.push(`/grades/${course.id}`);
    };

    return (
        <Pressable onPress={handlePress} style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseCode}>{course.code}</Text>
            </View>
            <View style={styles.gradeContainer}>
                <Text style={[styles.grade, { color: getGradeColor(course.grade) }]}>{course.grade}</Text>
                <Text style={styles.credits}>{course.credits} Credits</Text>
            </View>
        </Pressable>
    );
};

export default GradeCard;
