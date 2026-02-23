import React, { useState } from "react";
import { useResetPasswordForm } from "../../../hooks/useResetPasswordForm";

const ResetPasswordPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const {
        formData,
        isSubmitting,
        error,
        handleInputChange,
        handleSubmit
    } = useResetPasswordForm();

    return (
        <>
            <section className="wrapper image-wrapper bg-yellow" data-image-src="">
                <div className="container pt-16 pb-6 text-center">
                    <div className="row">
                        <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-group="page-title" data-disabled="true">
                            <h1 className="display-1 mb-3" data-cue="slideInDown" data-group="page-title" data-show="true" style={{ animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Reset Password</h1>
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
                        <div className="col-lg-7 col-xl-6 col-xxl-5 mx-auto mt-3">
                            <div className="card">
                                <div className="card-body p-11 text-center">
                                    <h2 className="mb-3 text-start">Password Reset</h2>
                                    <p className="mb-6 text-start">Enter the code sent to your email or phone number, then set a new password.</p>
                                    <form className="text-start mb-3 mt-3 reset-pwd-form" onSubmit={handleSubmit} noValidate={false}>

                                        <div className="form-floating password-field mb-4">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="code"
                                                placeholder="Enter Code"
                                                id="code"
                                                value={formData.code}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <label htmlFor="code">Code</label>
                                        </div>
                                        <div className="form-floating password-field mb-4">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="form-control"
                                                placeholder="Password"
                                                id="resetPassword"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <span 
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className={showPassword ? "uil uil-eye-slash" : "uil uil-eye"} />
                                            </span>
                                            <label htmlFor="resetPassword">Password</label>
                                        </div>
                                        <div className="form-floating password-field mb-4">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="form-control"
                                                name="password_confirmation"
                                                placeholder="Confirm Password"
                                                id="confirmPassword"
                                                value={formData.password_confirmation}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <span 
                                                className="password-toggle"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className={showConfirmPassword ? "uil uil-eye-slash" : "uil uil-eye"} />
                                            </span>
                                            <label htmlFor="confirmPassword">Confirm Password</label>
                                        </div>
                                        {/* Error Message */}
                                        {error && (
                                            <div className="alert alert-danger mb-3" role="alert">
                                                {error}
                                                {error.includes('forgot password page') && (
                                                    <div className="mt-2">
                                                        <a href="/forgot-password" className="btn btn-outline-primary btn-sm">
                                                            Go to Forgot Password
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            id="reset-pwd-form-submit"
                                            className="btn btn-primary rounded-pill btn-login w-100 mb-2"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default ResetPasswordPage; 