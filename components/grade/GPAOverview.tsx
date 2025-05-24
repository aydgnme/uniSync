import { styles } from '@/styles/gpaOverview.styles';
import { Course } from '@/types/grades';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

interface GPAOverviewProps {
    gradesData: {
        year: string;
        semester: string;
        courses: Course[];
    }[];
}

const GPAOverview: React.FC<GPAOverviewProps> = ({ gradesData }) => {
    const gpa = useMemo(() => {
        let totalCredits = 0;
        let weightedSum = 0;

        gradesData.forEach((semester) => {
            semester.courses.forEach((course) => {
                if (course.status === "PASSED") {
                    totalCredits += course.credits;
                    weightedSum += course.credits * course.grade;
                }
            });
        });

        return totalCredits > 0 ? (weightedSum / totalCredits) : 0;
    }, [gradesData]);

    return (
        <View style={styles.container}>
            <Text style={styles.gpaTitle}>Overall GPA</Text>
            <Text style={styles.gpaValue}>{gpa.toFixed(2)}</Text>
        </View>
    );
};

export default React.memo(GPAOverview);
