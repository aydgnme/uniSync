// src/config/api.config.ts

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api', // fallback for dev
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      RESEND_VERIFICATION: '/auth/resend-verification',
    },
    USER: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      CHANGE_PASSWORD: '/users/change-password',
      UPLOAD_AVATAR: '/users/avatar',
      GET_BY_MATRICULATION: (matriculationNumber: string) =>
        `/users/by-matriculation/${matriculationNumber}`,
    },
    SCHEDULE: {
      TODAY: '/schedule/today',
      WEEKLY: '/schedule',
      MY: '/schedule/my',
      BY_GROUP: (groupId: string) => `/schedule/group/${groupId}`,
    },
    COURSES: {
      LIST: '/courses',
      DETAILS: (id: string) => `/courses/${id}`,
      ENROLL: (id: string) => `/courses/${id}/enroll`,
      UNENROLL: (id: string) => `/courses/${id}/unenroll`,
      GRADES: (id: string) => `/courses/${id}/grades`,
      SCHEDULE: '/courses/schedule',
      PEOPLE: (id: string) => `/people/${id}`,
    },
    ANNOUNCEMENTS: {
      LIST: '/announcements',
      DETAILS: (id: string) => `/announcements/${id}`,
      CREATE: '/announcements',
      UPDATE: (id: string) => `/announcements/${id}`,
      DELETE: (id: string) => `/announcements/${id}`,
    },
  },
} as const;

export type ApiEndpoint = typeof API_CONFIG.ENDPOINTS;