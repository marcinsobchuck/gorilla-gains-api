export enum ApiEndpoints {
  AUTH_BASE = '/api/auth',
  AUTH_REGISTER = '/register',
  AUTH_LOGIN = '/login',
  AUTH_FORGOT_PASSWORD = '/forgot-password',
  AUTH_VERIFY_PASSWORD_RESET_TOKEN = '/verify-password-reset-token',

  ACTIVITY_BASE = '/api/activity',
  ACTIVITY_USER = '/user',
  ACTIVITY_USER_ID = '/user/:userId',
  ACTIVITY_ACTIVITY_ID = '/user/:activityId',

  ACTIVITY_PRESETS_BASE = '/api/presets',
  ACTIVITY_PRESET_ID = '/:presetId',

  ACTIVITY_TYPES_BASE = '/api/activity-types',

  EXERCISES_BASE = '/api/exercises',
  TOGGLE_FAVOURITE_EXERCISE = '/user/:exerciseId',
  FAVOURITE_EXERCISES = '/user/favourite-exercises',

  USERS_SUMMARY_ACTIVITIES_BASE = '/api/users/summary/activities',

  USERS_BASE = '/api/users',
  USERS_VERIFY_PASSWORD = '/verify-password',
  USERS_CHANGE_PASSWORD = '/change-password'
}
