import { useState, useCallback, useEffect } from 'react';
import { privacyRequestSchema } from '../utils/validationSchemas';
import type { PhoneInputData } from '../types/components';
import { privacyService, type PrivacyRequestPayload } from '../services/generalServices/privacyService';
import * as yup from 'yup';

export interface PrivacyRequestFormData {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  address: string;
  requestTypes: {
    isPersonalData: boolean;
    isUpdateData: boolean;
    isAccessData: boolean;
    isProcessData: boolean;
  };
  dial_code: string;
  country_code: string;
}

export const usePrivacyRequestForm = (scrollToForm?: () => void) => {
  const [formData, setFormData] = useState<PrivacyRequestFormData>({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    address: '',
    requestTypes: {
      isPersonalData: false,
      isUpdateData: false,
      isAccessData: false,
      isProcessData: false,
    },
    dial_code: '1',
    country_code: 'US',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showError]);

  // Handle input field changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Handle checkbox changes for request types
  const handleCheckboxChange = useCallback((name: keyof PrivacyRequestFormData['requestTypes']) => {
    setFormData(prev => ({
      ...prev,
      requestTypes: {
        ...prev.requestTypes,
        [name]: !prev.requestTypes[name]
      }
    }));

    // Clear validation error for request types
    if (validationErrors.requestTypes) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.requestTypes;
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Handle phone input changes from PhoneInput component
  const handlePhoneChange = useCallback((data: PhoneInputData) => {
    setFormData(prev => ({
      ...prev,
      phone: data.phone,
      dial_code: data.countryCode,
      country_code: data.countryIso
    }));

    // Clear validation error for phone
    if (validationErrors.phone) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Validate form
  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      await privacyRequestSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isValid = await validateForm();
      if (!isValid) {
        // Scroll to form to show validation errors
        if (scrollToForm) {
          scrollToForm();
        }
        setIsSubmitting(false);
        return;
      }

      const payload: PrivacyRequestPayload = {
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dial_code: formData.dial_code,
        country_code: formData.country_code,
      };

      // Only add checkbox parameters if they are selected (value 1)
      if (formData.requestTypes.isPersonalData) {
        payload.isPersonalData = 1;
      }
      if (formData.requestTypes.isUpdateData) {
        payload.isUpdateData = 1;
      }
      if (formData.requestTypes.isAccessData) {
        payload.isAccessData = 1;
      }
      if (formData.requestTypes.isProcessData) {
        payload.isProcessData = 1;
      }

      const response = await privacyService.submitDataDeletionRequest(payload);
      
      if (response.success) {
        console.log('Form submitted successfully:', response);
        setShowSuccess(true);
        
        // Reset form after successful submission
        setFormData({
          fname: '',
          lname: '',
          email: '',
          phone: '',
          address: '',
          requestTypes: {
            isPersonalData: false,
            isUpdateData: false,
            isAccessData: false,
            isProcessData: false,
          },
          dial_code: '1',
          country_code: 'US',
        });
      } else {
        throw new Error(response.message || 'Failed to submit privacy request');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Set error state for user feedback
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setShowError(true);
        console.error('Privacy request error:', error.message);
      } else {
        setErrorMessage('Failed to submit privacy request. Please try again.');
        setShowError(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, scrollToForm]);

  // Get field error
  const getFieldError = useCallback((fieldName: string) => {
    return validationErrors[fieldName] || '';
  }, [validationErrors]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      fname: '',
      lname: '',
      email: '',
      phone: '',
      address: '',
      requestTypes: {
        isPersonalData: false,
        isUpdateData: false,
        isAccessData: false,
        isProcessData: false,
      },
      dial_code: '1',
      country_code: 'US',
    });
    setValidationErrors({});
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage('');
  }, []);

  // Hide success message manually
  const hideSuccessMessage = useCallback(() => {
    setShowSuccess(false);
  }, []);

  // Hide error message manually
  const hideErrorMessage = useCallback(() => {
    setShowError(false);
    setErrorMessage('');
  }, []);

  return {
    formData,
    validationErrors,
    isSubmitting,
    showSuccess,
    showError,
    errorMessage,
    handleInputChange,
    handleCheckboxChange,
    handlePhoneChange,
    handleSubmit,
    getFieldError,
    clearErrors,
    resetForm,
    validateForm,
    hideSuccessMessage,
    hideErrorMessage
  };
}; 