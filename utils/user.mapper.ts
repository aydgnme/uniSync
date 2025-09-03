import { User } from '@/contexts/AuthContext';

interface UserProfileResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number?: string;
  gender?: 'male' | 'female' | 'other';
  date_of_birth?: string;
  nationality?: string;
  cnp?: string;
  matriculation_number?: string;
  student_info?: {
    cnp: string;
    matriculation_number: string;
    advisor?: string;
    is_modular?: boolean;
    gpa?: number;
    group_id: string;
    faculty_id?: string;
    faculty_name?: string;
    semester?: number;
    study_year?: number;
    group_name?: string;
    subgroup_index?: string;
    specialization_short_name?: string;
    specialization_name?: string;
    student_id?: string;
  };
}

export const mapUserProfileResponse = (response: UserProfileResponse): User => {
  const info = response.student_info || {
    cnp: '',
    matriculation_number: '',
    advisor: '',
    is_modular: false,
    gpa: 0,
    group_id: '',
    faculty_id: '',
    faculty_name: '',
    semester: 1,
    study_year: 1,
    group_name: '',
    subgroup_index: '',
    specialization_short_name: '',
    specialization_name: '',
    student_id: ''
  };

  return {
    id: response.id,
    email: response.email,
    name: `${response.first_name} ${response.last_name}`,
    role: response.role || 'student',
    phone: response.phone_number,
    gender: response.gender,
    dateOfBirth: response.date_of_birth,
    nationality: response.nationality,
    cnp: info.cnp || response.cnp,
    matriculationNumber: info.matriculation_number || response.matriculation_number,
    academicInfo: {
      advisor: info.advisor || '',
      gpa: info.gpa || 0,
      facultyId: info.faculty_id || '',
      facultyName: info.faculty_name || '',
      groupName: info.group_name || '',
      subgroupIndex: info.subgroup_index || '',
      semester: info.semester || 1,
      studyYear: info.study_year || 1,
      specializationId: info.group_id || '',
      specializationShortName: info.specialization_short_name || '',
      program: info.specialization_name || '',
      isModular: info.is_modular ?? false,
      studentId: info.student_id || ''
    }
  };
}; 