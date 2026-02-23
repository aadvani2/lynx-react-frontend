import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRegistrationForm } from "../../../hooks/useRegistrationForm";
import { FormField } from "../../../components/common/FormField";
import PhoneInput from "../../../components/public/PhoneInput";

const PartnerSignUpPage = () => {
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleUserTypeChange,
    handlePhoneChange,
    handleSubmit,
    getFieldError
  } = useRegistrationForm();

  // Set user type to provider on component mount
  useEffect(() => {
    handleUserTypeChange('provider');
  }, [handleUserTypeChange]);

  return (
    <>
      <div>
        <section className="wrapper image-wrapper bg-yellow">
          <div className="container pt-16 pb-6 text-center">
            <div className="row">
              <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-group="page-title" data-disabled="true">
                <h1 className="display-1 mb-3" data-cue="slideInDown" data-group="page-title" data-show="true" style={{ animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
                  Partner Sign Up
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
                        label="Business Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={getFieldError('name')}
                        required
                      />

                      <div className="form-floating mb-4">
                        <div className="form-select-wrapper">
                          <select
                            name="business_type"
                            className="form-select"
                            value={formData.business_type}
                            onChange={handleInputChange}
                            aria-label="Business Type"
                          >
                            <option value="">Business Type</option>
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

                      <div className="form-floating mb-4">
                        <input
                          type="text"
                          name="website"
                          className="form-control"
                          placeholder="Website"
                          id="website"
                          value={formData.website}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="website">Website</label>
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

                      <div className="form-floating mb-4 policy">
                        <span>By continuing with the signup, you agree to the{" "}
                          <Link to="/lynx-agreement" target="_blank">LYNX Agreement</Link> and{" "}
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

export default PartnerSignUpPage;
