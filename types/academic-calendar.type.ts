export interface AcademicCalendarData {
  weekNumber: number;
  parity: 'ODD' | 'EVEN';
  currentDate: string;
}

export interface AcademicCalendarContextType {
  calendarData: AcademicCalendarData | null;
  isLoading: boolean;
  error: string | null;
  refreshCalendar: () => Promise<void>;
} 