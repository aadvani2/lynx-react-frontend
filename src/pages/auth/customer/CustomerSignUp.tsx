import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useRegistrationForm } from "../../../hooks/useRegistrationForm";
import { FormField } from "../../../components/common/FormField";
import PhoneInput from "../../../components/public/PhoneInput";

const CustomerSignUp = () => {
  const [searchParams] = useSearchParams();
  const [showReferralCode, setShowReferralCode] = useState(false);
  
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleUserTypeChange,
    handlePhoneChange,
    handleSubmit,
    getFieldError
  } = useRegistrationForm();

  // Set user type to customer on component mount
  useEffect(() => {
    handleUserTypeChange('customer');
  }, [handleUserTypeChange]);

  // Check for referral code in URL query parameter (ref)
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      // Show referral code input and populate it with the value from URL
      setShowReferralCode(true);
      handleInputChange({
        target: { name: 'referral_code', value: refCode }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [searchParams, handleInputChange]);

  return (
    <>
      <div>
        <section className="wrapper image-wrapper bg-yellow">
          <div className="container pt-16 pb-6 text-center">
            <div className="row">
              <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-group="page-title" data-disabled="true">
                <h1 className="display-1 mb-3" data-cue="slideInDown" data-group="page-title" data-show="true" style={{ animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
                  Customer Sign Up
                </h1>
              </div>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="divider text-light mx-n2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60">
                <path fill="currentColor" d="M0,0V60H1440V0A5771,5771,0,0,1,0,0Z" />
              </svg>
            </div>
          </div>
        </section>
        <section className="wrapper bg-light">
          <div className="container pt-6 pb-10">
            <div className="row">
              <div className="col-lg-7 col-xl-6 col-xxl-5 mx-auto">
                <div className="card">
                  <div className="card-body p-8 text-center">
                    <h2 className="mb-3 text-start">Basic Info - Let’s Keep It Simple</h2>
                    <p className="mb-3 text-start">We’ll need a few basics to set up your account</p>
                    <form className="text-start mb-3 signup-form" id="signup-form" onSubmit={handleSubmit} noValidate={false}>
                      <FormField
                        type="text"
                        name="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={getFieldError('name')}
                        required
                      />

                      <FormField
                        type="email"
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={getFieldError('email')}
                        required
                      />

                      <div className="form-floating mb-4">
                        <PhoneInput onChange={handlePhoneChange} />
                      </div>

                      <FormField
                        type="password"
                        name="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={getFieldError('password')}
                        required
                        showPasswordToggle
                      />

                      <FormField
                        type="password"
                        name="password_confirmation"
                        label="Confirm Password"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        error={getFieldError('password_confirmation')}
                        required
                        showPasswordToggle
                      />
                      
                      <div className="mb-4">
                        <p 
                          className="mt-2 mb-2 text-sm text-primary" 
                          id="referralText"
                          onClick={() => setShowReferralCode(!showReferralCode)}
                          style={{ 
                            fontSize: '14px',
                            color: '#1E3A8A',
                            marginTop: '8px',
                            marginBottom: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          Have a referral code? Enter it here to unlock your rewards!
                        </p>
                        {showReferralCode && (
                          <div className="form-floating">
                            <input 
                              type="text" 
                              name="referral_code" 
                              className="form-control" 
                              placeholder="Enter Referral Code"
                              id="referral_code"
                              value={formData.referral_code || ''}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="referral_code">Referral Code</label>
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

                      <input type="hidden" name="recaptcha_token" id="recaptcha_token" />
                      <input type="hidden" name="_token" defaultValue="xSrYO18I6a5SyZPvaYSz4Y59SGgqbmHAw6cFKVjK" />
                      <div className="alert d-none" id="registerResponse" />

                      <button
                        type="submit"
                        id="signup-form-submit"
                        className="btn btn-primary rounded-pill btn-login w-100 mb-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                      </button>

                      <Link to="/sign-in" className="btn btn-outline-primary rounded-pill btn-login w-100 mb-0">
                        Sign In
                      </Link>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CustomerSignUp;