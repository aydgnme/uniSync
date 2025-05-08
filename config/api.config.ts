export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:3000/api', // Örnek API URL'si
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
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile/update',
      CHANGE_PASSWORD: '/user/change-password',
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
  TIMEOUT: 10000, // 10 saniye
}; 