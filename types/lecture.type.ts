export interface Announcement {
    id: string;
    text: string;
    date: string;
    author: string;
    comments: number;
    attachments: number;
  }
  
  export interface Assignment {
    id: string;
    title: string;
    dueDate: string;
    points: number;
    topic: string;
  }
  
  export interface LecturePerson {
    id: string;
    name: string;
    role: 'Student' | 'Teacher';
  }