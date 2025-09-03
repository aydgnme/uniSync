import { API_CONFIG } from '@/config/api.config';
import api from './api.service';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  published_by: string;
}

class AnnouncementService {
  private readonly BASE_URL = API_CONFIG.ENDPOINTS.UNIVERSITY.ANNOUNCEMENTS;

  async getAnnouncements(): Promise<Announcement[]> {
    try {
      console.log('Fetching announcements from:', this.BASE_URL);
      const response = await api.get<Announcement[]>(this.BASE_URL);
      console.log('Announcements response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching announcements:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: this.BASE_URL
      });
      throw error;
    }
  }
}

export const announcementService = new AnnouncementService();
