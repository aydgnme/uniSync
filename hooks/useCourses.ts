import { API_CONFIG } from '@/config/api.config';
import { tokenService } from '@/services/token.service';
import axios from 'axios';
import { useEffect, useState } from 'react';

export interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  color: string;
  banner: string;
  academicYear: string;
  semester: number;
}

interface CourseResponse {
  success: boolean;
  data: Course[];
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = await tokenService.getToken();
      
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.get<CourseResponse>(API_CONFIG.ENDPOINTS.COURSES.MY, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data.success) {
        throw new Error('Failed to fetch courses');
      }

      setCourses(response.data.data);
      setError(null);
    } catch (err) {
      setError('Error fetching courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
}; 