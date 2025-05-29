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
      setIsLoading(true);
      setError(null);

      // First fetch weekly schedule
      const response = await scheduleService.getFullSchedule(
        facultyId,
        specializationShortName,
        studyYear,
        groupName,
        subgroupIndex,
        currentWeek
      );

      if (!response.data) {
        setError("Could not fetch data from server. Please try again later.");
        setCourses([]);
        setTodayCourses([]);
        return;
      }

      if (response.data?.success) {
        const weeklyCourses = response.data.courses || [];
        setCourses(weeklyCourses);
        setCurrentWeek(response.data.weekNumber || 1);
        setError(null);

        // Filter today's classes from weekly schedule (for fallback)
        const today = moment().isoWeekday();
        console.log('weeklyCourses:', weeklyCourses);
        console.log('today:', today);
        let todayCoursesFallback = weeklyCourses.filter(course => course.weekDay === today);
        console.log('todayCoursesFallback:', todayCoursesFallback);

        // If today API fails, use fallback
        try {
          const todayResponse = await scheduleService.getTodaySchedule(
            facultyId,
            specializationShortName,
            studyYear,
            groupName,
            subgroupIndex
          );

          if (todayResponse.data?.success && todayResponse.data.data.courses.length > 0) {
            setTodayCourses(todayResponse.data.data.courses);
          } else {
            setTodayCourses(todayCoursesFallback);
          }
        } catch (err) {
          // If today API fails, use fallback
          setTodayCourses(todayCoursesFallback);
        }
      } else {
        setError("Could not fetch schedule. Please try again later.");
        setCourses([]);
        setTodayCourses([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching the schedule.";
      setError(errorMessage);
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