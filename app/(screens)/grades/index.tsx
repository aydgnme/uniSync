import GPAOverview from '@/components/grade/GPAOverview';
import NoGradesMessage from '@/components/grade/NoGradesMessage';
import SemesterList from '@/components/grade/SemesterList';
import YearDropdown from '@/components/grade/YearDropdown';
import mockGrades from '@/data/grades.json';
import { styles } from '@/styles/grades.styles';
import { Course, SemesterData } from '@/types/grades';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

const GradesScreen = () => {
    // Memoize available years since it won't change during component lifecycle
    const availableYears = useMemo(() => {
        return mockGrades.years.map(year => year.year.toString());
    }, []);

    const [selectedYear, setSelectedYear] = useState<string>(availableYears[0]);

    // Memoize year selection handler
    const handleYearChange = useCallback((year: string) => {
        setSelectedYear(year);
    }, []);

    // Memoize current year data with proper dependency tracking
    const currentYearData = useMemo<SemesterData[]>(() => {
        const yearData = mockGrades.years.find(
            year => year.year.toString() === selectedYear
        );
        
        if (!yearData) return [];

        return yearData.semesters.map(semester => ({
            year: selectedYear,
            semester: semester.semester.toString(),
            courses: semester.courses as Course[]
        }));
    }, [selectedYear]);

    // Memoize semester list to prevent unnecessary re-renders
    const semesterList = useMemo(() => {
        if (currentYearData.length === 0) {
            return <NoGradesMessage />;
        }

        return currentYearData.map((semesterData) => (
            <SemesterList 
                key={`${semesterData.year}-${semesterData.semester}`} 
                semesterData={semesterData} 
            />
        ));
    }, [currentYearData]);

    return (
        <View style={styles.container}>
            <YearDropdown 
                selectedYear={selectedYear} 
                setSelectedYear={handleYearChange}
                availableYears={availableYears}
            />
            <GPAOverview gradesData={currentYearData} />
            <ScrollView style={styles.scrollContainer}>
                {semesterList}
            </ScrollView>
        </View>
    );
};

export default React.memo(GradesScreen);
