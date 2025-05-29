import { useCallback, useState } from 'react';
import { Announcement, announcementService, AnnouncementType, CreateAnnouncementRequest } from '../services/announcement.service';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await announcementService.getAllAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnnouncementsByType = useCallback(async (type: AnnouncementType) => {
    try {
      setLoading(true);
      setError(null);
      const data = await announcementService.getAnnouncementsByType(type);
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAnnouncement = useCallback(async (data: CreateAnnouncementRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newAnnouncement = await announcementService.createAnnouncement(data);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      return newAnnouncement;
    } catch (err) {
      setError('Failed to create announcement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    fetchAnnouncementsByType,
    createAnnouncement,
  };
}; 