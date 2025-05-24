import { useProfile } from '@/hooks/useProfile';
import { scheduleService } from '@/services/schedule.service';
import { Course as ScheduleCourse } from '@/types/schedule.type';
import moment from 'moment';
import { useEffect, useState } from 'react';

interface UseScheduleReturn {
  courses: ScheduleCourse[];
  todayCourses: ScheduleCourse[];
  currentWeek: number;
  isLoading: boolean;
  error: string | null;
  refreshSchedule: () => Promise<void>;
}

export const useSchedule = (): UseScheduleReturn => {
  const [courses, setCourses] = useState<ScheduleCourse[]>([]);
  const [todayCourses, setTodayCourses] = useState<ScheduleCourse[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: profileLoading } = useProfile();

  const validateAcademicInfo = () => {
    if (!user?.academicInfo) {
      console.log('useSchedule - No academic info available');
      return false;
    }

    const { facultyId, specializationShortName, groupName, studyYear } = user.academicInfo;
    
    if (!facultyId || !specializationShortName || !groupName || !studyYear) {
      console.log('useSchedule - Missing required academic info:', {
        facultyId,
        specializationShortName,
        groupName,
        studyYear
      });
      return false;
    }

    return true;
  };

  const filterTodayCourses = (allCourses: ScheduleCourse[]) => {
    const today = moment();
    const todayWeekDay = today.isoWeekday(); // 1 (Monday) - 7 (Sunday)
    
    return allCourses.filter(course => course.weekDay === todayWeekDay);
  };

  const fetchSchedule = async () => {
    if (!validateAcademicInfo() || !user?.academicInfo) {
      setError("Group information is missing. Please update your profile.");
      setIsLoading(false);
      return;
    }

    const { facultyId, specializationShortName, groupName, subgroupIndex, studyYear } = user.academicInfo;

    try {
      console.log('useSchedule - Fetching schedule with params:', {
        facultyId,
        specializationShortName,
        studyYear,
        groupName,
        subgroupIndex,
        currentWeek
      });

      setIsLoading(true);
      setError(null);

      const response = await scheduleService.getFullSchedule(
        facultyId,
        specializationShortName,
        studyYear,
        groupName,
        subgroupIndex,
        currentWeek
      );

      console.log('useSchedule - API Response:', response);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      if (response.data?.success) {
        console.log('useSchedule - Setting courses:', response.data.courses);
        setCourses(response.data.courses || []);
        const todayCourses = filterTodayCourses(response.data.courses || []);
        console.log('useSchedule - Today courses:', todayCourses);
        setTodayCourses(todayCourses);
        setCurrentWeek(response.data.weekNumber || 1);
        setError(null);
      } else {
        console.error('useSchedule - API returned unsuccessful response:', response);
        setError("Failed to fetch schedule. Please try again later.");
      }
    } catch (err) {
      console.error('useSchedule - Error fetching schedule:', err);
      setError(err instanceof Error ? err.message : "An error occurred while fetching schedule.");
      setCourses([]);
      setTodayCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!profileLoading && user) {
      console.log('useSchedule - Profile loaded, fetching schedule');
      fetchSchedule();
    }
  }, [user, profileLoading, currentWeek]);

  return {
    courses,
    todayCourses,
    currentWeek,
    isLoading: isLoading || profileLoading,
    error,
    refreshSchedule: fetchSchedule,
  };
};