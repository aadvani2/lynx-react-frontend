import { useCallback } from 'react';
import { useRegistrationStore } from '../store/registrationStore';
import type { PhoneInputData } from '../types/auth';

export const useRegistrationFormModal = (onRegistrationSuccess?: () => void) => {
  const {
    formData,
    phoneData,
    isSubmitting,
    validationErrors,
    updateFormField,
    updateUserType,
    updatePhoneData,
    submitRegistration,
    resetForm
  } = useRegistrationStore();

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormField(name as keyof typeof formData, value);
  }, [updateFormField]);

  // Handle user type change
  const handleUserTypeChange = useCallback((userType: 'customer' | 'provider') => {
    updateUserType(userType);
  }, [updateUserType]);

  // Handle phone input change
  const handlePhoneChange = useCallback((data: PhoneInputData) => {
    updatePhoneData(data);
  }, [updatePhoneData]);

  // Handle form submission for modal
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await submitRegistration();
      
      if (result?.success) {
        // Call the success callback instead of navigating
        if (onRegistrationSuccess) {
          onRegistrationSuccess();
        }
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Registration failed'));
      }
    } catch (error) {
      console.error('Form submission error:', error);
      return Promise.reject(error);
    }
  }, [submitRegistration, onRegistrationSuccess]);

  // Handle form reset
  const handleReset = useCallback(() => {
    resetForm();
  }, [resetForm]);

  // Get field error
  const getFieldError = useCallback((fieldName: string) => {
    return validationErrors[fieldName] || '';
  }, [validationErrors]);

  // Check if form is valid
  const isFormValid = useCallback(() => {
    return Object.keys(validationErrors).length === 0;
  }, [validationErrors]);

  return {
    // Form data
    formData,
    phoneData,
    
    // State
    isSubmitting,
    
    // Handlers
    handleInputChange,
    handleUserTypeChange,
    handlePhoneChange,
    handleSubmit,
    handleReset,
    
    // Validation
    getFieldError,
    isFormValid
  };
}; 