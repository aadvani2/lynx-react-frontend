import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginStore } from '../store/loginStore';

export interface LoginFormData {
  email: string;
  password: string;
  user_type: 'customer' | 'provider' | 'employee';
}

export const useLoginForm = (onLoginSuccessNoRedirect?: () => void) => {
  const navigate = useNavigate();
  const {
    formData,
    isSubmitting,
    validationErrors,
    updateFormField,
    updateUserType,
    submitLogin,
    resetForm,
    validateForm,
    clearValidationErrors
  } = useLoginStore();

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormField(name as keyof typeof formData, value);
    // Clear validation error for this field
    if (validationErrors[name]) {
      clearValidationErrors();
    }
  }, [updateFormField, validationErrors, clearValidationErrors]);

  // Handle user type change
  const handleUserTypeChange = useCallback((userType: 'customer' | 'provider' | 'employee') => {
    updateUserType(userType);
  }, [updateUserType]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await submitLogin();
      
      if (result?.success) {
        if (onLoginSuccessNoRedirect) {
          onLoginSuccessNoRedirect();
        } else if (result.redirectPath) {
          navigate(result.redirectPath);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Error is already handled by the store
    }
  }, [submitLogin, navigate, onLoginSuccessNoRedirect]);

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
    
    // State
    isSubmitting,
    validationErrors,
    
    // Handlers
    handleInputChange,
    handleUserTypeChange,
    handleSubmit,
    handleReset,
    
    // Validation
    getFieldError,
    isFormValid,
    validateForm,
    
    // Actions
    clearValidationErrors
  };
}; 