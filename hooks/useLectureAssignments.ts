import { useEffect, useState } from 'react';

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  points: number;
  topic: string;
  description?: string;
  status?: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  grade?: number;
}

export const useLectureAssignments = (courseId: string) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      // For now, using mock data
      const mockAssignments: Assignment[] = [
        {
          id: '1',
          title: 'Programming Assignment 1',
          dueDate: '2024-03-01',
          points: 100,
          topic: 'Basic Programming Concepts',
          description: 'Implement basic data structures and algorithms',
          status: 'not_started'
        },
        {
          id: '2',
          title: 'Midterm Project',
          dueDate: '2024-03-15',
          points: 200,
          topic: 'Advanced Data Structures',
          description: 'Design and implement a complex data structure',
          status: 'in_progress'
        }
      ];
      setAssignments(mockAssignments);
      setError(null);
    } catch (err) {
      setError('Failed to fetch assignments');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitAssignment = async (assignmentId: string, submission: any) => {
    try {
      // TODO: Implement actual API call
      setAssignments(prev =>
        prev.map(assignment =>
          assignment.id === assignmentId
            ? { ...assignment, status: 'submitted' }
            : assignment
        )
      );
    } catch (err) {
      console.error('Error submitting assignment:', err);
      throw err;
    }
  };

  const updateAssignmentStatus = async (assignmentId: string, status: Assignment['status']) => {
    try {
      // TODO: Implement actual API call
      setAssignments(prev =>
        prev.map(assignment =>
          assignment.id === assignmentId
            ? { ...assignment, status }
            : assignment
        )
      );
    } catch (err) {
      console.error('Error updating assignment status:', err);
      throw err;
    }
  };

  return {
    assignments,
    loading,
    error,
    refetch: fetchAssignments,
    submitAssignment,
    updateAssignmentStatus
  };
}; 