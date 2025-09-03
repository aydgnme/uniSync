export interface Course {
  id: string;
  name: string;
  code: string;
  grade: number;
  status: "PASSED" | "FAILED";
  credits: number;
  components: {
    midterm: {
      score: number;
      weight: number;
    };
    final: {
      score: number;
      weight: number;
    };
    project?: {
      score: number;
      weight: number;
    };
    homework?: {
      score: number;
      weight: number;
    };
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