import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/generalServices/authService';
import type { ResetPasswordPayload } from '../types/auth';
import Swal from '../lib/swal';

interface ResetPasswordFormData {
  code: string;
  password: string;
  password_confirmation: string;
  user_type: string;
  reset_type: string;
  email: string;
  phone: string;
  dial_code: string;
}

export const useResetPasswordForm = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    code: '',
    password: '',
    password_confirmation: '',
    user_type: '',
    reset_type: 'email',
    email: '',
    phone: '',
    dial_code: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get reset information from sessionStorage (stored during forgot password)
    const resetType = sessionStorage.getItem('reset_type') || 'email';
    const email = sessionStorage.getItem('reset_email') || '';
    const phone = sessionStorage.getItem('reset_phone') || '';
    const dialCode = sessionStorage.getItem('reset_dial_code') || '';
    const userType = sessionStorage.getItem('user_type') || '';

    // Debug logging
    console.log('Reset password form - sessionStorage data:', {
      resetType,
      email,
      phone,
      dialCode,
      userType,
      role
    });

    setFormData(prev => ({
      ...prev,
      reset_type: resetType,
      email: email,
      phone: phone,
      dial_code: dialCode,
      user_type: userType
    }));

    // Set user_type based on role from URL (override sessionStorage if URL has role)
    if (role) {
      const mappedRole = role === 'partner' ? 'provider' : role;
      setFormData(prev => ({ ...prev, user_type: mappedRole }));
    }
  }, [role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.code) {
      setError('Please enter the verification code');
      return false;
    }

    if (!formData.password) {
      setError('Please enter a new password');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.reset_type) {
      setError('Reset information is missing. Please go to the forgot password page first to initiate the password reset process.');
      return false;
    }

    if (formData.reset_type === 'email' && !formData.email) {
      setError('Email is missing. Please go to the forgot password page first to initiate the password reset process.');
      return false;
    }

    if (formData.reset_type === 'phone' && (!formData.phone || !formData.dial_code)) {
      setError('Phone information is missing. Please go to the forgot password page first to initiate the password reset process.');
      return false;
    }

    if (!formData.user_type) {
      setError('User type is missing');
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

    try {
      const payload: ResetPasswordPayload = {
        code: parseInt(formData.code),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        user_type: formData.user_type as 'customer' | 'provider' | 'employee',
        reset_type: formData.reset_type as 'email' | 'phone',
        ...(formData.reset_type === 'email' 
          ? { email: formData.email }
          : { 
              phone: formData.phone,
              dial_code: formData.dial_code
            }
        )
      };

      const response = await authService.resetPassword(payload);
      
      if (response && response.status == "1") {
        // Clear all reset-related data from sessionStorage after successful reset
        sessionStorage.removeItem('reset_token');
        sessionStorage.removeItem('user_type');
        sessionStorage.removeItem('reset_type');
        sessionStorage.removeItem('reset_email');
        sessionStorage.removeItem('reset_phone');
        sessionStorage.removeItem('reset_dial_code');
        
        // Show success modal
        const result = await Swal.fire({
          title: 'Success',
          html: 'Your password has been reset successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#007bff',
          customClass: {
            confirmButton: 'btn btn-primary rounded-pill w-20'
          }
        });

        if (result.isConfirmed) {
          // Navigate to appropriate sign-in page based on user type
          const signInRoute = formData.user_type === 'customer' ? '/sign-in/customer' : 
                             formData.user_type === 'provider' ? '/sign-in/partner' : 
                             '/sign-in/employee';
          navigate(signInRoute);
        }
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error,
    handleInputChange,
    handleSubmit
  };
};