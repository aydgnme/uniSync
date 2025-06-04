import { Course } from '@/types/calendar.type';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface WeekCourseCardProps {
  course: Course;
}

const WeekCourseCard: React.FC<WeekCourseCardProps> = ({ course }) => {
  const formatTime = (time?: string) => {
    if (!time) return '--:--';
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return '--:--';
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const { title, teacher, room, startTime, endTime, duration, type, banner } = course;

  const isLab = type === 'LAB';
  const backgroundColor = isLab ? '#FFE0B2' : '#eaf4fb';
  const borderLeftColor = isLab ? '#FB8C00' : '#2196F3';

  return (
    <View style={styles.card}>
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{formatTime(startTime)}</Text>
        <View style={styles.timeDivider} />
        <Text style={styles.timeText}>{formatTime(endTime)}</Text>
        <Text style={styles.durationText}>{`${(duration || 0) / 60}h`}</Text>
      </View>

      <View style={[styles.infoBox, { backgroundColor, borderLeftColor }]}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.row}>
          <Icon name="location-outline" size={14} color="#666" />
          <Text style={styles.infoText}>{room || 'Unknown room'}</Text>
        </View>

        <Text style={styles.subInfo}>{teacher}</Text>
        <Text style={styles.subInfo}>{banner}</Text>
      </View>
    </View>
  );
};

export default WeekCourseCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  timeColumn: {
    width: 70,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeDivider: {
    height: 1,
    width: 24,
    backgroundColor: '#ccc',
    marginVertical: 4,
  },
  durationText: {
    fontSize: 11,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  infoBox: {
    flex: 1,
    padding: 12,
    borderLeftWidth: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 4,
  },
  subInfo: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});