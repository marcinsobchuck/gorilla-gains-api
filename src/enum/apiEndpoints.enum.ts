export enum ApiEndpoints {
  AUTH_BASE = '/api/auth',
  AUTH_REGISTER = '/register',
  AUTH_LOGIN = '/login',
  AUTH_FORGOT_PASSWORD = '/forgot-password',
  AUTH_VERIFY_PASSWORD_RESET_TOKEN = '/verify-password-reset-token',

  ACTIVITY_BASE = '/api/activity',
  ACTIVITY_USER = '/user',
  ACTIVITY_USER_ID = '/user/:userId',
  ACTIVITY_ACTIVITY_ID = 'user/:activityId',

  ACTIVITY_TYPES_BASE = '/api/activity-types',

  EXERCISES_BASE = '/api/exercises',

  USERS_SUMMARY_ACTIVITIES_BASE = '/api/users/summary/activities',

  USERS_BASE = '/api/users',
  USERS_VERIFY_PASSWORD = '/verify-password',
  USERS_CHANGE_PASSWORD = '/change-password'
}
