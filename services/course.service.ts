import { Course } from "@/types/course.type";
import { Announcement, Assignment, LecturePerson } from "@/types/lecture.type";
import { apiService } from "./api.service";

interface ClassroomResponse {
  announcements?: Announcement[];
  assignments?: Assignment[];
  people?: LecturePerson[];
}

export const courseService = {
    async fetchCoursesByStudent(studentId: string): Promise<Course[]> {
        const response = await apiService.get<any[]>(`/classroom/student/${studentId}`);
        return response.map(course => ({
            id: course._id || course.id,
            code: course.code,
            title: course.title,
            type: course.type,
            startTime: course.startTime,
            endTime: course.endTime,
            duration: course.duration,
            room: course.room,
            teacher: course.teacher,
            weekDay: course.weekDay,
            instructor: course.instructor,
            time: course.time,
            color: course.color || '#1a73e8',
            banner: course.banner || 'https://picsum.photos/800/400'
        }));
    },

    async fetchAnnouncements(lectureId: string): Promise<Announcement[]> {
        const response = await apiService.get<ClassroomResponse>(`/classroom/classrooms/${lectureId}`);
        console.log('Announcements API Response:', response);
        
        if (response?.announcements) {
            return response.announcements;
        }
        
        if (Array.isArray(response)) {
            return response;
        }
        
        console.warn('Unexpected announcements response format:', response);
        return [];
    },

    async fetchAssignments(lectureId: string): Promise<Assignment[]> {
        const response = await apiService.get<ClassroomResponse>(`/classroom/classrooms/${lectureId}`);
        console.log('Assignments API Response:', response);
        
        if (response?.assignments) {
            return response.assignments;
        }
        
        if (Array.isArray(response)) {
            return response;
        }
        
        console.warn('Unexpected assignments response format:', response);
        return [];
    },

    async fetchPeople(lectureId: string): Promise<LecturePerson[]> {
        const response = await apiService.get<ClassroomResponse>(`/classroom/classrooms/${lectureId}`);
        console.log('People API Response:', response);
        
        if (response?.people) {
            return response.people;
        }
        
        if (Array.isArray(response)) {
            return response;
        }
        
        console.warn('Unexpected people response format:', response);
        return [];
    }
};