// Authentication Types

// Import types from other modules
import type { User } from './user';
import type { ApiError } from './api';
import type { PhoneInputData, PhoneInputProps } from './components';
import type { DeviceInfo } from './utils';

// Re-export commonly used types
export type { User, ApiError, DeviceInfo, PhoneInputData, PhoneInputProps };

// Registration interface based on the provided API body
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  user_type: 'customer' | 'provider';
  dial_code: string;
  country_code: string;
  device_info_json: string;
  device_onesignal_token: string;
  password_confirmation?: string;
  business_type?: string;
  website?: string;
  referral_code?: string;
}

// Login interface based on the provided API body
export interface LoginPayload {
  email: string;
  password: string;
  user_type: 'customer' | 'provider' | 'employee';
  device_info_json: string;
  device_onesignal_token: string;
}

// Auth-specific API Response interface
export interface AuthResponse {
  status: string;
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  verification_token?: string;
  reset_token?: string;
  redirect?: string;
  is_verified?: boolean;
  data?: {
    user: User;
    token: string;
  };
}

// Forgot Password interface
export interface ForgotPasswordPayload {
  user_type: 'customer' | 'provider' | 'employee';
  reset_type: 'email' | 'phone';
  email?: string;
  phone?: string;
  dial_code?: string;
  country_code?: string;
}

// Reset Password interface
export interface ResetPasswordPayload {
  password: string;
  password_confirmation: string;
  user_type: 'customer' | 'provider' | 'employee';
  code: number;
  reset_type: 'email' | 'phone';
  email?: string;
  phone?: string;
  dial_code?: string;
}


export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

 