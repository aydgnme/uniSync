import { courseService } from "@/services/course.service";
import { LecturePerson } from "@/types/lecture.type";
import { useEffect, useState } from "react";

export const useLecturePeople = (lectureId: string) => {
  const [people, setPeople] = useState<LecturePerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    courseService.fetchPeople(lectureId)
      .then(setPeople)
      .catch(err => {
        console.error("Failed to fetch people", err);
        setError("Could not load participants");
      })
      .finally(() => setLoading(false));
  }, [lectureId]);

  return { people, loading, error };
};