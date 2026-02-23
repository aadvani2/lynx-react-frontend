import { create } from 'zustand';
import { authService } from '../services/generalServices/authService';
import { loginSchema } from '../utils/validationSchemas';
import { getDeviceInfoJson } from '../utils/deviceInfo';
import type { LoginPayload } from '../types/auth';
import { useAuthStore } from './authStore';
import * as yup from 'yup';
import Swal from 'sweetalert2';

// Form data interface
export interface LoginFormData {
  email: string;
  password: string;
  user_type: 'customer' | 'provider' | 'employee';
}

// Login store state
interface LoginState {
  formData: LoginFormData;
  isSubmitting: boolean;
  validationErrors: Record<string, string>;
}

// Login store actions
interface LoginActions {
  // Form data management
  updateFormField: (field: keyof LoginFormData, value: string) => void;
  updateUserType: (userType: 'customer' | 'provider' | 'employee') => void;
  resetForm: () => void;

  // Validation
  validateForm: () => Promise<boolean>;
  clearValidationErrors: () => void;

  // Submission
  submitLogin: () => Promise<{ success: boolean; redirectPath?: string } | void>;

  // State management
  setSubmitting: (submitting: boolean) => void;
  setValidationErrors: (errors: Record<string, string>) => void;
}

export type LoginStore = LoginState & LoginActions;

// Initial form state
const initialFormData: LoginFormData = {
  email: "",
  password: "",
  user_type: "customer"
};

export const useLoginStore = create<LoginStore>((set, get) => ({
  // Initial state
  formData: initialFormData,
  isSubmitting: false,
  validationErrors: {},

  // Form data management
  updateFormField: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value
      }
    }));
  },

  updateUserType: (userType) => {
    set((state) => ({
      formData: {
        ...state.formData,
        user_type: userType
      }
    }));
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      validationErrors: {}
    });
  },

  // Validation
  validateForm: async () => {
    const { formData } = get();

    try {
      const deviceInfoJson = getDeviceInfoJson();

      const validationData = {
        ...formData,
        device_info_json: deviceInfoJson,
        device_onesignal_token: ""
      };

      await loginSchema.validate(validationData, { abortEarly: false });

      // Clear any previous validation errors
      set({ validationErrors: {} });
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });

        set({ validationErrors: errors });

        // Show first error in modal
        const firstError = error.errors[0];
        Swal.fire({
          title: 'Validation Error',
          text: firstError,
          icon: 'error',
          width: '500px',
          showConfirmButton: false,
          timer: 2000,
        });
      }
      return false;
    }
  },

  clearValidationErrors: () => {
    set({ validationErrors: {} });
  },



  // Submission
  submitLogin: async () => {
    const { formData, validateForm } = get();

    // Set submitting state
    set({ isSubmitting: true });

    try {
      // Validate form first
      const isValid = await validateForm();
      if (!isValid) {
        set({ isSubmitting: false });
        return;
      }

      const deviceInfoJson = getDeviceInfoJson();

      const loginData: LoginPayload = {
        email: formData.email,
        password: formData.password,
        user_type: formData.user_type,
        device_info_json: deviceInfoJson,
        device_onesignal_token: ""
      };

      // Call the auth service directly
      const response = await authService.login(loginData);

      // Store authentication data
      const { login } = useAuthStore.getState();

      if (response.success && response.user) {
        // Handle successful login with token (verified user)
        if (response.token && response.is_verified === true) {
          // Convert user type and store in auth store
          const authUser = {
            ...response.user,
            user_type: response.user.user_type as 'customer' | 'provider' | 'employee'
          };
          // Pass verification status directly to login function
          login(authUser, response.token, true);

          // Show success modal
          await Swal.fire({
            title: 'Success!',
            text: 'You have been logged in successfully!',
            icon: 'success',
            imageUrl: '',
            imageWidth: 77,
            imageHeight: 77,
            width: '500px',
            confirmButtonColor: '#0d6efd',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
              popup: 'swal2-popup swal2-modal swal2-show',
              container: 'swal2-container swal2-center swal2-backdrop-show',
              confirmButton: 'btn btn-primary rounded-pill'
            },
            buttonsStyling: false
          });

          // Reset form on success
          get().resetForm();

          // Return redirect path
          const redirectPath = (() => {
            switch (formData.user_type) {
              case 'customer':
                return '/my-account';
              case 'provider':
                return '/professional/my-account';
              case 'employee':
                return '/employee/my-account';
              default:
                return '/my-account';
            }
          })();
          return { success: true, redirectPath };
        }

        // Handle unverified user with verification token
        if (response.verification_token && response.is_verified === false) {
          // Store the verification token
          const { setToken } = useAuthStore.getState();
          setToken(response.verification_token);

          // Show verification required modal
          await Swal.fire({
            title: 'Verification Required',
            text: response.message || 'Please verify your account to continue.',
            icon: 'info',
            imageUrl: '',
            imageWidth: 77,
            imageHeight: 77,
            width: '500px',
            confirmButtonColor: '#0d6efd',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
              popup: 'swal2-popup swal2-modal swal2-show',
              container: 'swal2-container swal2-center swal2-backdrop-show',
              confirmButton: 'btn btn-primary rounded-pill'
            },
            buttonsStyling: false
          });

          // Reset form
          get().resetForm();

          // Redirect to verify account page
          return { success: true, redirectPath: '/verify-account' };
        }

        // If we reach here, something is wrong with the response
        throw new Error('Invalid login response format');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);

      // Show error modal
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      Swal.fire({
        title: 'Login Failed',
        text: errorMessage,
        icon: 'error',
        width: '500px',
        confirmButtonColor: '#0d6efd',
        showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        customClass: {
          popup: 'swal2-popup swal2-modal swal2-show',
          container: 'swal2-container swal2-center swal2-backdrop-show',
          confirmButton: 'btn btn-primary rounded-pill'
        },
        buttonsStyling: false
      });

      set({ isSubmitting: false });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // State management
  setSubmitting: (submitting) => {
    set({ isSubmitting: submitting });
  },

  setValidationErrors: (errors) => {
    set({ validationErrors: errors });
  }
})); 