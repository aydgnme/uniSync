import GPAOverview from '@/components/grade/GPAOverview';
import NoGradesMessage from '@/components/grade/NoGradesMessage';
import SemesterList from '@/components/grade/SemesterList';
import YearDropdown from '@/components/grade/YearDropdown';
import { useGrades } from '@/hooks/useGrades';
import { styles } from '@/styles/grades.styles';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const GradesScreen = () => {
    const {
        loading,
        error,
        selectedYear,
        availableYears,
        currentYearData,
        handleYearChange,
        selectedSemester,
        handleSemesterChange
    } = useGrades();

    // Set initial year when available years are loaded
    useEffect(() => {
        if (availableYears.length > 0 && !selectedYear) {
            console.log('Setting initial year:', availableYears[0]);
            handleYearChange(availableYears[0]);
        }
    }, [availableYears, selectedYear, handleYearChange]);

    // Memoize semester list to prevent unnecessary re-renders
    const semesterList = useMemo(() => {
        if (loading) {
            return <NoGradesMessage message="Grades are loading..." />;
        }

        if (error) {
            return <NoGradesMessage message={error} />;
        }

        if (currentYearData.length === 0) {
            return <NoGradesMessage message="No grades found for this semester." />;
        }

        return currentYearData.map((semesterData) => (
            <SemesterList 
                key={`${semesterData.year}-${semesterData.semester}`} 
                semesterData={semesterData} 
            />
        ));
    }, [currentYearData, loading, error]);

    return (
        <View style={styles.container}>
            <YearDropdown 
                selectedYear={selectedYear} 
                setSelectedYear={handleYearChange}
                availableYears={availableYears}
            />
            <View style={{ flexDirection: 'row', marginVertical: 8, justifyContent: 'center' }}>
                {[1,2].map((sem) => (
                    <TouchableOpacity
                        key={sem}
                        style={{
                            backgroundColor: selectedSemester === sem ? '#1976D2' : '#E0E0E0',
                            borderRadius: 20,
                            paddingHorizontal: 18,
                            paddingVertical: 6,
                            marginHorizontal: 6
                        }}
                        onPress={() => handleSemesterChange(sem)}
                    >
                        <Text style={{ color: selectedSemester === sem ? '#fff' : '#333', fontWeight: 'bold' }}>
                            Semester {sem}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <GPAOverview gradesData={currentYearData} />
            <ScrollView style={styles.scrollContainer}>
                {semesterList}
            </ScrollView>
        </View>
    );
};

export default React.memo(GradesScreen);
