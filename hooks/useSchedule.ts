import { useProfile } from '@/hooks/useProfile';
import { scheduleService } from '@/services/schedule.service';
import { Course as ScheduleCourse } from '@/types/schedule.type';
import { useEffect, useState } from 'react';


interface UseScheduleReturn {
  courses: ScheduleCourse[];
  currentWeek: number;
  isLoading: boolean;
  error: string | null;
  refreshSchedule: () => Promise<void>;
}

export const useSchedule = (): UseScheduleReturn => {
  const [courses, setCourses] = useState<ScheduleCourse[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: profileLoading } = useProfile();

  const fetchSchedule = async () => {
    if (!user?.academicInfo?.groupName || !user?.academicInfo?.subgroupIndex) return;

    try {
      setIsLoading(true);
      const response = await scheduleService.getFullSchedule(
        user.academicInfo.groupName,
        user.academicInfo.subgroupIndex
      );

      if (response.data?.success) {
        setCourses(response.data.courses);
        setCurrentWeek(response.data.weekNumber);
        setError(null);
      } else {
        setError("Failed to fetch schedule.");
      }
    } catch (err) {
      setError("An error occurred while fetching schedule.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!profileLoading && user) {
      fetchSchedule();
    }
  }, [user, profileLoading]);

  return {
    courses,
    currentWeek,
    isLoading: isLoading || profileLoading,
    error,
    refreshSchedule: fetchSchedule,
  };
};