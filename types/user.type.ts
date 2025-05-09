export type UserRole = 'Student' | 'Professor' | 'Admin';

export interface AcademicInfo {
    program: string;
    semester: number;
    studentId: string;
    groupName: string;
    subgroupIndex: string;
    advisor: string;
    gpa: number;
}

export interface User {
    id: string;
    email: string;
    passwordHash?: string;
    cnp?: string;
    matriculationNumber: string;
    name: string;
    role: UserRole;
    phone: string;
    address: string;
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
        groupName?: string;
        subgroupIndex?: string;
    };
    profileImageUrl?: string;
}