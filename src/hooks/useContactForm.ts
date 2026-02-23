import { useState, useEffect } from 'react';
import { contactService, type ContactSubmitPayload } from '../services/generalServices/contactService';

interface UseContactFormReturn {
  formData: ContactSubmitPayload;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  updateFormData: (field: keyof ContactSubmitPayload, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  hideError: () => void;
  hideSuccess: () => void;
}

const initialFormData: ContactSubmitPayload = {
  fname: '',
  lname: '',
  email: '',
  department: '',
  message: '',
  recaptcha_token: '',
};

export const useContactForm = (): UseContactFormReturn => {
  const [formData, setFormData] = useState<ContactSubmitPayload>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const updateFormData = (field: keyof ContactSubmitPayload, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
    // Clear success when user modifies form
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fname.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.lname.trim()) {
      setError('Last name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.department) {
      setError('Please select what type of user you are');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await contactService.submitContactForm(formData);
      setSuccess(true);
      setFormData(initialFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit contact form');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  const hideError = () => {
    setError(null);
  };

  const hideSuccess = () => {
    setSuccess(false);
  };

  return {
    formData,
    isLoading,
    error,
    success,
    updateFormData,
    handleSubmit,
    resetForm,
    hideError,
    hideSuccess,
  };
}; 