import { Course } from "@/types/course.type";
import axios from "axios";


export const courseService = {
    async fetchCoursesByStudent(studentId: string): Promise<Course[]>  {
        const response = await axios.get<any[]>(`/api/classroom/student/${studentId}`);
        return response.data.map(course => ({
            id: course._id || course.id,
            code: course.code,
            title: course.title,
            type: course.type || 'LECTURE',
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
    }
};