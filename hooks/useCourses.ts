import { useEffect, useState } from 'react';

export interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  color: string;
  banner: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      // For now, using mock data
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Introduction to Programming',
          code: 'CS101',
          instructor: 'Dr. John Smith',
          color: '#1976D2',
          banner: 'https://example.com/cs101-banner.jpg'
        },
        {
          id: '2',
          title: 'Data Structures',
          code: 'CS102',
          instructor: 'Dr. Jane Doe',
          color: '#2196F3',
          banner: 'https://example.com/cs102-banner.jpg'
        }
      ];
      setCourses(mockCourses);
      setError(null);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
}; 