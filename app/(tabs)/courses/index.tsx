import CourseCard from '@/components/course/CourseCard';
import { useCourses } from '@/hooks/useCourses';
import { useProfile } from '@/hooks/useProfile';
import { styles } from '@/styles/course.styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from 'react-native';

const CoursesScreen = () => {
    const router = useRouter();
    const { user, loading } = useProfile();
    const studentId = user?.id || '';
    const { courses, loading: coursesLoading, error, refetch } = useCourses(studentId);
    
    const groupIndex = user?.academicInfo?.groupName 
      ? user.academicInfo.subgroupIndex 
        ? `${user.academicInfo.groupName}${user.academicInfo.subgroupIndex}`
        : user.academicInfo.groupName
      : 'N/A';

    console.log('CoursesScreen - courses:', courses);
    console.log('CoursesScreen - loading:', coursesLoading);
    console.log('CoursesScreen - error:', error);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Courses</Text>
                    <Text style={styles.headerSubtitle}>{groupIndex}</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1a73e8" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Courses</Text>
                <Text style={styles.headerSubtitle}>{groupIndex}</Text>
            </View>
            <FlatList
                data={courses}
                renderItem={({ item }) => (
                    <CourseCard
                        course={item}
                        onPress={() => router.push(`/courses/${item.id}`)}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default CoursesScreen;
