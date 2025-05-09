import { styles } from '@/styles/course.styles';
import { Course } from '@/types/course.type';
import React from 'react';
import { View } from 'react-native';
import CourseCard from './CourseCard';

interface CourseListProps {
    courses: Course[];
    onCoursePress: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onCoursePress }) => {
    return (
        <View style={styles.courseListContainer}>
            {courses.map(course => (
                <CourseCard 
                    key={course.id} 
                    course={course} 
                    onPress={() => onCoursePress(course)} 
                />
            ))}
        </View>
    );
};

export default CourseList;