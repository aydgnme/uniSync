export type UserRole = 'Student' | 'Professor' | 'Admin';

export interface AcademicInfo {
  program: string;
  semester: number;
  studyYear: number;
  studentId: string;
  advisor: string;
  groupName: string;
  subgroupIndex: string;
  gpa: number;
  facultyId: string;
  specializationShortName: string;
}

export interface User {
  id: string; // UUID or numeric ID from SQL
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  address: string;
  cnp?: string;
  matriculationNumber: string;
  academicInfo?: AcademicInfo;
  profileImageUrl?: string;
  enrolledLectures?: string[]; // lecture IDs (UUID[] in SQL)
}