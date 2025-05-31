import { SemesterData } from '@/types/grades';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export interface Grade {
  id: string;
  courseCode: string;
  courseName: string;
  grade: number;
  credit: number;
  semester: number;
  year: string;
  date: string;
}

export const useGrades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const { user } = useAuth();

  const availableYears = ['2023-2024', '2022-2023', '2021-2022'];

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      // For now, using mock data
      const mockGrades: Grade[] = [
        {
          id: '1',
          courseCode: 'CS101',
          courseName: 'Introduction to Programming',
          grade: 85,
          credit: 6,
          semester: 1,
          year: '2023-2024',
          date: '2023-12-15'
        },
        {
          id: '2',
          courseCode: 'CS102',
          courseName: 'Data Structures',
          grade: 90,
          credit: 6,
          semester: 1,
          year: '2023-2024',
          date: '2023-12-20'
        }
      ];
      setGrades(mockGrades);
      setError(null);
    } catch (err) {
      setError('Failed to fetch grades');
      console.error('Error fetching grades:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    
    const totalPoints = grades.reduce((sum, grade) => {
      return sum + (grade.grade * grade.credit);
    }, 0);
    
    const totalCredits = grades.reduce((sum, grade) => {
      return sum + grade.credit;
    }, 0);
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year);
  }, []);

  const handleSemesterChange = useCallback((semester: number) => {
    setSelectedSemester(semester);
  }, []);

  const currentYearData: SemesterData[] = grades
    .filter(grade => grade.year === selectedYear && grade.semester === selectedSemester)
    .map(grade => ({
      year: grade.year,
      semester: grade.semester.toString(),
      courses: [{
        id: grade.id,
        name: grade.courseName,
        code: grade.courseCode,
        grade: grade.grade,
        status: grade.grade >= 60 ? 'PASSED' : 'FAILED',
        components: {
          midterm: 0,
          final: grade.grade,
          homework: 0,
          attendance: 0
        }
      }]
    }));

  return {
    grades,
    loading,
    error,
    fetchGrades,
    calculateGPA,
    selectedYear,
    availableYears,
    currentYearData,
    handleYearChange,
    selectedSemester,
    handleSemesterChange
  };
}; 