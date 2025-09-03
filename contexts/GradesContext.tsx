import { useAuth } from '@/contexts/AuthContext';
import { Grade, gradeService } from '@/services/grade.service';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface GradesContextType {
  grades: Grade[];
  isLoading: boolean;
  error: string | null;
  refreshGrades: () => Promise<void>;
  getGradesBySemester: (year: string, semester: number) => Grade[];
  getGradeByCourse: (courseCode: string) => Grade | undefined;
  calculateGPA: () => number;
}

const GradesContext = createContext<GradesContextType | undefined>(undefined);

export const GradesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchGrades = useCallback(async () => {
    // Check for both user and token
    const token = await SecureStore.getItemAsync('auth_token');
    if (!user || !token) {
      console.log('[GradesContext] No user or token available, skipping grades fetch.');
      return;
    }

    console.log('[GradesContext] Fetching grades for user:', user.email);

    setIsLoading(true);
    setError(null);

    try {
      const gradesData = await gradeService.getStudentGrades();
      console.log('[GradesContext] API response:', {
        success: true,
        totalGrades: gradesData.length,
        firstGrade: gradesData[0]?.course?.title,
        lastUpdated: gradesData[0]?.gradedAt
      });

      setGrades(gradesData);
      console.log(`[GradesContext] Grades loaded. ${gradesData.length} items.`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch grades';
      setError(errorMsg);
      console.error('[GradesContext] Error while fetching grades:', errorMsg);
    } finally {
      setIsLoading(false);
      console.log('[GradesContext] Loading finished.');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log('[GradesContext] User detected, initiating grades fetch.');
      fetchGrades();
    } else {
      console.log('[GradesContext] No user detected, skipping grades fetch.');
      setGrades([]);
    }
  }, [user, fetchGrades]);

  const refreshGrades = async () => {
    console.log('[GradesContext] Refreshing grades...');
    await gradeService.clearGradesCache();
    await fetchGrades();
  };

  const getGradesBySemester = (year: string, semester: number) => {
    const semesterGrades = grades.filter(
      grade => grade.academicYear === year && grade.semester === semester
    );
    console.log(`[GradesContext] Getting grades for semester ${semester} of ${year}: ${semesterGrades.length} items`);
    return semesterGrades;
  };

  const getGradeByCourse = (courseCode: string) => {
    const courseGrade = grades.find(grade => grade.course.code === courseCode);
    console.log(`[GradesContext] Getting grade for course ${courseCode}:`, courseGrade?.score);
    return courseGrade;
  };

  const calculateGPA = () => {
    const gpa = gradeService.calculateGPA(grades);
    console.log(`[GradesContext] Calculated GPA: ${gpa}`);
    return gpa;
  };

  const value = {
    grades,
    isLoading,
    error,
    refreshGrades,
    getGradesBySemester,
    getGradeByCourse,
    calculateGPA
  };

  return (
    <GradesContext.Provider value={value}>
      {children}
    </GradesContext.Provider>
  );
};

export const useGrades = () => {
  const context = useContext(GradesContext);
  if (!context) {
    throw new Error('useGrades must be used within a GradesProvider');
  }
  return context;
}; 