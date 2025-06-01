import { Dimensions, Platform, StyleSheet } from 'react-native';

export const PRIMARY_COLOR = '#007AFF';
export const SECONDARY_COLOR = '#E3F2FD';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: '#F2F2F2',
      android: '#F0F0F0',
    }),
    marginTop: -50,
  },
  content: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  header: {
    padding: 20,
    paddingTop: 100,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#202124',
  },
  dayHeader: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentDate: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  coursesHeader: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  coursesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  courseCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    margin: 8,
  },
  courseHeader: {
    marginBottom: 8,
  },
  courseTimeLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  courseTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseTimeText: {
    fontSize: 15,
    marginLeft: 4,
  },
  courseLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseLocationText: {
    fontSize: 15,
    marginLeft: 4,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  courseTeacher: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  courseGroup: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  headerContent: {
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    marginTop: 1,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 12,
    margin: 4,
  },
  selectedTab: {
    backgroundColor: '#F0F9FF',
  },
  tabText: {
    fontSize: 16,
    color: PRIMARY_COLOR,
  },
  calendar: {
    marginBottom: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  monthContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  activitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  eventList: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  eventTimeLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventInfo: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  noEventsContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  noEventsText: {
    color: '#666',
    fontSize: 14,
  },
  dayView: {
    flex: 1,
    backgroundColor: 'white',
  },
  timelineContainer: {
    flex: 1,
  },
  timeCell: {
    width: 50,
    paddingTop: 8,
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#E5E5E5',
  },
  timeText: {
    fontSize: 17,
    color: '#666',
    fontWeight: '400',
  },
  timeHeaderText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  timeSlot: {
    flexDirection: 'row',
    minHeight: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  timeSlotContent: {
    flex: 1,
  },
  weekView: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  weekText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  weekDaySection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  weekDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  weekDayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginRight: 8,
  },
  weekDayDate: {
    fontSize: 14,
    color: '#666',
  },
  weekItemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  weekItemTime: {
    marginBottom: 8,
  },
  weekItemTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
  },
  weekItemDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  weekItemContent: {
    flex: 1,
  },
  weekItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  weekItemDetails: {
    gap: 4,
  },
  weekItemLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weekItemInfo: {
    fontSize: 14,
    color: '#666',
  },
  weekItemTeacher: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  weekItemGroup: {
    fontSize: 14,
    color: '#666',
  },
  weekItemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
  weekItemOrganizer: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  labCell: {
    borderLeftWidth: 3,
    borderLeftColor: '#FB8C00',
    backgroundColor: '#FFF3E0',
  },
  cursCell: {
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY_COLOR,
    backgroundColor: SECONDARY_COLOR,
  },
  seminarCell: {
    borderLeftWidth: 3,
    borderLeftColor: '#43A047',
    backgroundColor: '#E8F5E9',
  },
  eventCell: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTeacher: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  eventGroup: {
    fontSize: 13,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  eventOrganizer: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  classCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  classTime: {
    fontSize: 14,
    color: '#424242',
    marginTop: 4,
  },
  classRoom: {
    fontSize: 14,
    color: '#616161',
    marginTop: 2,
  },
  weekHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  weekNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a73e8',
  },
  weekIndicator: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic'
  },
});
