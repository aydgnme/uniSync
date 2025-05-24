export type UserRole = 'Student' | 'Professor' | 'Admin';

export interface AcademicInfo {
    program: string;
    semester: number;
    studentId: string;
    groupName: string;
    subgroupIndex: string;
    advisor: string;
    gpa: number;
    facultyId: string;
    specializationShortName: string;
    studyYear: number;
    _id?: string;
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
    enrolledLectures?: string[];
}

export interface UserProfileResponse {
    _id: {
        $oid: string;
    };
    email: string;
    password?: string;
    cnp: string;
    matriculationNumber: string;
    name: string;
    role: string;
    phone: string;
    address: string;
    academicInfo?: {
        program: string;
        semester: number;
        studyYear: number;
        groupName: string;
        subgroupIndex: string;
        studentId: string;
        advisor: string;
        gpa: number;
        specializationShortName: string;
        facultyId: string;
        _id: {
            $oid: string;
        };
    };
    enrolledLectures?: string[];
    __v: number;
}