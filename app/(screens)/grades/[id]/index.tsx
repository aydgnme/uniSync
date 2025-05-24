import { useGrades } from '@/hooks/useGrades';
import { styles } from '@/styles/gradeDetails.styles';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

const GradeDetails = () => {
    const { id } = useLocalSearchParams();
    const { grades } = useGrades();

    const course = useMemo(() => {
        return grades.find(grade => grade._id === id);
    }, [grades, id]);

    if (!course) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Course information not found.</Text>
            </View>
        );
    }

    const getGradeColor = (grade: number) => {
        if (grade >= 8) return '#4CAF50'; // Good (Green)
        if (grade >= 5) return '#FF9800'; // Medium (Orange)
        return '#F44336'; // Failed (Red)
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.courseName}>{course.lecture.title}</Text>
                <Text style={styles.courseCode}>Course Code: {course.lecture.code}</Text>
            </View>
            
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Total Grade</Text>
                    <Text style={[styles.infoValue, { color: getGradeColor(course.totalGrade) }]}> 
                        {course.totalGrade.toFixed(1)}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text style={[styles.infoValue, { 
                        color: course.status === 'PASSED' ? '#4CAF50' : '#F44336' 
                    }]}> 
                        {course.status === 'PASSED' ? 'Passed' : 'Failed'}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Retake Count</Text>
                    <Text style={styles.infoValue}>{course.retakeCount}</Text>
                </View>
            </View>

            <View style={styles.examsContainer}>
                <Text style={styles.sectionTitle}>Grade Details</Text>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Midterm</Text>
                    <View style={styles.examDetails}>
                        <Text style={[styles.examScore, { color: getGradeColor(course.midtermGrade) }]}> 
                            {course.midtermGrade}
                        </Text>
                        <Text style={styles.examWeight}>30%</Text>
                    </View>
                </View>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Final</Text>
                    <View style={styles.examDetails}>
                        <Text style={[styles.examScore, { color: getGradeColor(course.finalGrade) }]}> 
                            {course.finalGrade}
                        </Text>
                        <Text style={styles.examWeight}>40%</Text>
                    </View>
                </View>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Homework</Text>
                    <View style={styles.examDetails}>
                        <Text style={[styles.examScore, { color: getGradeColor(course.homeworkGrade) }]}> 
                            {course.homeworkGrade}
                        </Text>
                        <Text style={styles.examWeight}>20%</Text>
                    </View>
                </View>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Attendance</Text>
                    <View style={styles.examDetails}>
                        <Text style={[styles.examScore, { color: getGradeColor(course.attendanceGrade) }]}> 
                            {course.attendanceGrade}
                        </Text>
                        <Text style={styles.examWeight}>10%</Text>
                    </View>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Last Updated</Text>
                    <Text style={styles.infoValue}>
                        {new Date(course.lastUpdated).toLocaleDateString('en-US')}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default GradeDetails;