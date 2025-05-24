export interface Course {
    id: string;
    date: string;
    title: string;
    time: string;
    location: string;
    duration: number;
    type: 'lecture' | 'course' | 'seminar';
    teacher: string;
    group: string;
    weeks?: number[];
    style?: {
        backgroundColor: string;
        borderLeftWidth: number;
        borderLeftColor: string;
    };
}
  
export interface Event {
    id: string;
    date: string;
    title: string;
    time: string;
    location: string;
    description?: string;
    organizer?: string;
}
  
export interface MarkedDates {
    [date: string]: {
        marked: boolean;
        dotColor: string;
        selected?: boolean;
    };
}

export interface Class {
    id: string;
    title: string;    // This is required but missing in your data
    startTime: string;
    endTime: string;
    day: string;      // Note: Your data uses number, needs to be string
    room: string;
}