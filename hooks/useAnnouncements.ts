import { useCallback, useState } from 'react';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  date: string;
  attachments?: {
    name: string;
    url: string;
  }[];
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement actual API call
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Welcome to the New Semester',
          content: 'We are excited to welcome you to the new semester. Please check your schedule and course materials.',
          type: 'General',
          date: '2024-02-20',
          attachments: [
            {
              name: 'Course Schedule.pdf',
              url: 'https://example.com/schedule.pdf'
            }
          ]
        },
        {
          id: '2',
          title: 'Important: Registration Deadline',
          content: 'The deadline for course registration is approaching. Please complete your registration by the end of this week.',
          type: 'Important',
          date: '2024-02-19'
        }
      ];
      setAnnouncements(mockAnnouncements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements
  };
}; 