// src/types/schedule.type.ts

export interface Course {
    code: string;
    title: string;
    type: 'LECTURE' | 'LAB' | 'SEMINAR';
    startTime: string;
    endTime: string;
    duration: number;
    room: string;
    teacher: string;
    weekDay: number;  // 1: Monday, 7: Sunday
  }
  
  export interface Schedule {
    group: string;
    subgroup: string;
    weekNumber: number;
    courses: Course[];
  }