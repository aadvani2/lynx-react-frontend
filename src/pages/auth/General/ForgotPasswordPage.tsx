import React from "react";
import PhoneInput from "../../../components/public/PhoneInput";
import { useForgotPasswordForm } from "../../../hooks/useForgotPasswordForm";
import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const {
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
  } = useForgotPasswordForm();

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>


        {/* Role Selector */}
        {showRoleSelector && (
          <div className="mb-4 text-start">
            <div className="form-check">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  name="user_type"
                  value="customer"
                  checked={selectedRole === "customer"}
                  onChange={handleRoleChange}
                />
                Customer
              </label>
            </div>
            <div className="form-check">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  name="user_type"
                  value="provider"
                  checked={selectedRole === "provider"}
                  onChange={handleRoleChange}
                />
                Partner
              </label>
            </div>
            <div className="form-check">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  name="user_type"
                  value="employee"
                  checked={selectedRole === "employee"}
                  onChange={handleRoleChange}
                />
                Employee
              </label>
            </div>
          </div>
        )}

        {/* Email Field */}
        {!usePhone && (
          <div className="form-floating mb-4">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleEmailChange}
              required
            />
            <label>Email</label>
          </div>
        )}

        {/* Phone Field (only for customer) */}
        {usePhone && isCustomer && (
          <div className="mb-4">
            <PhoneInput
              placeholder="Phone Number"
              required
              onChange={handlePhoneChange}
            />
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}



        <button
          type="submit"
          className="btn btn-primary rounded-pill btn-login w-100 mb-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Code'}
        </button>

      </form>
    );
  };

  return (
    <>

      <section className="wrapper image-wrapper bg-yellow" data-image-src="">
        <div className="container pt-16 pb-6 text-center">
          <div className="row">
            <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-group="page-title" data-disabled="true">
              <h1 className="display-1 mb-3" data-cue="slideInDown" data-group="page-title" data-show="true" style={{ animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Forgot Password?</h1>
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
            <p className="text-center">Don't worry! Resetting your password is easy. Just tell us the email address you registered
              with Lynx and we'll send you a link to reset your password.</p>
            <div className="col-lg-7 col-xl-6 col-xxl-5 mx-auto mt-3">
              <div className="card">
                <div className="card-body p-11 text-center">
                  <p className="mb-3 text-start field-msg">Enter your email address to receive password reset
                    instructions.</p>

                  {renderForm()}

                  {isCustomer && selectedRole && !showRoleSelector && (
                    <>
                      {!usePhone ? (
                        <a className="d-block text-center" onClick={() => toggleResetType(true)} style={{ cursor: "pointer" }}>Try using phone number</a>
                      ) : (
                        <a className="d-block text-center" onClick={() => toggleResetType(false)} style={{ cursor: "pointer" }}>Try using email instead</a>
                      )}
                    </>
                  )}

                  <a className="try-email d-none" href="javascript:;" onClick={() => { }}> Try using email</a>
                  <p className="mb-0 mt-3">Need help? <Link to="/contact" target="_blank" className="hover">Contact Support</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>

  );
};

export default ForgotPasswordPage;
