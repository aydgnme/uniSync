export interface GradeResponse {
    _id: string;
    studentId: string;
    academicYear: string;
    semester: number;
    midtermGrade: number;
    finalGrade: number;
    homeworkGrade: number;
    attendanceGrade: number;
    totalGrade: number;
    status: 'PASSED' | 'FAILED';
    retakeCount: number;
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
    lecture: {
        code: string;
        title: string;
    };
}

export interface Course {
    id: string;
    name: string;
    code: string;
    grade: number;
    status: "PASSED" | "FAILED";
    credits: number;
    components: {
        midterm: number;
        final: number;
        homework: number;
        attendance: number;
    };
}

export interface SemesterData {
    year: string;
    semester: string;
    courses: Course[];
} 