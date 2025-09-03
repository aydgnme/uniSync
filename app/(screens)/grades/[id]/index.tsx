import { useGrades } from '@/hooks/useGrades';
import { styles } from '@/styles/gradeDetails.styles';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

const GradeDetails = () => {
    const { id } = useLocalSearchParams();
    const { grades } = useGrades();

    const course = useMemo(() => {
        return grades.find(grade => grade.student_id === id);
    }, [grades, id]);

    const getGradeColor = (grade: number) => {
        if (grade >= 8) return '#4CAF50'; // Good (Green)
        if (grade >= 5) return '#FF9800'; // Medium (Orange)
        return '#F44336'; // Failed (Red)
    };

    const totalGrade = useMemo(() => {
        if (!course) return 0;
        const midterm = course.midterm_score * parseFloat(course.midterm_weight);
        const final = course.final_score * parseFloat(course.final_weight);
        const project = course.project_score ? course.project_score * parseFloat(course.project_weight || '0') : 0;
        const homework = course.homework_score ? course.homework_score * parseFloat(course.homework_weight || '0') : 0;
        return midterm + final + project + homework;
    }, [course]);

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
                <Text style={styles.courseName}>{course.course_title}</Text>
                <Text style={styles.courseCode}>Course Code: {course.course_code}</Text>
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
                    <Text style={styles.infoLabel}>Credits</Text>
                    <Text style={styles.infoValue}>{course.credits}</Text>
                </View>
            </View>

            {/* Academic Year, Semester, Instructor Row */}
            <View style={[styles.infoContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f5f5f5', borderRadius: 12, padding: 12, marginBottom: 16 }]}> 
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>Academic Year</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>{course.academic_year}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 11, color: '#888', textAlign: 'center' }}>Semester</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>{course.semester}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Text style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>Instructor</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, textAlign: 'center', flexWrap: 'wrap' }}>{course.teacher_names}</Text>
                </View>
            </View>

            <View style={styles.examsContainer}>
                <Text style={styles.sectionTitle}>Grade Details</Text>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Midterm</Text>
                    <View style={styles.examDetails}>
                        <Text style={[styles.examScore, { color: getGradeColor(course.midterm_score)}]}> 
                            {course.midterm_score}
                        </Text>
                        <Text style={styles.examWeight}>{parseFloat(course.midterm_weight) * 100}%</Text>
                    </View>
                </View>
                <View style={styles.examRow}>
                    <Text style={styles.examType}>Final</Text>
                    <View style={styles.examDetails}>
                        <Text style={[styles.examScore, { color: getGradeColor(course.final_score) }]}> 
                            {course.final_score}
                        </Text>
                        <Text style={styles.examWeight}>{parseFloat(course.final_weight) * 100}%</Text>
                    </View>
                </View>
                {course.project_score !== null && (
                    <View style={styles.examRow}>
                        <Text style={styles.examType}>Project</Text>
                        <View style={styles.examDetails}>
                            <Text style={[styles.examScore, { color: getGradeColor(course.project_score) }]}> 
                                {course.project_score}
                            </Text>
                            <Text style={styles.examWeight}>{parseFloat(course.project_weight || '0') * 100}%</Text>
                        </View>
                    </View>
                )}
                {course.homework_score !== null && (
                    <View style={styles.examRow}>
                        <Text style={styles.examType}>Homework</Text>
                        <View style={styles.examDetails}>
                            <Text style={[styles.examScore, { color: getGradeColor(course.homework_score) }]}> 
                                {course.homework_score}
                            </Text>
                            <Text style={styles.examWeight}>{parseFloat(course.homework_weight || '0') * 100}%</Text>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default GradeDetails;