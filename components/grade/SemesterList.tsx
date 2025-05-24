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
                    key={course.id} 
                    course={{
                        id: course.id,
                        name: course.name,
                        code: course.code,
                        credits: 3,
                        grade: course.grade
                    }} 
                />
            ))}
        </View>
    );
};

export default React.memo(SemesterList);
