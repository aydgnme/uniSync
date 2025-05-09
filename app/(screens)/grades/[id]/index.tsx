import { styles } from '@/styles/gradeDetails.styles';
import { Course, getCourseByCode } from '@/utils/courseUtils';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

const GradeDetails = () => {
    const { id } = useLocalSearchParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            setLoading(true);
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const courseDetails = getCourseByCode(id as string);
                setCourse(courseDetails);
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourseDetails();
        }
    }, [id]);

    const calculateWeightedAverage = (course: Course): string => {
        // Assuming midterm is 40% and final is 60% of the total grade
        const midtermWeight = 0.4;
        const finalWeight = 0.6;
        const weightedAverage = (course.midtermGrade * midtermWeight) + (course.finalGrade * finalWeight);
        return weightedAverage.toFixed(2);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!course) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Course not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.courseName}>{course.title}</Text>
                <Text style={styles.courseCode}>{course.code}</Text>
            </View>
            
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Credits</Text>
                    <Text style={styles.infoValue}>{course.credits}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Final Grade</Text>
                    <Text style={styles.infoValue}>{course.totalGrade}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text style={styles.infoValue}>{course.status}</Text>
                </View>
            </View>

            <View style={styles.examsContainer}>
                <Text style={styles.sectionTitle}>Grades</Text>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Midterm</Text>
                    <View style={styles.examDetails}>
                        <Text style={styles.examScore}>{course.midtermGrade}</Text>
                        <Text style={styles.examWeight}>40%</Text>
                    </View>
                </View>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Final</Text>
                    <View style={styles.examDetails}>
                        <Text style={styles.examScore}>{course.finalGrade}</Text>
                        <Text style={styles.examWeight}>60%</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default GradeDetails;