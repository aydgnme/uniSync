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
      const response = await api.get<Announcement[]>(this.BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  }
}

export const announcementService = new AnnouncementService();
