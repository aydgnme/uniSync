export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3031/api', // fallback for dev
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  ENDPOINTS: {
    SYSTEM: {
      HEALTH: '/system/health',
    },
    TIME: {
      ACADEMIC_CALENDAR: '/time/academic-calendar',
    },
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      VALIDATE: '/auth/validate',
      FORGOT_PASSWORD: '/auth/generate-reset-code',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-reset-code',
      RESEND_VERIFICATION: '/auth/resend-verification',
      CHANGE_PASSWORD: '/users/change-password',
    },
    USER: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      CHANGE_PASSWORD: '/users/change-password',
      UPLOAD_AVATAR: '/users/avatar',
      GET_BY_MATRICULATION: (matriculationNumber: string) =>
        `/users/by-matriculation/${matriculationNumber}`,
      SESSIONS: '/users/sessions',
      LOGOUT_SESSION: '/users/sessions/logout',
      LOGOUT_ALL_SESSIONS: '/users/sessions/logout-all',
    },
    GRADES: {
      MY: '/grades/my',
      SUMMARIZED: '/grades/summarized',
      BY_SEMESTER: (year: string, semester: number) => `/grades/semester/${year}/${semester}`,
      BY_COURSE: (courseCode: string) => `/grades/course/${courseCode}`,
    },
    SCHEDULE: {
      TODAY: '/schedule/today',
      WEEKLY: '/schedule',
      MY: '/schedule/my',
      BY_GROUP: (groupId: string) => `/schedule/group/${groupId}`,
    },
    COURSES: {
      LIST: '/courses',
      MY: '/courses/my',
      SCHEDULE: '/courses/schedule',
    },
    ANNOUNCEMENTS: {
      LIST: '/announcements',
      DETAILS: (id: string) => `/announcements/${id}`,
      CREATE: '/announcements',
      UPDATE: (id: string) => `/announcements/${id}`,
      DELETE: (id: string) => `/announcements/${id}`,
    },
    UNIVERSITY: {
      ANNOUNCEMENTS: '/university/announcements',
    },
    CLASSROOM: {
      ALL: '/classroom/classrooms',
      BY_STUDENT: (id: string) => `/classroom/student/${id}`,
      ENROLL: '/classroom/enroll',
    }
  },
} as const;

export type ApiEndpoint = typeof API_CONFIG.ENDPOINTS;