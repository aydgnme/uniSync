export type UserRole = 'Student' | 'Professor' | 'Admin';

export interface AcademicInfo {
    program: string;
    semester: number;
    studentId: string;
    advisor: string;
    group: string;
    subgroup: string;
    gpa: number;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone?: string;
    address?: string;
    cnp?: string;
    matriculationNumber?: string;
    academicInfo?: AcademicInfo;
    profileImageUrl?: string;
}

export interface UserProfileResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    cnp?: string;
    matriculationNumber?: string;
    academicInfo?: {
        program?: string;
        semester?: number;
        studentId?: string;
        advisor?: string;
        gpa?: number;
        group?: string;
        subgroup?: string;
    };
    profileImageUrl?: string;
}