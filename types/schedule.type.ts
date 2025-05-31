export type CourseType = 'LECTURE' | 'LAB' | 'SEMINAR';
export type ParityType = 'ALL' | 'EVEN' | 'ODD';

export interface ScheduleEntry {
  id: string;
  code: string;
  title: string;
  type: "LECTURE" | "LAB" | "SEMINAR";
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  duration: number;  // minutes
  room: string;
  teacher: string;
  group: string;
  subgroup: string;
  weeks: number[];
  parity: "ODD" | "EVEN" | "ALL";
  weekDay: number;   // 1 (Monday) ... 7 (Sunday)
}

// Course type for schedule API response
export interface Course {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  weekDay: number; // 1 (Monday) - 7 (Sunday)
  startTime: string; // "HH:mm:ss"
  endTime: string;   // "HH:mm:ss"
  room: string;
  parity: string; // "all" | "ODD" | "EVEN"
  groupId: string;
  groupName: string;
  weeks: number[];
}

export interface ScheduleResponse {
  success: boolean;
  group: string;
  subgroup: string;
  weekNumber: number;
  parity: ParityType;
  courses: Course[];
}

export interface ScheduleState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  weekNumber: number;
  parity: ParityType;
}

export interface TodayScheduleResponse {
  success: boolean;
  data: {
    day: number;
    dayName: string;
    weekNumber: number;
    parity: string;
    courses: Course[];
  };
}

