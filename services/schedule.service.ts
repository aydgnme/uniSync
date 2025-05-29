import axios from 'axios';
import moment from 'moment';
import { API_CONFIG } from '../config/api.config';
import {
    Course,
    CourseType,
    ParityType,
    ScheduleResponse,
    TodayScheduleResponse
} from '../types/schedule.type';

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
  data: {
    courses: APICourseItem[];
    weekNumber: number;
    parity: ParityType;
  };
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
    facultyId: string,
    specializationShortName: string,
    studyYear: number,
    groupName: string,
    subgroupIndex?: string,
    week?: number
  ): Promise<{ data: ScheduleResponse }> {
    try {
      console.log('Fetching full schedule for:', { facultyId, specializationShortName, studyYear, groupName, subgroupIndex, week });

      let path = `${this.BASE_URL}${API_CONFIG.ENDPOINTS.SCHEDULE.WEEKLY}/${facultyId}/${specializationShortName}/${studyYear}/${groupName}`;
      if (subgroupIndex && subgroupIndex.trim() !== '') {
        path += `/${subgroupIndex}`;
      }
      if (week) {
        path += `?week=${week}`;
      }

      console.log('API URL:', path);

      const response = await axios.get<APIWeeklyScheduleResponse>(path);
      
      if (!response.data || !response.data.data || !response.data.data.courses) {
        console.error('Invalid response data:', response.data);
        throw new Error('Invalid schedule data received from server');
      }

      const courses: Course[] = response.data.data.courses.map((item: APICourseItem) => ({
        ...item,
        type: mapCourseType(item.type)
      }));

      const transformed: ScheduleResponse = {
        success: response.data.success,
        courses,
        group: groupName,
        subgroup: subgroupIndex || '',
        weekNumber: response.data.data.weekNumber || 1,
        parity: response.data.data.parity || 'BOTH',
      };

      console.log('Transformed schedule data:', transformed);
      return { data: transformed };
    } catch (error) {
      console.error('Full schedule service error:', error);
      throw this.handleError(error);
    }
  }

  async getSchedule(
    facultyId: string,
    specializationShortName: string,
    studyYear: number,
    groupName: string,
    subgroupIndex?: string,
    week?: number
  ): Promise<{ data: ScheduleResponse }> {
    return this.getFullSchedule(facultyId, specializationShortName, studyYear, groupName, subgroupIndex, week);
  }

  async getTodaySchedule(
    facultyId: string,
    specializationShortName: string,
    studyYear: number,
    groupName: string,
    subgroupIndex?: string
  ): Promise<{ data: TodayScheduleResponse }> {
    try {
      console.log('getTodaySchedule - Request params:', { 
        facultyId, 
        specializationShortName, 
        studyYear, 
        groupName, 
        subgroupIndex 
      });

      let path = `${this.BASE_URL}${API_CONFIG.ENDPOINTS.SCHEDULE.TODAY}/${facultyId}/${specializationShortName}/${studyYear}/${groupName}`;
      if (subgroupIndex && subgroupIndex.trim() !== '') {
        path += `/${subgroupIndex}`;
      }
      path += '?today=true';

      console.log('getTodaySchedule - API URL:', path);

      const response = await axios.get<APITodayScheduleResponse>(path);
      
      console.log('getTodaySchedule - Raw API response:', response.data);
      
      if (!response.data || !response.data.data) {
        console.error('getTodaySchedule - Invalid response:', response.data);
        return {
          data: {
            success: true,
            data: {
              day: moment().day(),
              dayName: moment().format('dddd'),
              weekNumber: moment().isoWeek(),
              parity: 'BOTH',
              courses: []
            }
          }
        };
      }

      const todayData = response.data.data;
      const courses: Course[] = todayData.courses.map((item: APICourseItem) => ({
        ...item,
        type: mapCourseType(item.type)
      }));

      console.log('getTodaySchedule - Transformed courses:', courses);

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
      console.error('getTodaySchedule - Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('getTodaySchedule - Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      return {
        data: {
          success: true,
          data: {
            day: moment().day(),
            dayName: moment().format('dddd'),
            weekNumber: moment().isoWeek(),
            parity: 'BOTH',
            courses: []
          }
        }
      };
    }
  }

  private handleError(error: any): Error {
    console.error('Schedule service error details:', error);
    if (error.response) {
      if (error.response.status === 500) {
        return new Error('Server error. Please try again later.');
      }
      const message = error.response.data?.message || 'An error occurred while fetching the schedule';
      return new Error(message);
    }
    return new Error('A network error occurred while fetching the schedule');
  }
}

export const scheduleService = new ScheduleService();
