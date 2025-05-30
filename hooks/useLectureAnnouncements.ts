import { courseService } from "@/services/course.service";
import { Announcement } from "@/types/lecture.type";
import { useEffect, useState } from "react";

export const useLectureAnnouncements = (lectureId: string) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    courseService.fetchAnnouncements(lectureId)
      .then(setAnnouncements)
      .catch(err => {
        console.error("Failed to fetch announcements", err);
        setError("Could not load announcements");
      })
      .finally(() => setLoading(false));
  }, [lectureId]);

  return { announcements, loading, error };
};