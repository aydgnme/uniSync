import { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api.config';
import api from './api.service';
import { authService } from './auth.service';
import { tokenService } from './token.service';

const GRADES_CACHE_KEY = 'grades_cache';
const CACHE_EXPIRY_KEY = 'grades_cache_expiry';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export interface Grade {
  student_id: string;
  course_code: string;
  course_title: string;
  credits: number;
  academic_year: string;
  semester: string;
  midterm_score: number;
  final_score: number;
  project_score: number | null;
  homework_score: number | null;
  midterm_weight: string;
  final_weight: string;
  project_weight: string | null;
  homework_weight: string | null;
  teacher_names: string;
}

interface GradeResponse {
  success: boolean;
  data: Grade[];
}

// Add request interceptor to include auth token
api.interceptors.request.use(async (config) => {
  const token = await tokenService.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest) {
      try {
        // Refresh token
        const newToken = await authService.refreshToken();
        if (newToken) {
          // Retry request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
        // Logout user if token refresh fails
        await authService.logout();
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for cache management
const saveToCache = async (grades: Grade[]) => {
  try {
    const cacheData = {
      data: grades,
      timestamp: Date.now()
    };
    await SecureStore.setItemAsync(GRADES_CACHE_KEY, JSON.stringify(cacheData));
    await SecureStore.setItemAsync(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
  } catch (error) {
    console.error('Cache save error:', error);
  }
};

const getFromCache = async (): Promise<Grade[] | null> => {
  try {
    const cacheData = await SecureStore.getItemAsync(GRADES_CACHE_KEY);
    const expiryTime = await SecureStore.getItemAsync(CACHE_EXPIRY_KEY);
    
    if (!cacheData || !expiryTime) return null;
    
    const expiry = parseInt(expiryTime);
    if (Date.now() > expiry) {
      // Cache expired
      await clearCache();
      return null;
    }
    
    const { data } = JSON.parse(cacheData);
    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const clearCache = async () => {
  try {
    await SecureStore.deleteItemAsync(GRADES_CACHE_KEY);
    await SecureStore.deleteItemAsync(CACHE_EXPIRY_KEY);
  } catch (error) {
    console.error('Cache clear error:', error);
  }
};

export const gradeService = {
  // Get all student grades
  getStudentGrades: async (): Promise<Grade[]> => {
    try {
      // Check cache first
      const cachedGrades = await getFromCache();
      if (cachedGrades) {
        console.log('Grades loaded from cache');
        return cachedGrades;
      }

      console.log('Fetching grades from API...');
      const response = await api.get<{ success: boolean; data: Grade[] }>(
        API_CONFIG.ENDPOINTS.GRADES.SUMMARIZED
      );

      if (!response.data.success) {
        console.error('API response failed:', response.data);
        throw new Error('Failed to fetch grades');
      }

      console.log('API response successful:', {
        totalGrades: response.data.data.length,
        firstGrade: response.data.data[0]?.course_title,
      });

      // Save to cache
      await saveToCache(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching grades:', error);
      throw new Error('Failed to fetch grades');
    }
  },

  // Get grades for a specific semester
  getGradesBySemester: async (year: string, semester: number): Promise<Grade[]> => {
    try {
      // Check cache first
      const cachedGrades = await getFromCache();
      if (cachedGrades) {
        return cachedGrades.filter(
          grade => grade.academic_year === year && grade.semester === semester.toString()
        );
      }

      const response = await api.get<GradeResponse>(API_CONFIG.ENDPOINTS.GRADES.BY_SEMESTER(year, semester));
      if (!response.data.success) {
        throw new Error('Failed to fetch semester grades');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching semester grades:', error);
      throw new Error('Failed to fetch semester grades');
    }
  },

  // Get grade for a specific course
  getGradeByCourse: async (courseCode: string): Promise<Grade> => {
    try {
      // Check cache first
      const cachedGrades = await getFromCache();
      if (cachedGrades) {
        const grade = cachedGrades.find(g => g.course_code === courseCode);
        if (grade) return grade;
      }

      const response = await api.get<{ success: boolean; data: Grade }>(
        API_CONFIG.ENDPOINTS.GRADES.BY_COURSE(courseCode)
      );
      if (!response.data.success) {
        throw new Error('Failed to fetch course grade');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching course grade:', error);
      throw new Error('Failed to fetch course grade');
    }
  },

  // Calculate GPA
  calculateGPA: (grades: Grade[]): number => {
    if (grades.length === 0) return 0;
    
    const totalPoints = grades.reduce((sum, grade) => {
      // Calculate weighted average
      const midterm = grade.midterm_score * parseFloat(grade.midterm_weight);
      const final = grade.final_score * parseFloat(grade.final_weight);
      const project = grade.project_score ? grade.project_score * parseFloat(grade.project_weight || '0') : 0;
      const homework = grade.homework_score ? grade.homework_score * parseFloat(grade.homework_weight || '0') : 0;
      
      const totalScore = midterm + final + project + homework;
      return sum + (totalScore * grade.credits);
    }, 0);
    
    const totalCredits = grades.reduce((sum, grade) => {
      return sum + grade.credits;
    }, 0);
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  },

  // Clear cache
  clearGradesCache: clearCache
}; 