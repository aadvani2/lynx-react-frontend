
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLoginForm } from "../../../hooks/useLoginForm";
import { FormField } from "../../../components/common/FormField";

const EmployeeLogInPage = () => {
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleUserTypeChange,
    handleSubmit,
    getFieldError
  } = useLoginForm();

  // Set user type to employee on component mount
  useEffect(() => {
    handleUserTypeChange('employee');
  }, [handleUserTypeChange]);

  return (
    <>
      <div>
        <section className="wrapper image-wrapper bg-yellow">
          <div className="container pt-16 pb-6 text-center">
            <div className="row">
              <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-group="page-title" data-disabled="true">
                <h1 className="display-1 mb-3" data-cue="slideInDown" data-group="page-title" data-show="true" style={{ animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
                  Employee Log In
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
                    <h2 className="mb-3 text-start">Welcome Back!</h2>
                    <p className="mb-3 text-start">Please login to your account.</p>
                    <form className="text-start mb-3 login-form" id="login-form" onSubmit={handleSubmit} noValidate={false}>
                      <FormField
                        type="email"
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={getFieldError('email')}
                        required
                      />

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

                      <input type="hidden" name="recaptcha_token" id="recaptcha_token" />
                      <input type="hidden" name="_token" defaultValue="xSrYO18I6a5SyZPvaYSz4Y59SGgqbmHAw6cFKVjK" />
                      <div className="alert d-none" id="loginResponse" />

                      <button
                        type="submit"
                        id="login-form-submit"
                        className="btn btn-primary rounded-pill btn-login w-100 mb-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                      </button>

                    </form>

                    <p className="mb-1 mobile-text-left">
                      <Link to="/forgot-password/employee" className="hover">Forgot Password?</Link>
                    </p>
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

export default EmployeeLogInPage;