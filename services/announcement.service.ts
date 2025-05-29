import { apiService } from './api.service';

export type AnnouncementType = 'Academic' | 'Technical' | 'General';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  date: string;
  attachments: string[];
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  type: AnnouncementType;
  date?: string;
  attachments?: string[];
}

class AnnouncementService {
  private readonly BASE_URL = '/announcements';

  async createAnnouncement(data: CreateAnnouncementRequest): Promise<Announcement> {
    return apiService.post<Announcement>(this.BASE_URL, data);
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return apiService.get<Announcement[]>(this.BASE_URL);
  }

  async getAnnouncementById(id: string): Promise<Announcement> {
    return apiService.get<Announcement>(`${this.BASE_URL}/${id}`);
  }

  async getAnnouncementsByType(type: AnnouncementType): Promise<Announcement[]> {
    return apiService.get<Announcement[]>(`${this.BASE_URL}/type/${type}`);
  }
}

export const announcementService = new AnnouncementService(); 