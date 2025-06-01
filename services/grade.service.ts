import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api.config';
import { authService } from './auth.service';
import { tokenService } from './token.service';

const GRADES_CACHE_KEY = 'grades_cache';
const CACHE_EXPIRY_KEY = 'grades_cache_expiry';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  examType: 'midterm' | 'final' | 'homework' | 'attendance';
  score: number;
  letterGrade: string;
  gradedAt: string;
  createdBy: string;
  academicYear: string;
  semester: number;
  course: {
    code: string;
    title: string;
    credits: number;
    teacherName: string;
  };
}

interface GradeResponse {
  success: boolean;
  data: Grade[];
}

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

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
        API_CONFIG.ENDPOINTS.GRADES.MY
      );

      if (!response.data.success) {
        console.error('API response failed:', response.data);
        throw new Error('Failed to fetch grades');
      }

      console.log('API response successful:', {
        totalGrades: response.data.data.length,
        firstGrade: response.data.data[0]?.course?.title,
        lastUpdated: response.data.data[0]?.gradedAt
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
          grade => grade.academicYear === year && grade.semester === semester
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
        const grade = cachedGrades.find(g => g.course.code === courseCode);
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
      // Convert letter grade to numeric value
      const numericGrade = parseFloat(grade.letterGrade);
      return sum + (numericGrade * grade.course.credits);
    }, 0);
    
    const totalCredits = grades.reduce((sum, grade) => {
      return sum + grade.course.credits;
    }, 0);
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  },

  // Clear cache
  clearGradesCache: clearCache
}; 