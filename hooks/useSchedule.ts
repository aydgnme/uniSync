import { useCallback, useState } from 'react';

export interface ScheduleCourse {
  courseTitle: string;
  startTime: string;
  endTime: string;
  room: string;
  groupName: string;
}

export const useSchedule = () => {
  const [todayCourses, setTodayCourses] = useState<ScheduleCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual API call
      const mockCourses: ScheduleCourse[] = [
        {
          courseTitle: "Introduction to Programming",
          startTime: "09:00",
          endTime: "10:30",
          room: "Room 101",
          groupName: "Group A"
        },
        {
          courseTitle: "Data Structures",
          startTime: "11:00",
          endTime: "12:30",
          room: "Room 202",
          groupName: "Group B"
        }
      ];
      setTodayCourses(mockCourses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    todayCourses,
    isLoading,
    error,
    refreshSchedule
  };
}; 