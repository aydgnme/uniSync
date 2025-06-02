import { academicCalendarService } from '@/services/academic-calendar.service';
import { AcademicCalendarContextType, AcademicCalendarData } from '@/types/academic-calendar.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = '@academic_calendar_data';

const AcademicCalendarContext = createContext<AcademicCalendarContextType | undefined>(undefined);

export const AcademicCalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calendarData, setCalendarData] = useState<AcademicCalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await academicCalendarService.getAcademicCalendar();
      setCalendarData(data);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      // Debug Log
      const today = new Date();
      const currentWeek = data.weekNumber;
      const parity = data.parity;
      console.log(`[AcademicCalendar] Today: ${today.toISOString().slice(0,10)}, Academic Week: ${currentWeek}, Parity: ${parity}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch academic calendar';
      setError(errorMessage);
      console.error('[AcademicCalendarContext] Error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Try to load from storage first
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          setCalendarData(JSON.parse(storedData));
        }
        
        // Then fetch fresh data
        await fetchCalendarData();
      } catch (err) {
        console.error('[AcademicCalendarContext] Initial load error:', err);
      }
    };

    loadInitialData();
  }, [fetchCalendarData]);

  return (
    <AcademicCalendarContext.Provider
      value={{
        calendarData,
        isLoading,
        error,
        refreshCalendar: fetchCalendarData,
      }}
    >
      {children}
    </AcademicCalendarContext.Provider>
  );
};

export const useAcademicCalendar = () => {
  const context = useContext(AcademicCalendarContext);
  if (!context) {
    throw new Error('useAcademicCalendar must be used within an AcademicCalendarProvider');
  }
  return context;
}; 