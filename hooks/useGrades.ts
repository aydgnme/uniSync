import { Grade, gradeService } from '@/services/grade.service';
import { SemesterData } from '@/types/grades';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';

export const useGrades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const { user } = useAuth();

  // Extract academic years from grades
  const availableYears = useMemo(() => {
    const years = [...new Set(grades.map(grade => grade.academic_year))].sort().reverse();
    console.log('Calculated available years:', years);
    return years;
  }, [grades]);

  // Update selected year when grades change
  useEffect(() => {
    if (availableYears.length > 0 && (!selectedYear || !availableYears.includes(selectedYear))) {
      console.log('Setting initial year:', availableYears[0]);
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const gradesData = await gradeService.getStudentGrades();
      console.log('Fetched grades data:', {
        totalGrades: gradesData.length,
        firstGrade: gradesData[0],
        availableYears: [...new Set(gradesData.map(grade => grade.academic_year))]
      });
      
      setGrades(gradesData);
      setError(null);
    } catch (err) {
      console.error('Error in fetchGrades:', err);
      setError('Error fetching grades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const calculateGPA = () => {
    return gradeService.calculateGPA(grades);
  };

  const handleYearChange = useCallback((year: string) => {
    console.log('Year changed to:', year);
    setSelectedYear(year);
  }, []);

  const handleSemesterChange = useCallback((semester: number) => {
    setSelectedSemester(semester);
  }, []);

  const currentYearData: SemesterData[] = grades
    .filter(grade => grade.academic_year === selectedYear && grade.semester === selectedSemester.toString())
    .map(grade => ({
      year: grade.academic_year,
      semester: grade.semester,
      courses: [{
        id: grade.student_id,
        name: grade.course_title,
        code: grade.course_code,
        grade: (grade.midterm_score * parseFloat(grade.midterm_weight) + 
                grade.final_score * parseFloat(grade.final_weight) + 
                (grade.project_score || 0) * parseFloat(grade.project_weight || '0') + 
                (grade.homework_score || 0) * parseFloat(grade.homework_weight || '0')),
        credits: grade.credits,
        status: (grade.midterm_score * parseFloat(grade.midterm_weight) + 
                grade.final_score * parseFloat(grade.final_weight) + 
                (grade.project_score || 0) * parseFloat(grade.project_weight || '0') + 
                (grade.homework_score || 0) * parseFloat(grade.homework_weight || '0')) >= 5 ? 'PASSED' : 'FAILED',
        components: {
          midterm: {
            score: grade.midterm_score,
            weight: parseFloat(grade.midterm_weight)
          },
          final: {
            score: grade.final_score,
            weight: parseFloat(grade.final_weight)
          },
          ...(grade.project_score && {
            project: {
              score: grade.project_score,
              weight: parseFloat(grade.project_weight || '0')
            }
          }),
          ...(grade.homework_score && {
            homework: {
              score: grade.homework_score,
              weight: parseFloat(grade.homework_weight || '0')
            }
          })
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