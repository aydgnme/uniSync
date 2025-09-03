import { useEffect, useState } from 'react';

export interface Announcement {
  id: string;
  text: string;
  date: string;
  author: string;
  comments: number;
  attachments: number;
}

export const useLectureAnnouncements = (courseId: string) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [courseId]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      // For now, using mock data
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          text: 'Welcome to the course! This semester we will be covering fundamental programming concepts.',
          date: '2024-02-20',
          author: 'Dr. John Smith',
          comments: 3,
          attachments: 1
        },
        {
          id: '2',
          text: 'First assignment will be posted next week. Please make sure to check the course page regularly.',
          date: '2024-02-21',
          author: 'Dr. John Smith',
          comments: 0,
          attachments: 0
        }
      ];
      setAnnouncements(mockAnnouncements);
      setError(null);
    } catch (err) {
      setError('Failed to fetch announcements');
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (text: string) => {
    try {
      // TODO: Implement actual API call
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        text,
        date: new Date().toISOString().split('T')[0],
        author: 'Current User', // TODO: Get from auth context
        comments: 0,
        attachments: 0
      };
      setAnnouncements(prev => [newAnnouncement, ...prev]);
    } catch (err) {
      console.error('Error adding announcement:', err);
      throw err;
    }
  };

  return {
    announcements,
    loading,
    error,
    refetch: fetchAnnouncements,
    addAnnouncement
  };
}; 