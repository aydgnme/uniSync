import { Platform, StyleSheet } from 'react-native';

// Tailwind CSS color palette
const colors = {
  primary: '#3B82F6', // blue-500
  secondary: '#6B7280', // gray-500
  background: '#F9FAFB', // gray-50
  surface: '#FFFFFF',
  text: {
    primary: '#111827', // gray-900
    secondary: '#4B5563', // gray-600
    tertiary: '#9CA3AF', // gray-400
  },
  accent: '#F3F4F6', // gray-100
};

// Tailwind CSS spacing scale
const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: Platform.OS === 'ios' ? spacing[12] : spacing[10],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    backgroundColor: 'transparent',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing[1],
  },
  welcomeText: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: spacing[1],
    fontWeight: '500',
  },
  profileButton: {
    padding: spacing[2],
    borderRadius: spacing[6],
    backgroundColor: colors.accent,
  },
  content: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing[5],
    backgroundColor: colors.surface,
    marginBottom: spacing[2],
    borderRadius: spacing[3],
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: spacing[12],
    height: spacing[12],
    borderRadius: spacing[6],
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  quickActionLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  section: {
    backgroundColor: colors.surface,
    padding: spacing[5],
    marginBottom: spacing[2],
    borderRadius: spacing[3],
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing[4],
    color: colors.text.primary,
  },
  classCard: {
    backgroundColor: colors.accent,
    padding: spacing[4],
    borderRadius: spacing[3],
    marginBottom: spacing[2],
  },
  classTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  classTimeText: {
    marginLeft: spacing[2],
    color: colors.primary,
    fontWeight: '500',
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing[2],
    color: colors.text.primary,
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  classLocation: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  classProfessor: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  announcementCard: {
    backgroundColor: colors.accent,
    padding: spacing[4],
    borderRadius: spacing[3],
    marginBottom: spacing[2],
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
  announcementType: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: spacing[3],
  },
  announcementDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});

export default styles; 

