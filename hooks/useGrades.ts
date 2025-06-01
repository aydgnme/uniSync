import { Grade, gradeService } from '@/services/grade.service';
import { SemesterData } from '@/types/grades';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export const useGrades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const { user } = useAuth();

  // Extract academic years from grades
  const availableYears = [...new Set(grades.map(grade => grade.academicYear))].sort().reverse();

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const gradesData = await gradeService.getStudentGrades();
      setGrades(gradesData);
      
      // Select first year
      if (gradesData.length > 0 && !selectedYear) {
        const years = [...new Set(gradesData.map(grade => grade.academicYear))].sort().reverse();
        setSelectedYear(years[0]);
      }
      
      setError(null);
    } catch (err) {
      setError('Error fetching grades');
      console.error('Error fetching grades:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = () => {
    return gradeService.calculateGPA(grades);
  };

  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year);
  }, []);

  const handleSemesterChange = useCallback((semester: number) => {
    setSelectedSemester(semester);
  }, []);

  const currentYearData: SemesterData[] = grades
    .filter(grade => grade.academicYear === selectedYear && grade.semester === selectedSemester)
    .map(grade => ({
      year: grade.academicYear,
      semester: grade.semester.toString(),
      courses: [{
        id: grade.id,
        name: grade.course.title,
        code: grade.course.code,
        grade: grade.score,
        credits: grade.course.credits,
        status: grade.score >= 60 ? 'PASSED' : 'FAILED',
        components: {
          midterm: grade.examType === 'midterm' ? grade.score : 0,
          final: grade.examType === 'final' ? grade.score : 0,
          homework: grade.examType === 'homework' ? grade.score : 0,
          attendance: grade.examType === 'attendance' ? grade.score : 0
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