import React from 'react';
import { useVerifyAccount } from '../../hooks/useVerifyAccount';

const VerifyAccount: React.FC = () => {
  const {
    verificationCode,
    isLoading,
    error,
    success,
    resendTimer,
    showResendTimer,
    handleVerificationCodeChange,
    handleSubmit,
    handleResendCode
  } = useVerifyAccount();

  return (
    <>
      <section className="wrapper image-wrapper bg-yellow">
        <div className="container pt-16 pb-6 text-center">
          <div className="row">
            <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-group="page-title" data-disabled="true">
              <h1 className="display-1 mb-3" data-cue="slideInDown" data-group="page-title" data-show="true" style={{ animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Verify</h1>
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
                <div className="card-body p-11 text-center">
                  <h2 className="mb-3 text-start">Verify your account.</h2>
                  <p className="mb-6 text-start">A verification code has been sent to your phone number. Please enter the code below to verify your account.</p>

                  <form className="text-start mb-3 verify-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-floating mb-4">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Verification code"
                        name="code"
                        id="code"
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                        disabled={isLoading}
                        required
                      />
                      <label htmlFor="code">Verification code</label>
                    </div>

                    {error && (
                      <div className="alert alert-danger mb-3">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="alert alert-success mb-3">
                        {success}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill btn-login w-100 mb-2"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  </form>

                  <div className="mt-3">
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
                        disabled={isLoading}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VerifyAccount;