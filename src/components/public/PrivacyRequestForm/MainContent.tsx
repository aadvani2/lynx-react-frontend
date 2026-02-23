import React from "react";
import { Link } from "react-router-dom";
import { usePrivacyRequestForm } from "../../../hooks/usePrivacyRequestForm";
import PhoneInput from "../PhoneInput";
import { useRef } from "react";

const PrivacyRequestFormMainContent: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to form - shows full form
  const scrollToForm = () => {
    if (containerRef.current) {
      // Get the container position
      const containerTop = containerRef.current.offsetTop;
      
      // Scroll to show the form with some padding above
      window.scrollTo({
        top: containerTop - 50, // 50px padding from top
        behavior: 'smooth'
      });
    }
  };

  const {
    formData,
    isSubmitting,
    showSuccess,
    showError,
    errorMessage,
    handleInputChange,
    handleCheckboxChange,
    handlePhoneChange,
    handleSubmit,
    getFieldError,
    hideSuccessMessage,
    hideErrorMessage
  } = usePrivacyRequestForm(scrollToForm);

  return (
    <section className="wrapper bg-light">
      <div className="container pt-6 pb-10">
        <div className="row">
          <div className="col-lg-12 col-xl-10 offset-xl-1" ref={containerRef}>
            <h2 className="section-title mb-3 text-center">Data Subject Request Form</h2>
            <p className="lead text-center">Please complete the form below to submit your privacy request. Please note that, in order to process your request, you may be required to provide additional information necessary to verify your identity.</p>
            <p className="lead text-center mb-6 mb-md-10">The information that you provide below will be used solely for the purpose of fulfilling your request.</p>
            
            <form className="contact-form" onSubmit={handleSubmit} noValidate ref={formRef}>
              <input type="hidden" name="_token" defaultValue="OkluxWLZTn7vsJH7XWUrazsiGmuNXkCuSig30eoj" autoComplete="off" />
              
              <div className="row gx-4">
                {/* First Name */}
                <div className="col-md-6">
                  <div className="form-floating mb-2">
                    <input 
                      id="form_name" 
                      type="text" 
                      name="fname" 
                      className={`form-control ${getFieldError('fname') ? 'is-invalid' : ''}`}
                      placeholder="Jane"
                      value={formData.fname}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="form_name">First Name *</label>
                  </div>
                  {getFieldError('fname') && (
                    <div className="text-danger mb-3" style={{ fontSize: '0.875rem' }}>
                      {getFieldError('fname')}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="col-md-6">
                  <div className="form-floating mb-2">
                    <input 
                      id="form_lastname" 
                      type="text" 
                      name="lname" 
                      className={`form-control ${getFieldError('lname') ? 'is-invalid' : ''}`}
                      placeholder="Doe"
                      value={formData.lname}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="form_lastname">Last Name *</label>
                  </div>
                  {getFieldError('lname') && (
                    <div className="text-danger mb-3" style={{ fontSize: '0.875rem' }}>
                      {getFieldError('lname')}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <div className="form-floating mb-2">
                    <input 
                      id="form_email" 
                      type="email" 
                      name="email" 
                      className={`form-control ${getFieldError('email') ? 'is-invalid' : ''}`}
                      placeholder="jane.doe@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="form_email">Email *</label>
                  </div>
                  {getFieldError('email') && (
                    <div className="text-danger mb-3" style={{ fontSize: '0.875rem' }}>
                      {getFieldError('email')}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="col-md-6">
                  <div className="mb-2">
                    <PhoneInput
                      onChange={handlePhoneChange}
                      initialValue={formData.phone}
                      defaultCountry={formData.country_code?.toLowerCase() || 'us'}
                      className={`form-control ${getFieldError('phone') ? 'is-invalid' : ''}`}
                      placeholder="Phone"
                      required
                    />
                  </div>
                  {getFieldError('phone') && (
                    <div className="text-danger mb-3" style={{ fontSize: '0.875rem' }}>
                      {getFieldError('phone')}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="col-12">
                  <div className="form-floating mb-2">
                    <textarea 
                      id="form_address" 
                      name="address" 
                      className={`form-control ${getFieldError('address') ? 'is-invalid' : ''}`}
                      placeholder="Your address" 
                      style={{ height: 150 }}
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="form_address">Address *</label>
                  </div>
                  {getFieldError('address') && (
                    <div className="text-danger mb-3" style={{ fontSize: '0.875rem' }}>
                      {getFieldError('address')}
                    </div>
                  )}
                </div>

                {/* Request Types */}
                <div className="col-12">
                  <label htmlFor="form_request_type" className="mb-3 text-bold">Select Request Type: </label>
                  <div className="form-floating mb-2">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="isPersonalData" 
                        name="isPersonalData"
                        checked={formData.requestTypes.isPersonalData}
                        onChange={() => handleCheckboxChange('isPersonalData')}
                      />
                      <label className="form-check-label" htmlFor="isPersonalData"> Delete my personal data </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="isUpdateData" 
                        name="isUpdateData"
                        checked={formData.requestTypes.isUpdateData}
                        onChange={() => handleCheckboxChange('isUpdateData')}
                      />
                      <label className="form-check-label" htmlFor="isUpdateData"> Update/Correct my personal data </label>
                    </div>
                    <div className="form-check mb-3">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="isAccessData" 
                        name="isAccessData"
                        checked={formData.requestTypes.isAccessData}
                        onChange={() => handleCheckboxChange('isAccessData')}
                      />
                      <label className="form-check-label" htmlFor="isAccessData"> Access and Port my personal data </label>
                    </div>
                    <p>Show me what's been collected about me. Special note to Virginia residents - please use this option if you would like to confirm whether or not InstaAirRepair is processing your personal data, and to access or obtain a copy of such personal data.</p>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="isProcessData" 
                        name="isProcessData"
                        checked={formData.requestTypes.isProcessData}
                        onChange={() => handleCheckboxChange('isProcessData')}
                      />
                      <label className="form-check-label" htmlFor="isProcessData"> Object to processing my personal data </label>
                    </div>
                    <p>(only use my person data to provide the services to me)</p>
                    <p>Deletion of data is not reversible, and if requested, this will permanently delete your personal data from InstaAirRepair's systems which may impact your ability to use products or services powered by InstaAirRepair.</p>
                    <p>InstaAirRepair's compliance with your request is subject to some limitations and exceptions as provided by law. For example, as permitted, InstaAirRepair retains certain information about you for security and compliance purposes.</p>
                    <p>By submitting this form, I confirm that: Under penalty of perjury, I declare the above information is true, correct and that I am the person, or the parent, guardian or authorized agent of the person, whose name appears above.</p>
                    <p>Required A request to delete or restrict my personal information is irreversible.</p>
                  </div>
                  {getFieldError('requestTypes') && (
                    <div className="text-danger mb-3" style={{ fontSize: '0.875rem' }}>
                      {getFieldError('requestTypes')}
                    </div>
                  )}
                </div>

                {/* Success Message */}
                <div className="col-12">
                  <input type="hidden" name="recaptcha_token" id="recaptcha_token" />
                  <input type="hidden" name="_token" defaultValue="OkluxWLZTn7vsJH7XWUrazsiGmuNXkCuSig30eoj" />
                  {showSuccess && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      <i className="uil uil-check-circle me-2"></i>
                      <strong>Success!</strong> Your Data Subject Request Form has been successfully submitted. We will process your request and contact you soon.
                      <button 
                        type="button" 
                        className="btn-close" 
                        aria-label="Close"
                        onClick={hideSuccessMessage}
                      ></button>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                <div className="col-12">
                  {showError && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      <i className="uil uil-times-circle me-2"></i>
                      <strong>Error!</strong> {errorMessage}
                      <button 
                        type="button" 
                        className="btn-close" 
                        aria-label="Close"
                        onClick={hideErrorMessage}
                      ></button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-12 text-center">
                  <button 
                    type="submit" 
                    id="contact-form-submit" 
                    className="btn btn-primary rounded-pill btn-send mb-3" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <p className="text-muted"><strong>*</strong> These fields are required.</p>
                </div>
                <p className="mb-0">To delete your account and all associated data, please follow this link: <Link to="/delete-account">Delete Account</Link></p>
              </div>
              {/* /.row */}
              <div className="messages" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyRequestFormMainContent; 