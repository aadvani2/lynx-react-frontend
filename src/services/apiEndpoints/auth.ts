// Authentication API endpoints
export const AuthEndpoints = {
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_CODE: '/verify-code',
  RESEND_OTP: '/resend-otp',
  CHANGE_PASSWORD: '/do-change-password',
  
  FORGOT_PASSWORD: '/do-forgot-password',
  DO_RESET_PASSWORD: '/do-reset-password',
  DELETE_ACCOUNT: '/delete-my-account',
  LOGOUT: '/api/logout',
  LOGOUT_DEVICE: '/logout-device',

} as const;
