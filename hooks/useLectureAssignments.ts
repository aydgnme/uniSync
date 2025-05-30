import { courseService } from "@/services/course.service";
import { Assignment } from "@/types/lecture.type";
import { useEffect, useState } from "react";

export const useLectureAssignments = (lectureId: string) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    courseService.fetchAssignments(lectureId)
      .then(setAssignments)
      .catch(err => {
        console.error("Failed to fetch assignments", err);
        setError("Could not load assignments");
      })
      .finally(() => setLoading(false));
  }, [lectureId]);

  return { assignments, loading, error };
};