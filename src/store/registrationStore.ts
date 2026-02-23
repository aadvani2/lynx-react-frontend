import { create } from 'zustand';
import { registrationSchema } from '../utils/validationSchemas';
import { getDeviceInfoJson } from '../utils/deviceInfo';
import type { RegisterPayload, PhoneInputData } from '../types/auth';
import { useAuthStore } from './authStore';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { authService } from '../services/generalServices/authService';

// Form data interface
export interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: 'customer' | 'provider';
  business_type?: string;
  website?: string;
  referral_code?: string;
}

// Phone data interface
export interface RegistrationPhoneData {
  phone: string;
  countryCode: string;
  countryIso: string;
}

// Registration store state
interface RegistrationState {
  formData: RegistrationFormData;
  phoneData: RegistrationPhoneData;
  isSubmitting: boolean;
  validationErrors: Record<string, string>;
}

// Registration store actions
interface RegistrationActions {
  // Form data management
  updateFormField: (field: keyof RegistrationFormData, value: string) => void;
  updateUserType: (userType: 'customer' | 'provider') => void;
  updatePhoneData: (data: PhoneInputData) => void;
  resetForm: () => void;
  
  // Validation
  validateForm: () => Promise<boolean>;
  clearValidationErrors: () => void;
  
  // Submission
  submitRegistration: () => Promise<{ success: boolean; redirect?: string } | void>;
  
  // State management
  setSubmitting: (submitting: boolean) => void;
  setValidationErrors: (errors: Record<string, string>) => void;
}

export type RegistrationStore = RegistrationState & RegistrationActions;

// Initial form state
const initialFormData: RegistrationFormData = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  user_type: "customer",
  business_type: "",
  website: "",
  referral_code: ""
};

const initialPhoneData: RegistrationPhoneData = {
  phone: "",
  countryCode: "1",
  countryIso: "US"
};

export const useRegistrationStore = create<RegistrationStore>((set, get) => ({
  // Initial state
  formData: initialFormData,
  phoneData: initialPhoneData,
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

  updatePhoneData: (data) => {
    set({
      phoneData: {
        phone: data.phone,
        countryCode: data.countryCode,
        countryIso: data.countryIso
      }
    });
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      phoneData: initialPhoneData,
      validationErrors: {}
    });
  },

  // Validation
  validateForm: async () => {
    const { formData, phoneData } = get();
    
    try {
      const deviceInfoJson = getDeviceInfoJson();

      const validationData = {
        ...formData,
        phone: phoneData.phone, // Use phone from phoneData
        user_type: formData.user_type,
        dial_code: `+${phoneData.countryCode}`,
        country_code: phoneData.countryIso,
        device_info_json: deviceInfoJson,
        device_onesignal_token: ""
      };

      await registrationSchema.validate(validationData, { abortEarly: false });
      
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
  submitRegistration: async () => {
    const { formData, phoneData, validateForm } = get();
    
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

      const registrationData: RegisterPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: phoneData.phone, // Use phone from phoneData
        user_type: formData.user_type,
        dial_code: `+${phoneData.countryCode}`,
        country_code: phoneData.countryIso,
        device_info_json: deviceInfoJson,
        device_onesignal_token: "",
        business_type: formData.business_type,
        website: formData.website,
        referral_code: formData.referral_code || undefined
      };

      // Call the auth service directly
      const result = await authService.register(registrationData);

      if (result.success) {
        // Reset form on success
        get().resetForm();
        
        // Special handling for provider users
        if (formData.user_type === 'provider') {
          // For provider users, the backend now returns session_token and user data without requiring verification
          if (result.token) {
            const token = result.token;
            
            // If user data is returned, store it in auth store
            if (result.user) {
              const { login } = useAuthStore.getState();
              const authUser = {
                ...result.user,
                user_type: 'provider' as const,
                is_verified: true
              };
              
              // Login the user directly
              login(authUser, token, true);
            }
            
            // Show success modal with automatic redirect to dashboard
            Swal.fire({
              title: 'Success!',
              text: 'Your account has been created successfully!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000,
              customClass: {
                popup: 'swal2-popup swal2-modal swal2-show',
                container: 'swal2-container swal2-center swal2-backdrop-show'
              },
              buttonsStyling: false
            }).then(() => {
              // Don't use window.location to avoid full page reload
              // The redirect will be handled by React Router in the component
            });
            
            return { success: true, redirect: '/professional/my-account' };
          }
        }
        
        // For non-provider users or provider fallback (if no token returned)
        // Store user data for verification if registration includes user and verification token
        if (result.user && result.verification_token) {
          const { setUnverifiedUser } = useAuthStore.getState();
          // Convert user type and store in auth store for verification
          const authUser = {
            ...result.user,
            user_type: result.user.user_type as 'customer' | 'provider' | 'employee',
            is_verified: false
          };
          setUnverifiedUser(authUser, result.verification_token);
        }

        // Show standard success modal
        Swal.fire({
          title: 'Success!',
          text: 'Your account has been created successfully!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          customClass: {
            popup: 'swal2-popup swal2-modal swal2-show',
            container: 'swal2-container swal2-center swal2-backdrop-show',
            confirmButton: 'btn btn-primary rounded-pill'
          },
          buttonsStyling: false
        });
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show error modal
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      Swal.fire({
        title: 'Registration Failed',
        text: errorMessage,
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
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