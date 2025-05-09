export type CourseType = 'LECTURE' | 'LAB' | 'SEMINAR';
export type ParityType = 'ALL' | 'EVEN' | 'ODD';

export interface ScheduleEntry {
  id: string;
  code: string;
  title: string;
  type: "LECTURE" | "LAB" | "SEMINAR";
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  duration: number;  // dakika
  room: string;
  teacher: string;
  group: string;
  subgroup: string;
  weeks: number[];
  parity: "ODD" | "EVEN" | "ALL";
  weekDay: number;   // 1 (Monday) ... 7 (Sunday)
}

export interface Course {
  id: string;
  code: string;
  title: string;
  type: CourseType;
  startTime: string;
  endTime: string;
  duration: number;
  room: string;
  teacher: string;
  group: string;
  subgroup: string;
  parity: ParityType;
  weekDay: number;
  date?: string;
  color?: string;
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

