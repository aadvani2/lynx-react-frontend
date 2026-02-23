import { Link } from "react-router-dom";
import { useState } from "react";
import { useLoginForm } from "../../../hooks/useLoginForm";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleUserTypeChange,
    handleSubmit
  } = useLoginForm();

  return (
    <>
      <div>
        <section className="wrapper image-wrapper bg-yellow">
          <div className="container pt-16 pb-6 text-center">
            <div className="row">
              <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-group="page-title" data-disabled="true">
                <h1 className="display-1 mb-3" data-cue="slideInDown" data-group="page-title" data-show="true" style={{ animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
                  Log In
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
                <div className="card login-page">
                  <div className="card-body text-center">
                    <h2 className="mb-3 text-start">Welcome Back!</h2>
                    <p className="mb-3 text-start">Please login to your account.</p>
                    <form className="text-start mb-1 mb-md-3 login-form" id="login-form" onSubmit={handleSubmit} noValidate={false}>
                      <input type="hidden" name="_token" defaultValue="xSrYO18I6a5SyZPvaYSz4Y59SGgqbmHAw6cFKVjK" autoComplete="off" />                                <input type="hidden" name="device_info_json" id="device_info_json" defaultValue="{&quot;device_type&quot;:&quot;web&quot;,&quot;device_name&quot;:&quot;Linux x86_64&quot;,&quot;device_info&quot;:&quot;Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36&quot;,&quot;device_language&quot;:&quot;en-GB&quot;,&quot;device_timezone&quot;:&quot;Asia/Calcutta&quot;,&quot;device_country&quot;:&quot;GB&quot;,&quot;device_unique_id&quot;:&quot;web-44893a40kp&quot;,&quot;device_app_version_name&quot;:&quot;Launch 1.0&quot;,&quot;device_app_version_code&quot;:&quot;1&quot;}" />
                      <div className="form-floating mb-4 ">
                        <div className="form-group">
                          <div className="form-check">
                            <label className="form-check-label">
                              <input 
                                className="form-check-input user_type" 
                                type="radio" 
                                name="user_type" 
                                value="customer" 
                                checked={formData.user_type === 'customer'}
                                onChange={(e) => handleUserTypeChange(e.target.value as 'customer' | 'provider' | 'employee')}
                              />
                              Customer
                            </label>
                          </div>
                          <div className="form-check">
                            <label className="form-check-label">
                              <input 
                                className="form-check-input user_type" 
                                type="radio" 
                                name="user_type" 
                                value="provider" 
                                checked={formData.user_type === 'provider'}
                                onChange={(e) => handleUserTypeChange(e.target.value as 'customer' | 'provider' | 'employee')}
                              />
                              Partner
                            </label>
                          </div>
                          <div className="form-check">
                            <label className="form-check-label">
                              <input 
                                className="form-check-input user_type" 
                                type="radio" 
                                name="user_type" 
                                value="employee" 
                                checked={formData.user_type === 'employee'}
                                onChange={(e) => handleUserTypeChange(e.target.value as 'customer' | 'provider' | 'employee')}
                              />
                              Employee
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="form-floating mb-2 mb-md-4">
                        <input 
                          type="email" 
                          className="form-control" 
                          placeholder="Email" 
                          id="loginEmail" 
                          name="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="loginEmail">Email</label>
                      </div>
                      <div className="form-floating password-field mb-2 mb-md-4">
                        <input 
                          type={showPassword ? "text" : "password"}
                          className="form-control" 
                          placeholder="Password" 
                          id="loginPassword" 
                          name="password" 
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <span 
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`uil ${showPassword ? 'uil-eye-slash' : 'uil-eye'}`} />
                        </span>
                        <label htmlFor="loginPassword">Password</label>
                      </div>
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
                      <Link to="/signup" className="btn btn-outline-primary rounded-pill btn-login w-100 mb-2">Sign up</Link>
                    </form>
                    <p className="mb-1 mobile-text-left">
                      <Link to="/forgot-password" className="hover">Forgot Password?</Link>
                    </p>
                    {/* <p class="mb-0 mobile-text-left">Don't have an account? </p> */}
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

export default SignInPage; 