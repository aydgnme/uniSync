import { styles } from '@/styles/semesterList.styles';
import { Course } from '@/types/grades';
import React from 'react';
import { Text, View } from 'react-native';
import GradeCard from './GradeCard';

interface SemesterListProps {
    semesterData: {
        year: string;
        semester: string;
        courses: Course[];
    };
}

const SemesterList: React.FC<SemesterListProps> = ({ semesterData }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.semesterTitle}>Semester {semesterData.semester}</Text>
            {semesterData.courses.map((course) => (
                <GradeCard 
                    key={course.code} 
                    course={{
                        id: course.code,
                        name: course.title,
                        code: course.code,
                        credits: course.credits,
                        grade: course.totalGrade
                    }} 
                />
            ))}
        </View>
    );
};

export default React.memo(SemesterList);
