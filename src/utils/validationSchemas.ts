import * as yup from 'yup';

// Registration validation schema
export const registrationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  
  password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  
  user_type: yup
    .string()
    .required('User type is required')
    .oneOf(['customer', 'provider'], 'Invalid user type'),
  
  dial_code: yup
    .string()
    .required('Dial code is required'),
  
  country_code: yup
    .string()
    .required('Country code is required'),
  
  device_info_json: yup
    .string()
    .required('Device info is required'),
  
  device_onesignal_token: yup
    .string()
    .optional(),
});

// Login validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password is required'),
  
  user_type: yup
    .string()
    .required('User type is required')
    .oneOf(['customer', 'provider', 'employee'], 'Invalid user type'),
  
  device_info_json: yup
    .string()
    .required('Device info is required'),
  
  device_onesignal_token: yup
    .string()
    .optional(),
});

// Privacy Request Form validation schema
export const privacyRequestSchema = yup.object({
  fname: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  
  lname: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .matches(/^[0-9]+$/, 'Phone number can only contain digits'),
  
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters'),
  
  requestTypes: yup
    .object({
      isPersonalData: yup.boolean(),
      isUpdateData: yup.boolean(),
      isAccessData: yup.boolean(),
      isProcessData: yup.boolean(),
    })
    .test(
      'at-least-one',
      'Please select at least one request type',
      (value) => {
        if (!value) return false;
        return Object.values(value).some(Boolean);
      }
    ),
  
  dial_code: yup
    .string()
    .required('Country code is required'),
  
  country_code: yup
    .string()
    .required('Country code is required'),
});

