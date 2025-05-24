export interface Course {
  id: string;
  name: string;
  grade: number;
  status: "PASSED" | "FAILED";
  components: {
    midterm: number;
    final: number;
    homework: number;
    attendance: number;
  };
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