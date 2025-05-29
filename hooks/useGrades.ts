import { useAuth } from '@/context/AuthContext';
import { Course, GradeResponse, SemesterData } from '@/types/grade.type';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:3000'; // Port where the API is running

interface UseGradesReturn {
    grades: GradeResponse[];
    loading: boolean;
    error: string | null;
    selectedYear: string;
    availableYears: string[];
    currentYearData: SemesterData[];
    handleYearChange: (year: string) => void;
    selectedSemester: number;
    handleSemesterChange: (semester: number) => void;
}

export const useGrades = (): UseGradesReturn => {
    const { user } = useAuth();
    const [grades, setGrades] = useState<GradeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedSemester, setSelectedSemester] = useState<number>(2);

    // Get current academic year
    const getCurrentAcademicYear = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
        
        // If we're in the second semester (after February), use current year
        // Otherwise use previous year
        const academicYear = currentMonth >= 2 ? currentYear : currentYear - 1;
        return `${academicYear}-${academicYear + 1}`;
    };

    // Memoize available years since it won't change during component lifecycle
    const availableYears = useMemo(() => {
        console.log('Available years calculation - Current grades:', grades);
        const years = new Set(grades.map(grade => grade.academicYear));
        const sortedYears = Array.from(years).sort((a, b) => b.localeCompare(a));
        console.log('Available years:', sortedYears);
        return sortedYears;
    }, [grades]);

    // Set initial year when component mounts
    useEffect(() => {
        if (!selectedYear) {
            const currentYear = getCurrentAcademicYear();
            console.log('Setting initial academic year:', currentYear);
            setSelectedYear(currentYear);
        }
    }, [selectedYear]);

    // Memoize current year and semester data
    const currentYearData = useMemo<SemesterData[]>(() => {
        if (!selectedYear || !grades.length) return [];
        const filtered = grades.filter(g => g.academicYear === selectedYear && g.semester === selectedSemester);
        if (!filtered.length) return [];
        const semesterGroups = filtered.reduce((acc, grade) => {
            const semester = grade.semester.toString();
            if (!acc[semester]) acc[semester] = [];
            acc[semester].push({
                id: grade._id,
                name: grade.lecture.title,
                code: grade.lecture.code,
                grade: grade.totalGrade,
                status: grade.status,
                credits: 3,
                components: {
                    midterm: grade.midtermGrade,
                    final: grade.finalGrade,
                    homework: grade.homeworkGrade,
                    attendance: grade.attendanceGrade
                }
            });
            return acc;
        }, {} as Record<string, Course[]>);
        return Object.entries(semesterGroups).map(([semester, courses]) => ({
            year: selectedYear,
            semester,
            courses
        }));
    }, [selectedYear, selectedSemester, grades]);

    useEffect(() => {
        const fetchGrades = async () => {
            if (!user?._id) {
                console.log('No user ID available');
                setError('User information not found.');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching grades for student:', user._id);
                console.log('Selected year:', selectedYear);
                const url = `/api/course-grades/student/${user._id}`;
                console.log('API URL:', url);
                
                const response = await axios.get(url, {
                    params: {
                        academicYear: selectedYear,
                        semester: 2 // Currently getting grades for semester 2
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000,
                    validateStatus: (status) => status < 500
                });
                
                console.log('Raw API Response:', response);
                console.log('Response data:', response.data);
                console.log('Response data type:', typeof response.data);
                console.log('Is array?', Array.isArray(response.data));
                console.log('Data length:', response.data?.length);
                
                if (!Array.isArray(response.data)) {
                    console.error('API response is not an array:', response.data);
                    throw new Error('Invalid API response format');
                }
                
                if (response.data.length === 0) {
                    console.log('API returned empty array');
                    setError('No grades found for this semester.');
                } else {
                    console.log('Setting grades:', response.data);
                    setGrades(response.data);
                    setError(null);
                }
            } catch (err) {
                console.error('Error details:', err);
                if (axios.isAxiosError(err)) {
                    console.error('Axios error response:', err.response?.data);
                    console.error('Axios error status:', err.response?.status);
                    console.error('Axios error config:', err.config);
                    console.error('Axios error message:', err.message);
                    
                    if (err.code === 'ECONNABORTED') {
                        setError('API did not respond. Please try again later.');
                    } else if (err.code === 'ERR_NETWORK') {
                        setError('Could not connect to API. Please check your internet connection.');
                    } else {
                        setError(`An error occurred while loading grades: ${err.message}`);
                    }
                } else {
                    setError('An error occurred while loading grades.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (selectedYear) {
            console.log('Selected year changed, fetching grades...');
            fetchGrades();
        } else {
            console.log('No year selected, skipping fetch');
        }
    }, [selectedYear, user?._id]);

    // Memoize year selection handler
    const handleYearChange = useCallback((year: string) => {
        console.log('Year change requested:', year);
        setSelectedYear(year);
    }, []);

    const handleSemesterChange = useCallback((semester: number) => {
        setSelectedSemester(semester);
    }, []);

    return {
        grades,
        loading,
        error,
        selectedYear,
        availableYears,
        currentYearData,
        handleYearChange,
        selectedSemester,
        handleSemesterChange
    };
}; 