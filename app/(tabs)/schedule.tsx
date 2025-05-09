import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

export default function ScheduleScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weekly Schedule</Text>
      </View>

      {/* Weekly schedule content will be added here */}
      <View style={styles.scheduleContainer}>
        <Text style={styles.dayTitle}>Monday</Text>
        {/* Course cards will be added here */}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scheduleContainer: {
    padding: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
}); 