import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { Course, CourseType, ParityType, ScheduleResponse, TodayScheduleResponse } from '../types/schedule.type';

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
    case 'LAB':
      return 'LAB';
    case 'SEMINAR':
      return 'SEMINAR';
    default:
      return 'LECTURE';
  }
};

class ScheduleService {
  private readonly BASE_URL = API_CONFIG.BASE_URL;

  async getFullSchedule(
    group: string,
    subgroup: string
  ): Promise<{ data: ScheduleResponse }> {
    try {
      const response = await axios.get<APIWeeklyScheduleResponse>(
        `${this.BASE_URL}${API_CONFIG.ENDPOINTS.SCHEDULE.WEEKLY}/${group}/${subgroup}`
      );

      const courses: Course[] = response.data.courses.map((item: APICourseItem) => ({
        ...item,
        type: mapCourseType(item.type)
      }));

      const transformed: ScheduleResponse = {
        success: response.data.success,
        courses,
        group,
        subgroup,
        weekNumber: response.data.weekNumber,
        parity: response.data.parity,
      };

      return { data: transformed };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSchedule(
    group: string,
    subgroup: string,
    _week?: number
  ): Promise<{ data: ScheduleResponse }> {
    return this.getFullSchedule(group, subgroup);
  }

  async getTodaySchedule(
    group: string,
    subgroup: string
  ): Promise<{ data: TodayScheduleResponse }> {
    try {
      console.log('Fetching schedule for:', { group, subgroup });
      const response = await axios.get<APITodayScheduleResponse>(
        `${this.BASE_URL}${API_CONFIG.ENDPOINTS.SCHEDULE.TODAY}/${group}/${subgroup}`
      );
      console.log('Schedule API Response:', response);

      if (!response.data || !response.data.data || !response.data.data.courses) {
        throw new Error('Invalid response format from schedule API');
      }

      const todayData = response.data.data;
      const courses: Course[] = todayData.courses.map((item: APICourseItem) => ({
        ...item,
        type: mapCourseType(item.type)
      }));

      return {
        data: {
          success: true,
          data: {
            ...todayData,
            courses,
          },
        },
      };
    } catch (error) {
      console.error('Schedule service error:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    console.error('Schedule service error details:', error);
    if (error.response) {
      const message = error.response.data?.message || 'An error occurred while fetching the schedule';
      return new Error(message);
    }
    return new Error('Network error occurred while fetching the schedule');
  }
}

export const scheduleService = new ScheduleService();