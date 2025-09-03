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
    weekDay: number;
    instructor: string;
    time: string;
    color: string;
    banner: string;
    date: string;
    group: string;
    location: string;
    weeks: number[];
    style: {
        backgroundColor: string;
        borderLeftWidth: number;
        borderLeftColor: string;
    };
}

export interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description?: string;
    type?: 'LECTURE' | 'LAB' | 'SEMINAR';
    style?: {
        backgroundColor: string;
        borderLeftWidth: number;
        borderLeftColor: string;
    };
}

export interface MarkedDates {
    [date: string]: {
        marked?: boolean;
        selected?: boolean;
        dotColor?: string;
    };
}

export interface Class {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    day: string;
    room: string;
    weeks?: number[];
}