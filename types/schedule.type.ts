export interface ScheduleItem {
  scheduleId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  courseType: string;
  teacherName: string;
  weekDay: string;
  startTime: string;
  endTime: string;
  room: string;
  parity: string;
  groupId: string;
  groupName: string;
  groupIndex: string;
  weeks: number[];
}