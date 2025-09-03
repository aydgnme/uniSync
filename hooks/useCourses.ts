import { Classroom, classroomService } from '@/services/classroom.service';
import { Course } from '@/types/calendar.type';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

function getBannerForType(type: string): string {
  if (type === 'LAB') return require('@/assets/images/img_code.jpg');
  if (type === 'LECTURE') return require('@/assets/images/img_bookclub.jpg');
  if (type === 'SEMINAR') return require('@/assets/images/img_reachout.jpg');
  return require('@/assets/images/img_bookclub.jpg'); // default
}

function mapClassroomToCourse(classroom: Classroom): Course {
  
  return {
    id: classroom.course_id,
    code: classroom.course_code,
    title: classroom.course_title,
    type: (classroom.course_type || 'LECTURE') as 'LECTURE' | 'LAB' | 'SEMINAR',
    startTime: classroom.schedule_start_time || '',
    endTime: classroom.schedule_end_time || '',
    duration: 0, 
    room: classroom.schedule_room || '',
    teacher: { full_name: `${classroom.teacher_first_name} ${classroom.teacher_last_name}` },
    weekDay: 1, 
    instructor: `${classroom.teacher_first_name} ${classroom.teacher_last_name}`,
    time: classroom.schedule_start_time && classroom.schedule_end_time
      ? `${moment(classroom.schedule_start_time, 'HH:mm:ss').format('HH:mm')} - ${moment(classroom.schedule_end_time, 'HH:mm:ss').format('HH:mm')}`
      : '',
    color: '#4A90E2',
    banner: classroom.course_code?.substring(0, 2) || '',
    date: '',
    group: '',
    location: classroom.schedule_room || '',
    weeks: [],
    style: {
      backgroundColor: classroom.course_type === 'LAB' ? '#FFE0B2' : classroom.course_type === 'LECTURE' ? '#eaf4fb' : '#FFD6E0',
      borderLeftWidth: 3,
      borderLeftColor: classroom.course_type === 'LAB' ? '#FB8C00' : classroom.course_type === 'LECTURE' ? '#2196F3' : '#C2185B',
    },
  };
}

export const useCourses = (studentId: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await classroomService.getStudentClassrooms(studentId);
      console.log('API classroom data:', data);
      const mappedCourses = data.map(mapClassroomToCourse);
      console.log('Mapped courses:', mappedCourses);
      setCourses(mappedCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Error fetching courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      fetchCourses();
    }
  }, [fetchCourses, studentId]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
  };
};