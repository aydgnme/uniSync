import CourseCard from '@/components/course/CourseCard';
import courses from '@/data/courses.json';
import { useProfile } from '@/hooks/useProfile';
import { styles } from '@/styles/course.styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

const CoursesScreen = () => {
    const router = useRouter();
    const { user, loading, getGroup, getSubgroup } = useProfile();
    
    const group = getGroup();
    const subgroup = getSubgroup();
    const groupIndex = group && subgroup ? `${group}${subgroup}` : 'N/A';

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#1a73e8" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
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
        </View>
    );
};

export default CoursesScreen;
