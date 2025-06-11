export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: {
    full_name: string;
  };
} 