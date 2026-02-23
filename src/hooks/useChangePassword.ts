import { useState, useEffect } from 'react';
import { authService } from '../services/generalServices/authService';
import type { ChangePasswordPayload } from '../types/auth';
import Swal from '../lib/swal';

export const useChangePassword = () => {
  const [formData, setFormData] = useState<ChangePasswordPayload>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.current_password.trim()) {
      setError('Current password is required');
      return false;
    }

    if (!formData.new_password.trim()) {
      setError('New password is required');
      return false;
    }

    if (formData.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      return false;
    }

    if (formData.new_password === formData.current_password) {
      setError('New password must be different from current password');
      return false;
    }

    if (!formData.confirm_password.trim()) {
      setError('Please confirm your new password');
      return false;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('New password and confirm password do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authService.changePassword(formData);

      if (response.success) {
        setSuccess(response.message || 'Password changed successfully!');

        // Show success modal
        await Swal.fire({
          title: 'Success',
          html: 'Your password has been changed successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#007bff',
          customClass: {
            confirmButton: 'btn btn-primary rounded-pill w-20'
          }
        });

        // Reset form
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        setError(response.message || 'Password change failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error,
    success,
    handleInputChange,
    handleSubmit
  };
};