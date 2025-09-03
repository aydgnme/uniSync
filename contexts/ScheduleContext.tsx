import { scheduleService } from '@/services/schedule.service';
import { ScheduleItem } from '@/types/schedule.type';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface ScheduleContextType {
  schedule: ScheduleItem[];
  isLoading: boolean;
  error: string | null;
  refreshSchedule: () => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSchedule = useCallback(async () => {
    // Check for both user and token
    const token = await SecureStore.getItemAsync('auth_token');
    if (!user || !token) {
      console.log('[ScheduleContext] No user or token available, skipping schedule fetch.');
      return;
    }

    console.log('[ScheduleContext] Fetching schedule for user:', user.email);

    setIsLoading(true);
    setError(null);

    try {
      const response = await scheduleService.getMySchedule();
      console.log('[ScheduleContext] API response:', response);
      console.log('[ScheduleContext] Weeks array:', response.data[0]?.weeks);

      if (response.success) {
        setSchedule(response.data);
        console.log(`[ScheduleContext] Schedule loaded. ${response.data.length} items.`);
      } else {
        setError('Failed to fetch schedule: API responded with success = false');
        console.error('[ScheduleContext] API success flag was false.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch schedule';
      setError(errorMsg);
      console.error('[ScheduleContext] Error while fetching schedule:', errorMsg);
    } finally {
      setIsLoading(false);
      console.log('[ScheduleContext] Loading finished.');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log('[ScheduleContext] User detected, initiating schedule fetch.');
      fetchSchedule();
    } else {
      console.log('[ScheduleContext] No user detected, skipping schedule fetch.');
      setSchedule([]);
    }
  }, [user, fetchSchedule]);

  return (
    <ScheduleContext.Provider value={{ schedule, isLoading, error, refreshSchedule: fetchSchedule }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }
  return context;
};