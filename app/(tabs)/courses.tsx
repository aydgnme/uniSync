import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

type CourseCardProps = {
  title: string;
  code: string;
  instructor: string;
  progress: number;
};

export default function CoursesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const CourseCard = ({ title, code, instructor, progress }: CourseCardProps) => (
    <TouchableOpacity style={styles.courseCard}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle}>{title}</Text>
        <Text style={styles.courseCode}>{code}</Text>
      </View>
      <Text style={styles.instructorName}>{instructor}</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
        <Text style={styles.progressText}>{progress}% Completed</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Courses</Text>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="filter-variant" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.coursesContainer}>
        <CourseCard
          title="Data Structures and Algorithms"
          code="BLM2001"
          instructor="Dr. John Smith"
          progress={75}
        />
        <CourseCard
          title="Database Management Systems"
          code="BLM2003"
          instructor="Prof. Dr. Sarah Johnson"
          progress={60}
        />
        {/* Additional course cards will be added here */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterButton: {
    padding: 8,
  },
  coursesContainer: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  courseCode: {
    fontSize: 14,
    color: Colors.light.grey,
    marginLeft: 8,
  },
  instructorName: {
    fontSize: 14,
    color: Colors.light.grey,
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.light.grey,
  },
}); 