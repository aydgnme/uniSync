import { AcademicCalendarData } from '@/types/academic-calendar.type';
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

export const academicCalendarService = {
  getAcademicCalendar: async (): Promise<AcademicCalendarData> => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.TIME.ACADEMIC_CALENDAR);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching academic calendar:', error);
      throw error;
    }
  },
}; 