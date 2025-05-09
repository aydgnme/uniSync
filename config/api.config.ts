export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',  // Update this with your actual API URL
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
      PROFILE: '/users',
      UPDATE_PROFILE: '/users/update',
      CHANGE_PASSWORD: '/users/change-password',
    },
    SCHEDULE: {
      TODAY: '/schedules/today',
      WEEKLY: '/schedules',
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