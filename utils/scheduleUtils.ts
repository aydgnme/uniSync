import { Course } from '@/types/course.type';
import { ScheduleItem } from '@/types/schedule.type';
import moment from 'moment';

const WEEKDAY_TO_NUMBER: Record<string, number> = {
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
  'Sunday': 7
};

// Helper function to generate a color based on course type
const getCourseColor = (type: string): string => {
  switch (type) {
    case 'LECTURE':
      return '#E9F5FF';
    case 'LAB':
      return '#FFF3E0';
    case 'SEMINAR':
      return '#FFF5D4';
    default:
      return '#E9F5FF';
  }
};

export function mapScheduleToCoursesByWeek(selectedDate: string, scheduleItems: ScheduleItem[]): Course[] {
  // Get the ISO week number for the selected date
  const selectedWeek = moment(selectedDate).isoWeek();
  
  // Filter schedule items for the current week
  const relevantItems = scheduleItems.filter(item => 
    Array.isArray(item.weeks) && item.weeks.includes(selectedWeek)
  );

  // Map schedule items to Course objects
  const courses = relevantItems.map(item => {
    const weekDayNumber = WEEKDAY_TO_NUMBER[item.weekDay];
    
    // Calculate the date for this course based on the selected date and weekDay
    const courseDate = moment(selectedDate)
      .isoWeek(selectedWeek)
      .isoWeekday(weekDayNumber)
      .format('YYYY-MM-DD');

    // Calculate duration in minutes
    const startMoment = moment(item.startTime, 'HH:mm:ss');
    const endMoment = moment(item.endTime, 'HH:mm:ss');
    const duration = endMoment.diff(startMoment, 'minutes');

    const startTime = moment(item.startTime, 'HH:mm:ss').format('HH:mm');
    const endTime = moment(item.endTime, 'HH:mm:ss').format('HH:mm');

    return {
      id: item.scheduleId,
      title: item.courseTitle,
      code: item.courseCode,
      type: item.courseType as 'LECTURE' | 'LAB' | 'SEMINAR',
      teacher: item.teacherName,
      room: item.room,
      weekDay: weekDayNumber,
      startTime,
      endTime,
      duration,
      instructor: item.teacherName,
      time: `${startTime} - ${endTime}`,
      color: getCourseColor(item.courseType),
      banner: item.courseCode.substring(0, 2)
    };
  });

  // Sort courses by weekDay and startTime
  return courses.sort((a, b) => {
    if (a.weekDay !== b.weekDay) {
      return a.weekDay - b.weekDay;
    }
    return a.startTime.localeCompare(b.startTime);
  });
} 