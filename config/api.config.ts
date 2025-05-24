export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',  // Local development
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      GENERATE_RESET_CODE: '/auth/generate-reset-code',
      VERIFY_RESET_CODE: '/auth/verify-reset-code',
    },
    USER: {
      PROFILE: '/users',
      UPDATE_PROFILE: '/users/update',
      CHANGE_PASSWORD: '/users/change-password',
      GET_BY_MATRICULATION: (matriculationNumber: string) => `/users/by-matriculation?matriculationNumber=${matriculationNumber}`,
    },
    SCHEDULE: {
      TODAY: '/schedule/today',
      WEEKLY: '/schedule',
    },
    COURSES: {
      LIST: '/courses',
      DETAILS: (id: string) => `/courses/${id}`,
      SCHEDULE: '/courses/schedule',
      GRADES: '/courses/grades',
    },
    ANNOUNCEMENTS: {
      LIST: '/announcements',
      DETAILS: (id: string) => `/announcements/${id}`,
    },
  },
  TIMEOUT: 10000, // 10 seconds
}; 