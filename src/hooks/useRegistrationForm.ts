import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrationStore } from '../store/registrationStore';
import type { PhoneInputData } from '../types/auth';

export const useRegistrationForm = () => {
  const navigate = useNavigate();
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

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await submitRegistration();
      
      if (result?.success && result.redirect) {
        navigate(result.redirect);
      } else if (result?.success) {
        navigate('/verify-account');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [submitRegistration, navigate]);

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