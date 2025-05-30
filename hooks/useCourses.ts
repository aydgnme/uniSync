import { courseService } from "@/services/course.service";
import { Course } from "@/types/course.type";
import { useEffect, useState } from "react";
import { useProfile } from "./useProfile";



export const useCourses = () => {
    const { user, loading: userLoading } = useProfile();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.academicInfo?.studentId) {
            courseService.fetchCoursesByStudent(user.id)
            .then(setCourses)
            .catch(error => {
                console.error('Failed to fetch courses: ',error);
                setError('Failed to load courses');
            })
            .finally(()=>setLoading(false));
        }
    }, [user]);

    return { courses, loading: loading || userLoading, error };
}