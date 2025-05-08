import { Course, CourseType, ParityType, ScheduleResponse, TodayScheduleResponse } from '../types/schedule.type';
import { apiService } from './api.service';

interface APICourseItem {
  id: string;
  code: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  duration: number;
  room: string;
  teacher: string;
  group: string;
  subgroup: string;
  parity: ParityType;
  weekDay: number;
}

interface APIWeeklyScheduleResponse {
  success: boolean;
  courses: APICourseItem[];
  weekNumber: number;
  parity: ParityType;
}

interface APITodayScheduleResponse {
  success: boolean;
  data: {
    day: number;
    dayName: string;
    weekNumber: number;
    parity: string;
    courses: APICourseItem[];
  };
}

const mapCourseType = (type: string): CourseType => {
  switch (type.toUpperCase()) {
    case 'LABORATORY':
      return 'LABORATORY';
    case 'SEMINAR':
      return 'SEMINAR';
    default:
      return 'LECTURE';
  }
};

class ScheduleService {
  private readonly BASE_PATH = '/api/schedules';

  async getFullSchedule(
    group: string,
    subgroup: string
  ): Promise<{ data: ScheduleResponse }> {
    try {
      const response = await apiService.get<APIWeeklyScheduleResponse>(
        `${this.BASE_PATH}/${group}/${subgroup}`
      );

      const courses: Course[] = response.courses.map((item: APICourseItem) => ({
        ...item,
        type: mapCourseType(item.type)
      }));

      const transformed: ScheduleResponse = {
        success: response.success,
        courses,
        group,
        subgroup,
        weekNumber: response.weekNumber,
        parity: response.parity,
      };

      return { data: transformed };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTodaySchedule(
    group: string,
    subgroup: string
  ): Promise<{ data: TodayScheduleResponse }> {
    try {
      const response = await apiService.get<APITodayScheduleResponse>(
        `${this.BASE_PATH}/today/${group}/${subgroup}`
      );

      const todayData = response.data;
      const courses: Course[] = todayData.courses.map((item: APICourseItem) => ({
        ...item,
        type: mapCourseType(item.type)
      }));

      return {
        data: {
          success: response.success,
          data: {
            ...todayData,
            courses,
          },
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || 'Bir hata oluştu';
      return new Error(message);
    }
    return new Error('Ağ hatası oluştu');
  }
}

export const scheduleService = new ScheduleService();