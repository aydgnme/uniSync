import { scheduleService } from '@/services/schedule.service';
import { ScheduleItem } from '@/types/schedule.type';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

export const useSchedule = () => {
  const [data, setData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        console.log('No token available, skipping schedule fetch');
        setLoading(false);
        return;
      }

      const response = await scheduleService.getMySchedule();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return { data, loading, error, refresh: fetchSchedule };
};