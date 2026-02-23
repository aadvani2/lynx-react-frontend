import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegistrationForm } from "../../../hooks/useRegistrationForm";
import { FormField } from "../../../components/common/FormField";
import PhoneInput from "../../../components/public/PhoneInput";

const SignUpPage = () => {
  const [showReferralCode, setShowReferralCode] = useState(false);
  
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handlePhoneChange,
    handleSubmit,
    getFieldError
  } = useRegistrationForm();



  return (
    <>
      <div>
        <section className="wrapper image-wrapper bg-yellow">
          <div className="container pt-16 pb-6 text-center">
            <div className="row">
              <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-group="page-title" data-disabled="true">
                <h1 className="display-1 mb-3" data-cue="slideInDown" data-group="page-title" data-show="true" style={{ animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
                  Sign Up
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
                    <h2 className="mb-3 text-start">Basic Info - Let's Keep It Simple</h2>
                    <p className="mb-3 text-start">We'll need a few basics to set up your account</p>
                    <form className="text-start mb-3 signup-form" id="signup-form" onSubmit={handleSubmit} noValidate={false}>
                      <div className="form-floating mb-4 d-none ">
                        <div className="form-group">
                          <div className="form-check">
                            <label className="form-check-label">
                              <input className="form-check-input user_type" type="radio" name="user_type" defaultValue="customer" defaultChecked />
                              Customer
                            </label>
                          </div>
                          <div className="form-check">
                            <label className="form-check-label">
                              <input className="form-check-input user_type" type="radio" name="user_type" defaultValue="provider" />
                              Partner
                            </label>
                          </div>
                          <div className="form-check">
                            <label className="form-check-label">
                              <input className="form-check-input user_type" type="radio" name="user_type" defaultValue="employee" />
                              Employee
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <FormField
                        type="text"
                        name="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={getFieldError('name')}
                        required
                      />
                      
                      <div className="form-floating mb-4 business-type d-none">
                        <div className="form-select-wrapper mb-4">
                          <select name="business_type" className="form-select" aria-label="Default select example">
                            <option value="" disabled>Business Type</option>
                            <option value="Individual/Sole-Proprietor">Individual/Sole-Proprietor</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Limited Liability Company">Limited Liability Company</option>
                            <option value="Corporation">Corporation</option>
                          </select>
                        </div>
                      </div>
                      
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
                      
                      <div className="form-floating mb-4 websiteDiv d-none">
                        <input type="text" name="website" className="form-control" placeholder="Website" id="loginWebsite" defaultValue={""} />
                        <label htmlFor="loginWebsite">Website</label>
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

export default SignUpPage;

