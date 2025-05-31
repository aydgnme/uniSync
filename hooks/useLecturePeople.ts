import { useEffect, useState } from 'react';

export interface Person {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'assistant';
  email?: string;
  avatar?: string;
  department?: string;
  studentId?: string;
}

export const useLecturePeople = (courseId: string) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPeople();
  }, [courseId]);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      // For now, using mock data
      const mockPeople: Person[] = [
        {
          id: '1',
          name: 'John Doe',
          role: 'student',
          email: 'john.doe@example.com',
          studentId: '2024001',
          department: 'Computer Science'
        },
        {
          id: '2',
          name: 'Jane Smith',
          role: 'student',
          email: 'jane.smith@example.com',
          studentId: '2024002',
          department: 'Computer Science'
        },
        {
          id: '3',
          name: 'Dr. Robert Johnson',
          role: 'teacher',
          email: 'robert.johnson@example.com',
          department: 'Computer Science'
        },
        {
          id: '4',
          name: 'Alice Brown',
          role: 'assistant',
          email: 'alice.brown@example.com',
          department: 'Computer Science'
        }
      ];
      setPeople(mockPeople);
      setError(null);
    } catch (err) {
      setError('Failed to fetch people');
      console.error('Error fetching people:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPerson = async (person: Omit<Person, 'id'>) => {
    try {
      // TODO: Implement actual API call
      const newPerson: Person = {
        ...person,
        id: Date.now().toString()
      };
      setPeople(prev => [...prev, newPerson]);
    } catch (err) {
      console.error('Error adding person:', err);
      throw err;
    }
  };

  const removePerson = async (personId: string) => {
    try {
      // TODO: Implement actual API call
      setPeople(prev => prev.filter(person => person.id !== personId));
    } catch (err) {
      console.error('Error removing person:', err);
      throw err;
    }
  };

  const updatePersonRole = async (personId: string, role: Person['role']) => {
    try {
      // TODO: Implement actual API call
      setPeople(prev =>
        prev.map(person =>
          person.id === personId
            ? { ...person, role }
            : person
        )
      );
    } catch (err) {
      console.error('Error updating person role:', err);
      throw err;
    }
  };

  return {
    people,
    loading,
    error,
    refetch: fetchPeople,
    addPerson,
    removePerson,
    updatePersonRole
  };
}; 