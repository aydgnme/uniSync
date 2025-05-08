import { useAuth } from '@/context/AuthContext';
import { scheduleService } from '@/services/schedule.service';
import { Course } from '@/types/schedule.type';
import { useEffect, useState } from 'react';

interface UseScheduleReturn {
  courses: Course[];
  currentWeek: number;
  isLoading: boolean;
  error: string | null;
  refreshSchedule: () => Promise<void>;
}

interface AcademicInfo {
  group: string;
  subgroup: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  academicInfo: AcademicInfo;
}

export const useSchedule = (): UseScheduleReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth() as { user: User | null };

  const fetchSchedule = async () => {
    if (!user?.academicInfo?.group || !user?.academicInfo?.subgroup) {
      setError('Kullanıcı grup bilgisi eksik');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await scheduleService.getFullSchedule(
        user.academicInfo.group,
        user.academicInfo.subgroup
      );

      if (response.data?.success) {
        setCourses(response.data.courses);
        setCurrentWeek(response.data.weekNumber);
      } else {
        setError('Program bilgisi alınamadı');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Program yüklenirken bir hata oluştu');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.academicInfo) {
      fetchSchedule();
    }
  }, [user]);

  return {
    courses,
    currentWeek,
    isLoading,
    error,
    refreshSchedule: fetchSchedule,
  };
};