import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/generalServices/authService';
import { useAuthStore } from '../store/authStore';
import type { VerifyCodePayload } from '../services/generalServices/authService';
import Swal from '../lib/swal';

export const useVerifyAccount = (onVerificationSuccess?: () => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getVerificationToken, completeVerification } = useAuthStore();

  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [showResendTimer, setShowResendTimer] = useState(true);

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

  useEffect(() => {
    // Start countdown timer
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setShowResendTimer(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get verification token from auth store
      const verificationToken = getVerificationToken();

      const payload: VerifyCodePayload = {
        verification_code: verificationCode,
        token: verificationToken || ''
      };

      const response = await authService.verifyCode(payload);

      if (response.success) {
        setSuccess(response.message || 'Account verified successfully!');

        // Complete verification with new auth token and user data
        if (response.token && response.user) {
          const authUser = {
            ...response.user,
            user_type: response.user.user_type as 'customer' | 'provider' | 'employee',
            is_verified: true
          };
          completeVerification(authUser, response.token);
        }

        // Show success modal
        await Swal.fire({
          title: 'Success',
          html: 'Your account has been verified successfully!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          confirmButtonColor: '#007bff',
          customClass: {
            confirmButton: 'btn btn-primary rounded-pill w-20'
          }
        });

        // Check if user is on /search route and callback is provided
        const currentPath = location.pathname;
        if (currentPath === '/search' && onVerificationSuccess) {
          // Call the callback (handleLoginSuccess from SearchResult)
          onVerificationSuccess();
        } else if (currentPath !== '/search') {
          // Navigate based on redirect URL from API or default to home
          const redirectUrl = response.redirect || '/';
          navigate(redirectUrl);
        }
        // If on /search but no callback, don't redirect (existing behavior)

      } else {
        setError(response.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get verification token from auth store
      const verificationToken = getVerificationToken();

      if (!verificationToken) {
        setError('Verification token not found. Please try signing up again.');
        return;
      }

      // Call resend OTP API
      const response = await authService.resendOtp(verificationToken);

      if (response.success) {
        // Reset timer and show success message
        setResendTimer(60);
        setShowResendTimer(true);
        setSuccess(response.message || 'Verification code has been resent to your email/phone.');
      } else {
        setError(response.message || 'Failed to resend verification code.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verificationCode,
    isLoading,
    error,
    success,
    resendTimer,
    showResendTimer,
    handleVerificationCodeChange,
    handleSubmit,
    handleResendCode
  };
};