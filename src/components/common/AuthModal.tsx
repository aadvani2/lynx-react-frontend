import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLoginForm } from '../../hooks/useLoginForm';
import { useRegistrationFormModal } from '../../hooks/useRegistrationFormModal';
import { useForgotPasswordForm } from '../../hooks/useForgotPasswordForm';
import { useVerifyAccount } from '../../hooks/useVerifyAccount';
import { FormField } from './FormField';
import PhoneInput from '../public/PhoneInput';
import { addModalCloseIconStyles, modalCloseIconConfigs } from '../../utils/modalCloseIcon';

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
  onLoginSuccessNoRedirect?: () => void;
}

type AuthView = 'signin' | 'signup' | 'forgot-password' | 'verification';

const AuthModal: React.FC<AuthModalProps> = ({ show, onClose, onLoginSuccessNoRedirect }) => {
  const location = useLocation();
  const [currentView, setCurrentView] = useState<AuthView>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showReferralCode, setShowReferralCode] = useState(false);

  // Reset modal state when modal is closed
  useEffect(() => {
    if (!show) {
      setCurrentView('signin');
      setShowPassword(false);
      setShowReferralCode(false);
    }
  }, [show]);

  // Manage modal close icon styles
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (show) {
      // Apply custom modal close icon styles when modal opens
      cleanup = addModalCloseIconStyles({
        ...modalCloseIconConfigs.default,
        className: 'auth-modal-close'
      });
    }

    // Cleanup function to remove styles when modal closes or component unmounts
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [show]);

  // Handle registration success - redirect to verification
  const handleRegistrationSuccess = () => {
    setCurrentView('verification');
  };

  // Login form hook
  const {
    formData: loginData,
    isSubmitting: isLoginSubmitting,
    handleInputChange: handleLoginInputChange,
    handleSubmit: handleLoginSubmit
  } = useLoginForm(onLoginSuccessNoRedirect);

  // Registration form hook (modal version)
  const {
    formData: registerData,
    isSubmitting: isRegisterSubmitting,
    handleInputChange: handleRegisterInputChange,
    handlePhoneChange: handleRegisterPhoneChange,
    handleSubmit: handleRegisterSubmit,
    getFieldError
  } = useRegistrationFormModal(handleRegistrationSuccess);

  // Forgot password form hook
  const {
    formData: forgotData,
    isSubmitting: isForgotSubmitting,
    error: forgotError,
    handleEmailChange: handleForgotEmailChange,
    handleSubmit: handleForgotSubmit
  } = useForgotPasswordForm();

  // Verification form hook
  const {
    verificationCode,
    isLoading: isVerifying,
    error: verificationError,
    success: verificationSuccess,
    resendTimer,
    showResendTimer,
    handleVerificationCodeChange,
    handleSubmit: handleVerificationSubmit,
    handleResendCode
  } = useVerifyAccount(onLoginSuccessNoRedirect);

  // Handle verification completion
  const handleVerificationComplete = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle successful verification
  useEffect(() => {
    if (verificationSuccess) {
      // Check if we're on /search route - if so, handleLoginSuccess will handle closing
      // Otherwise, close modal after successful verification with a delay to show success message
      const currentPath = location.pathname;
      if (currentPath !== '/search' || !onLoginSuccessNoRedirect) {
        setTimeout(() => {
          handleVerificationComplete();
        }, 2000);
      }
    }
  }, [verificationSuccess, handleVerificationComplete, onLoginSuccessNoRedirect, location.pathname]);

  if (!show) return null;

  const renderSignInForm = () => (
    <div>
      <h4 className="mb-3">Welcome Back!</h4>
      <p className="mb-3">Please login to your account.</p>
      <form onSubmit={handleLoginSubmit} noValidate>
        <input type="hidden" name="user_type" value="customer" />
        <div className="form-floating mb-2 mb-md-4">
          <input 
            type="email" 
            className="form-control" 
            placeholder="Email" 
            id="modalLoginEmail" 
            name="email" 
            value={loginData.email}
            onChange={handleLoginInputChange}
          />
          <label htmlFor="modalLoginEmail">Email</label>
        </div>
        <div className="form-floating password-field mb-2 mb-md-4">
          <input 
            type={showPassword ? "text" : "password"}
            className="form-control" 
            placeholder="Password" 
            id="modalLoginPassword" 
            name="password" 
            value={loginData.password}
            onChange={handleLoginInputChange}
          />
          <span 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={`uil ${showPassword ? 'uil-eye-slash' : 'uil-eye'}`} />
          </span>
          <label htmlFor="modalLoginPassword">Password</label>
        </div>
        <button 
          type="submit" 
          className="btn btn-primary rounded-pill btn-login w-100 mb-2"
          disabled={isLoginSubmitting}
        >
          {isLoginSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
        <button 
          type="button"
          onClick={() => setCurrentView('signup')}
          className="btn btn-outline-primary rounded-pill btn-login w-100 mb-2"
        >
          Sign up
        </button>
      </form>
      <p className="mb-1 text-center">
        <button 
          type="button"
          onClick={() => setCurrentView('forgot-password')}
          className="btn btn-link p-0 hover"
        >
          Forgot Password?
        </button>
      </p>
    </div>
  );

  const renderSignUpForm = () => (
    <div>
      <h4 className="mb-3">Basic Info - Let's Keep It Simple</h4>
      <p className="mb-3">We'll need a few basics to set up your account</p>
      <form onSubmit={handleRegisterSubmit} noValidate>
        <input type="hidden" name="user_type" value="customer" />
        
        <FormField
          type="text"
          name="name"
          label="Name"
          value={registerData.name}
          onChange={handleRegisterInputChange}
          error={getFieldError('name')}
          required
        />
        
        <FormField
          type="email"
          name="email"
          label="Email"
          value={registerData.email}
          onChange={handleRegisterInputChange}
          error={getFieldError('email')}
          required
        />
        
        <div className="form-floating mb-4">
          <PhoneInput onChange={handleRegisterPhoneChange} />
        </div>
        
        <FormField
          type="password"
          name="password"
          label="Password"
          value={registerData.password}
          onChange={handleRegisterInputChange}
          error={getFieldError('password')}
          required
          showPasswordToggle
        />
        
        <FormField
          type="password"
          name="password_confirmation"
          label="Confirm Password"
          value={registerData.password_confirmation}
          onChange={handleRegisterInputChange}
          error={getFieldError('password_confirmation')}
          required
          showPasswordToggle
        />
        
        <div className="mb-4">
          <span 
            className="text-primary cursor-pointer" 
            onClick={() => setShowReferralCode(!showReferralCode)}
            style={{ cursor: 'pointer' }}
          >
            Have a referral code? Enter it here to unlock your rewards!
          </span>
          {showReferralCode && (
            <div className="form-floating mt-3">
              <input 
                type="text" 
                name="referral_code" 
                className="form-control" 
                placeholder="Enter Referral Code"
                id="modalReferralCode"
                value={registerData.referral_code || ''}
                onChange={handleRegisterInputChange}
              />
              <label htmlFor="modalReferralCode">Referral Code</label>
            </div>
          )}
        </div>
        
        <div className="form-floating mb-4 policy">
          <span>
            By continuing with the signup, you agree to the{' '}
            <Link to="/terms-of-use" target="_blank">Terms of Use</Link> and{' '}
            <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>
          </span>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary rounded-pill btn-login w-100 mb-2"
          disabled={isRegisterSubmitting}
        >
          {isRegisterSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        <button 
          type="button"
          onClick={() => setCurrentView('signin')}
          className="btn btn-outline-primary rounded-pill btn-login w-100 mb-0"
        >
          Sign In
        </button>
      </form>
    </div>
  );

  const renderForgotPasswordForm = () => (
    <div>
      <h4 className="mb-3">Forgot Password?</h4>
      <p className="mb-3">Enter your email address to receive password reset instructions.</p>
      <form onSubmit={handleForgotSubmit}>
        <input type="hidden" name="user_type" value="customer" />
        
        <div className="form-floating mb-4">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={forgotData.email}
            onChange={handleForgotEmailChange}
            required
          />
          <label>Email</label>
        </div>
        
        {/* Error Message */}
        {forgotError && (
          <div className="alert alert-danger mb-3" role="alert">
            {forgotError}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary rounded-pill btn-login w-100 mb-2"
          disabled={isForgotSubmitting}
        >
          {isForgotSubmitting ? 'Sending...' : 'Send Code'}
        </button>

        <button 
          type="button"
          onClick={() => setCurrentView('signin')}
          className="btn btn-outline-primary rounded-pill btn-login w-100 mt-2"
        >
          Back to Sign In
        </button>
      </form>
    </div>
  );

  const renderVerificationForm = () => (
    <div>
      <h4 className="mb-3">Verify your account</h4>
      <p className="mb-4">A verification code has been sent to your phone number. Please enter the code below to verify your account.</p>

      <form onSubmit={handleVerificationSubmit} noValidate>
        <div className="form-floating mb-4">
          <input
            type="number"
            className="form-control"
            placeholder="Verification code"
            name="code"
            id="modalVerificationCode"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
            disabled={isVerifying}
            required
          />
          <label htmlFor="modalVerificationCode">Verification code</label>
        </div>

        {verificationError && (
          <div className="alert alert-danger mb-3">
            {verificationError}
          </div>
        )}

        {verificationSuccess && (
          <div className="alert alert-success mb-3">
            {verificationSuccess}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary rounded-pill btn-login w-100 mb-2"
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <div className="mt-3 text-center">
        {showResendTimer ? (
          <span className="text-muted">
            <button
              type="button"
              disabled={true}
              className="btn btn-link p-0"
            >
              Resend OTP
            </button>
            {' '}in {resendTimer} seconds
          </span>
        ) : (
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={handleResendCode}
            disabled={isVerifying}
          >
            Resend OTP
          </button>
        )}
      </div>

      <button 
        type="button"
        onClick={() => setCurrentView('signup')}
        className="btn btn-outline-secondary rounded-pill btn-login w-100 mt-2"
      >
        Back to Sign Up
      </button>
    </div>
  );

  const getCurrentViewContent = () => {
    switch (currentView) {
      case 'signin':
        return renderSignInForm();
      case 'signup':
        return renderSignUpForm();
      case 'forgot-password':
        return renderForgotPasswordForm();
      case 'verification':
        return renderVerificationForm();
      default:
        return renderSignInForm();
    }
  };

  const getModalTitle = () => {
    switch (currentView) {
      case 'signin':
        return 'Sign In';
      case 'signup':
        return 'Sign Up';
      case 'forgot-password':
        return 'Forgot Password';
      case 'verification':
        return 'Verify Your Account';
      default:
        return 'Sign In';
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{getModalTitle()}</h5>
            <button 
              type="button" 
              className="auth-modal-close" 
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body p-4">
            {getCurrentViewContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 