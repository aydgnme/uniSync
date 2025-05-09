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