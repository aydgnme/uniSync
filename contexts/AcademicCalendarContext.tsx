import { API_CONFIG } from '@/config/api.config';
import api from '@/services/api.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AcademicCalendarData {
  currentDate: string;
  weekNumber: number;
  parity: 'ODD' | 'EVEN';
}

interface AcademicCalendarContextType {
  academicCalendar: AcademicCalendarData | null;
  isLoading: boolean;
  error: string | null;
  refreshCalendar: () => Promise<void>;
}

const AcademicCalendarContext = createContext<AcademicCalendarContextType | undefined>(undefined);

export const AcademicCalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [academicCalendar, setAcademicCalendar] = useState<AcademicCalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcademicCalendar = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to load from cache first
      const cachedData = await AsyncStorage.getItem('academic_calendar');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setAcademicCalendar(parsedData);
        console.log('Loaded academic calendar from cache:', parsedData);
      }

      // Fetch fresh data
      const response = await api.get(API_CONFIG.ENDPOINTS.TIME.ACADEMIC_CALENDAR);
      
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from API');
      }

      const data = response.data.data; // API response is wrapped in a data object
      console.log('Fetched academic calendar data:', data);

      // Validate the data structure
      const requiredFields = ['currentDate', 'weekNumber', 'parity'];
      const missingFields = requiredFields.filter(field => !(field in data));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Update state and cache
      setAcademicCalendar(data);
      await AsyncStorage.setItem('academic_calendar', JSON.stringify(data));
      console.log('Updated academic calendar cache');

    } catch (err: any) {
      console.error('Error fetching academic calendar:', err);
      setError(err.message || 'Failed to fetch academic calendar');
      
      // If we have cached data, keep using it
      if (!academicCalendar) {
        setAcademicCalendar(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicCalendar();
  }, []);

  const refreshCalendar = async () => {
    await fetchAcademicCalendar();
  };

  return (
    <AcademicCalendarContext.Provider
      value={{
        academicCalendar,
        isLoading,
        error,
        refreshCalendar,
      }}
    >
      {children}
    </AcademicCalendarContext.Provider>
  );
};

export const useAcademicCalendar = () => {
  const context = useContext(AcademicCalendarContext);
  if (context === undefined) {
    throw new Error('useAcademicCalendar must be used within an AcademicCalendarProvider');
  }
  return context;
}; 