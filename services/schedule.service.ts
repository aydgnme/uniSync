import { ScheduleItem } from '@/types/schedule.type';
import { API_CONFIG } from '../config/api.config';
import api from './api.service';

export const scheduleService = {
  async getMySchedule(): Promise<{ success: boolean; data: ScheduleItem[] }> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.SCHEDULE.MY);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  }
};