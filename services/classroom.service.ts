import api from './api.service';

export interface Classroom {
  course_id: string;
  course_code: string;
  course_title: string;
  course_type: string;
  teacher_id: string;
  schedule_start_time: string;
  schedule_end_time: string;
  schedule_room: string;
  teacher_first_name: string;
  teacher_last_name: string;
}

export const classroomService = {
  // Get all classrooms
  getAllClassrooms: async (): Promise<Classroom[]> => {
    const response = await api.get('/classroom/classrooms');
    return response.data;
  },

  // Get classrooms for a student
  getStudentClassrooms: async (studentId: string): Promise<Classroom[]> => {
    const response = await api.get(`/classroom/student/${studentId}`);
    return response.data;
  },

  // Enroll a student in a course
  enrollStudent: async (student_id: string, course_id: string): Promise<{ message: string; student_id: string; course_id: string }> => {
    const response = await api.post('/classroom/enroll', { student_id, course_id });
    return response.data;
  }
};