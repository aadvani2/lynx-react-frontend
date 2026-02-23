import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/generalServices/authService';
import type { ForgotPasswordPayload, PhoneInputData } from '../types/auth';
import Swal from '../lib/swal';

interface ForgotPasswordFormData {
  user_type: string;
  reset_type: 'email' | 'phone';
  email: string;
  phone: string;
  dial_code: string;
  country_code: string;
}

export const useForgotPasswordForm = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    user_type: '',
    reset_type: 'email',
    email: '',
    phone: '',
    dial_code: '',
    country_code: ''
  });
  
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleSelector, setShowRoleSelector] = useState(true);
  const [usePhone, setUsePhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      // Map 'partner' role from URL to 'provider' for API
      const mappedRole = role === 'partner' ? 'provider' : role;
      setSelectedRole(role); // Keep original role for UI
      setFormData(prev => ({ ...prev, user_type: mappedRole }));
      setShowRoleSelector(false);
      setUsePhone(false);
    } else {
      setShowRoleSelector(true);
    }
  }, [role]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    setFormData(prev => ({ ...prev, user_type: newRole }));
    setUsePhone(false);
    setFormData(prev => ({ ...prev, reset_type: 'email' }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, email: e.target.value }));
    setError(null);
  };

  const handlePhoneChange = (data: PhoneInputData) => {
    setFormData(prev => ({
      ...prev,
      phone: data.phone,
      dial_code: data.countryCode,
      country_code: data.countryIso
    }));
    setError(null);
  };

  const toggleResetType = (usePhoneNumber: boolean) => {
    setUsePhone(usePhoneNumber);
    setFormData(prev => ({ 
      ...prev, 
      reset_type: usePhoneNumber ? 'phone' : 'email' 
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.user_type) {
      setError('Please select a user type');
      return false;
    }

    if (formData.reset_type === 'email') {
      if (!formData.email) {
        setError('Please enter your email address');
        return false;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    } else {
      if (!formData.phone) {
        setError('Please enter your phone number');
        return false;
      }
      if (!formData.dial_code) {
        setError('Please select a country code');
        return false;
      }
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
      const payload: ForgotPasswordPayload = {
        user_type: formData.user_type as 'customer' | 'provider' | 'employee',
        reset_type: formData.reset_type,
        ...(formData.reset_type === 'email' 
          ? { email: formData.email }
          : { 
              phone: formData.phone,
              dial_code: formData.dial_code,
              country_code: formData.country_code
            }
        )
      };

      const response = await authService.forgotPassword(payload);
      
      if (response.success) {
        // Store the reset token and user type in sessionStorage
        if (response.reset_token) {
          sessionStorage.setItem('reset_token', response.reset_token);
        }
        // Store user type for reset password page
        sessionStorage.setItem('user_type', formData.user_type);
        // Store reset type and contact information for reset password page
        sessionStorage.setItem('reset_type', formData.reset_type);
        if (formData.reset_type === 'email') {
          sessionStorage.setItem('reset_email', formData.email);
        } else {
          sessionStorage.setItem('reset_phone', formData.phone);
          sessionStorage.setItem('reset_dial_code', formData.dial_code);
        }

        // Show success modal
        const result = await Swal.fire({
          title: 'Success',
          html: `We just sent password recovery code to your ${formData.reset_type === 'email' ? 'email address' : 'phone number'} ${formData.reset_type === 'email' ? formData.email : formData.phone}`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#007bff',
          customClass: {
            confirmButton: 'btn btn-primary rounded-pill w-20'
          }
        });

        if (result.isConfirmed) {
          // Navigate to reset password page based on current route
          if (role) {
            // User came from /forgot-password/:role
            navigate(`/reset-password/${role}`);
          } else {
            // User came from /forgot-password (with role selector)
            navigate('/reset-password');
          }
        }
      } else {
        setError(response.message || 'Failed to send password reset instructions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCustomer = selectedRole === "customer";

  return {
    formData,
    selectedRole,
    showRoleSelector,
    usePhone,
    isSubmitting,
    error,
    isCustomer,
    handleRoleChange,
    handleEmailChange,
    handlePhoneChange,
    toggleResetType,
    handleSubmit
  };
};