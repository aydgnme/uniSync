import gradesData from '@/data/grades.json';

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

export interface StudentGrades {
    matriculationNumber: string;
    years: Year[];
}

// Type assertion for imported data
const typedGradesData = gradesData as StudentGrades;

export const getAvailableYears = (): number[] => {
    return typedGradesData.years.map(year => year.year);
};

export const getSemestersByYear = (year: number): Semester[] | null => {
    const yearData = typedGradesData.years.find(y => y.year === year);
    return yearData?.semesters || null;
};

export const getCourseByCode = (courseCode: string): Course | null => {
    for (const year of typedGradesData.years) {
        for (const semester of year.semesters) {
            const course = semester.courses.find(c => c.code === courseCode);
            if (course) return course;
        }
    }
    return null;
};

export const calculateGPA = (courses: Course[]): number => {
    if (courses.length === 0) return 0;
    
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const weightedSum = courses.reduce((sum, course) => sum + (course.totalGrade * course.credits), 0);
    
    return Number((weightedSum / totalCredits).toFixed(2));
}; 