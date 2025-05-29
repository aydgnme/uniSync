import { Course } from '@/types/course.type';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface WeekCourseCardProps {
  course: Course;
}

const WeekCourseCard: React.FC<WeekCourseCardProps> = ({ course }) => {
  const formatTime = (time: string | undefined) => {
    if (!time) return '--:--';
    // If time is not in "HH:mm" format, convert it
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return '--:--';
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const startTime = course.startTime;
  const endTime = course.endTime;

  return (
    <View style={styles.card}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(startTime)}</Text>
        <View style={styles.timeDivider} />
        <Text style={styles.timeText}>{formatTime(endTime)}</Text>
        <Text style={styles.durationText}>{`${course.duration/60 || 0}h`}</Text>
      </View>
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: course.type === 'LAB' ? '#eaf4fb' : '#FFE0B2',
            borderLeftWidth: 3,
            borderLeftColor: course.type === 'LAB' ? '#2196F3' : '#FB8C00',
          },
        ]}
      >
        <Text style={styles.title}>{course.title}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={12} color="#666" />
            <Text style={styles.infoText}>{course.room}</Text>
          </View>
          <Text style={styles.teacherText}>{course.teacher}</Text>
          <Text style={styles.groupText}>{course.code}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 8,
    marginVertical: 4,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  timeContainer: {
    width: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  timeText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  timeDivider: {
    width: 20,
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 4,
  },
  durationText: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: '#eaf4fb',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#111',
  },
  detailsContainer: {
    gap: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    marginLeft: 4,
  },
  teacherText: {
    color: '#888',
    fontSize: 13,
    fontStyle: 'italic',
  },
  groupText: {
    color: '#888',
    fontSize: 13,
  },
});

export default WeekCourseCard;