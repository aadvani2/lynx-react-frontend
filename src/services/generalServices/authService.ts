// src/services/authService.ts
import { api } from "../api/api";
import { AuthEndpoints } from "../apiEndpoints/auth";
import type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  ApiError,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload
} from "../../types/auth";

// Re-export types for backward compatibility
export type {
  User,
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload
} from "../../types/auth";

// Verification payload interface
export interface VerifyCodePayload {
  verification_code: string;
  token: string;
}

export const authService = {
  // Registration
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const response = await api.post(AuthEndpoints.REGISTER, payload);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        const errorMessage = apiError.response?.data?.message ||
          apiError.message ||
          'Registration failed';
        throw new Error(errorMessage);
      } else {
        throw new Error('Registration failed');
      }
    }
  },

  // Login
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const response = await api.post(AuthEndpoints.LOGIN, payload);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        // Extract error message from different possible locations
        const errorMessage = 
          (apiError as any)?.message ||  // Direct message property
          apiError.response?.data?.message ||  // Response data message
          apiError.message ||  // Error message
          'Invalid email or password. Please try again.';  // Default message
        throw new Error(errorMessage);
      } else {
        throw new Error('Invalid email or password. Please try again.');
      }
    }
  },

  // Verify Code
  verifyCode: async (payload: VerifyCodePayload): Promise<AuthResponse> => {
    try {
      const response = await api.post(AuthEndpoints.VERIFY_CODE, payload);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        const errorMessage = apiError.response?.data?.message ||
          apiError.message ||
          'Verification failed';
        throw new Error(errorMessage);
      } else {
        throw new Error('Verification failed');
      }
    }
  },

  // Resend OTP
  resendOtp: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await api.get(`${AuthEndpoints.RESEND_OTP}?token=${token}`);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        const errorMessage = apiError.response?.data?.message ||
          apiError.message ||
          'Failed to resend OTP';
        throw new Error(errorMessage);
      } else {
        throw new Error('Failed to resend OTP');
      }
    }
  },

  // Forgot Password
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<AuthResponse> => {
    try {
      const response = await api.post(AuthEndpoints.FORGOT_PASSWORD, payload);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        const errorMessage = apiError.response?.data?.message ||
          apiError.message ||
          'Forgot password request failed';
        throw new Error(errorMessage);
      } else {
        throw new Error('Forgot password request failed');
      }
    }
  },

  // Reset Password
  resetPassword: async (payload: ResetPasswordPayload): Promise<AuthResponse> => {
    try {
      const response = await api.post(AuthEndpoints.DO_RESET_PASSWORD, payload);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        const errorMessage = apiError.response?.data?.message ||
          apiError.message ||
          'Password reset failed';
        throw new Error(errorMessage);
      } else {
        throw new Error('Password reset failed');
      }
    }
  },

  // Delete Account
  deleteAccount: async (): Promise<AuthResponse> => {
    try {
      const response = await api.post(AuthEndpoints.DELETE_ACCOUNT,null);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        const errorMessage = apiError.response?.data?.message ||
          apiError.message ||
          'Account deletion failed';
        throw new Error(errorMessage);
      } else {
        throw new Error('Account deletion failed');
      }
    }
  },

  // Change Password
  changePassword: async (payload: ChangePasswordPayload): Promise<AuthResponse> => {
    try {
      const response = await api.post(AuthEndpoints.CHANGE_PASSWORD, payload);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        const errorMessage = apiError.response?.data?.message ||
          apiError.message ||
          'Password change failed';
        throw new Error(errorMessage);
      } else {
        throw new Error('Password change failed');
      }
    }
  },

  // Logout - Main logout function for all user types
  logout: async (userType: 'customer' | 'provider' | 'employee', logoutAll?: number, deviceId?: number): Promise<AuthResponse> => {
    try {
      const payload: Record<string, unknown> = {
        user_type: userType,
      };

      // Add optional parameters if provided
      if (logoutAll !== undefined) {
        payload.logout_all = logoutAll;
      }
      if (deviceId !== undefined) {
        payload.device_id = deviceId;
      }
      
      const response = await api.post(AuthEndpoints.LOGOUT, payload);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        const errorMessage = apiError.response?.data?.message ||
          apiError.message ||
          'Logout failed';
        throw new Error(errorMessage);
      } else {
        throw new Error('Logout failed');
      }
    }
  },

  // Logout Device
  logoutDevice: async (deviceId: number, logoutAll: boolean = false): Promise<AuthResponse> => {
    try {
      const payload = logoutAll 
        ? { logout_all: 2, device_id: "0" }
        : { logout_all: 0, device_id: deviceId.toString() };
      
      const response = await api.post(AuthEndpoints.LOGOUT_DEVICE, payload);
      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (error instanceof Error) {
        throw new Error(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        const errorMessage = apiError.response?.data?.message ||
          apiError.message ||
          'Logout device failed';
        throw new Error(errorMessage);
      } else {
        throw new Error('Logout device failed');
      }
    }
  },
};
