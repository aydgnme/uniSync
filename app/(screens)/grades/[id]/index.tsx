import { useGrades } from '@/hooks/useGrades';
import { styles } from '@/styles/gradeDetails.styles';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

const GradeDetails = () => {
    const { id } = useLocalSearchParams();
    const { grades } = useGrades();

    const course = useMemo(() => {
        return grades.find(grade => grade.id === id);
    }, [grades, id]);

    const getGradeColor = (grade: number) => {
        if (grade >= 8) return '#4CAF50'; // Good (Green)
        if (grade >= 5) return '#FF9800'; // Medium (Orange)
        return '#F44336'; // Failed (Red)
    };

    const getGradeByType = (type: 'midterm' | 'final' | 'homework' | 'attendance') => {
        const grade = grades.find(g => g.id === id && g.examType === type);
        return grade ? grade.score : 0;
    };

    const totalGrade = useMemo(() => {
        if (!course) return 0;
        const midterm = getGradeByType('midterm') * 0.3;
        const final = getGradeByType('final') * 0.4;
        const homework = getGradeByType('homework') * 0.2;
        const attendance = getGradeByType('attendance') * 0.1;
        return midterm + final + homework + attendance;
    }, [grades, id, course]);

    if (!course) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Course information not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.courseName}>{course.course.title}</Text>
                <Text style={styles.courseCode}>Course Code: {course.course.code}</Text>
            </View>
            
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Total Grade</Text>
                    <Text style={[styles.infoValue, { color: getGradeColor(totalGrade) }]}> 
                        {totalGrade.toFixed(1)}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text style={[styles.infoValue, { 
                        color: totalGrade >= 5 ? '#4CAF50' : '#F44336' 
                    }]}> 
                        {totalGrade >= 5 ? 'Passed' : 'Failed'}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Retake Count</Text>
                    <Text style={styles.infoValue}>0</Text>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Credits</Text>
                    <Text style={styles.infoValue}>{course.course.credits}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Academic Year</Text>
                    <Text style={styles.infoValue}>{course.academicYear}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Semester</Text>
                    <Text style={styles.infoValue}>{course.semester}</Text>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Instructor</Text>
                    <Text style={styles.infoValue}>{course.course.teacherName}</Text>
                </View>
            </View>

            <View style={styles.examsContainer}>
                <Text style={styles.sectionTitle}>Grade Details</Text>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Midterm</Text>
                    <View style={styles.examDetails}>
                        <Text style={[styles.examScore, { color: getGradeColor(getGradeByType('midterm')) }]}> 
                            {getGradeByType('midterm')}
                        </Text>
                        <Text style={styles.examWeight}>30%</Text>
                    </View>
                </View>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Final</Text>
                    <View style={styles.examDetails}>
                        <Text style={[styles.examScore, { color: getGradeColor(getGradeByType('final')) }]}> 
                            {getGradeByType('final')}
                        </Text>
                        <Text style={styles.examWeight}>40%</Text>
                    </View>
                </View>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Homework</Text>
                    <View style={styles.examDetails}>
                        <Text style={[styles.examScore, { color: getGradeColor(getGradeByType('homework')) }]}> 
                            {getGradeByType('homework')}
                        </Text>
                        <Text style={styles.examWeight}>20%</Text>
                    </View>
                </View>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Attendance</Text>
                    <View style={styles.examDetails}>
                        <Text style={[styles.examScore, { color: getGradeColor(getGradeByType('attendance')) }]}> 
                            {getGradeByType('attendance')}
                        </Text>
                        <Text style={styles.examWeight}>10%</Text>
                    </View>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Last Updated</Text>
                    <Text style={styles.infoValue}>
                        {new Date(course.gradedAt).toLocaleDateString('en-US')}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default GradeDetails;