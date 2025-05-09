export interface Course {
  code: string;
  title: string;
  instructor: string;
  credits: number;
  midtermGrade: number;
  finalGrade: number;
  totalGrade: number;
  status: "Passed" | "Failed";
}

export interface Semester {
  semester: number;
  courses: Course[];
}

export interface Year {
  year: number;
  semesters: Semester[];
}

export interface GradesData {
  matriculationNumber: string;
  years: Year[];
}

export interface SemesterData {
  year: string;
  semester: string;
  courses: Course[];
} 