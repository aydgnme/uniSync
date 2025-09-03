// src/types/schedule.type.ts

export interface Course {
    id: string;
    code: string;
    title: string;
    type: 'LECTURE' | 'LAB' | 'SEMINAR';
    startTime: string;
    endTime: string;
    duration: number;
    room: string;
    teacher: { full_name: string };
    weekDay: number;  // 1: Monday, 7: Sunday
    instructor: string;
    time: string;
    color: string;
    banner: string;
}
  
export interface Schedule {
    group: string;
    subgroup: string;
    weekNumber: number;
    courses: Course[];
}
