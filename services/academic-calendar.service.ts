import { AcademicCalendarData } from '@/types/academic-calendar.type';
import { API_CONFIG } from '../config/api.config';
import api from './api.service';

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