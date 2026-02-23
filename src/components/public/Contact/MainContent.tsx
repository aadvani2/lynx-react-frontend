import React from "react";
import { useContactForm } from "../../../hooks/useContactForm";

const ContactMainContent: React.FC = () => {
  const {
    formData,
    isLoading,
    error,
    success,
    updateFormData,
    handleSubmit,
    hideError,
    hideSuccess,
  } = useContactForm();

  return (
  <section className="wrapper bg-light">
    <div className="container pt-6 pb-10">
      <div className="row gy-6 gx-lg-8 gx-xl-12 mb-8 mb-md-12 align-items-center">
        <div className="col-lg-7 position-relative">
          <div className="shape bg-dot primary rellax w-18 h-18" data-rellax-speed={1} style={{ top: 0, left: '-1.4rem', zIndex: 0, transform: 'translate3d(0px, -4px, 0px)' }} />
          <div className="row gx-md-5 gy-5">
            <div className="col-md-6" data-cues="fadeIn" data-duration={1200} data-disabled="true">
              <figure className="rounded mt-md-10 position-relative" data-cue="fadeIn" data-duration={1200} data-show="true" style={{ animationName: 'fadeIn', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}><img src="" srcSet="" alt="" /></figure>
            </div>
            {/*/column */}
            <div className="col-md-6">
              <div className="row gx-md-5 gy-3">
                <div className="col-md-12 order-md-2" data-cues="fadeIn" data-duration={1200} data-disabled="true">
                  <figure className="rounded" data-cue="fadeIn" data-duration={1200} data-show="true" style={{ animationName: 'fadeIn', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}><img src="" srcSet="" alt="" />
                  </figure>
                </div>
                {/*/column */}
                <div className="col-md-10">
                  <div className="card bg-pale-primary text-center counter-wrapper">
                    <div className="card-body py-11">
                      <h3 className="counter text-nowrap" style={{ visibility: 'visible' }}>5000+</h3>
                      <p className="mb-0">Satisfied Customers</p>
                    </div>
                    {/*/.card-body */}
                  </div>
                  {/*/.card */}
                </div>
                {/*/column */}
              </div>
              {/*/.row */}
            </div>
            {/*/column */}
          </div>
          {/*/.row */}
        </div>
        {/*/column */}
        <div className="col-lg-5" data-cues="slideInUp" data-duration={1200} data-disabled="true">
          {/* <h2 class="display-6 mb-8">Have a question? We’re here to help! Whether you’re looking for a service or a provider looking to connect, we’d love to hear from you.</h2> */}
          <h2 className="section-title mb-4 mb-md-6" data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Questions? We’re Here to Help.</h2>
          <p data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Whether you need a trusted pro for your home or want to join the Lynx provider network, we’re ready
            to assist.</p>
          <div className="d-flex flex-row" data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
            <div>
              <div className="icon text-primary fs-28 me-6 mt-n1"><i className="uil uil-location-pin-alt" />
              </div>
            </div>
            <div>
              <h5 className="mb-1">Service Area</h5>
              <address>Dallas-Fort Worth, TX</address>
            </div>
          </div>
          <div className="mb-4 d-flex flex-row" data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
            <div>
              <div className="icon text-primary fs-28 me-6 mt-n1"><i className="uil uil-phone-volume" />
              </div>
            </div>
            <div>
              <h5 className="mb-1">Phone</h5>
              <a href="tel:+18774115969">+1 (877) 411-5969</a>
            </div>
          </div>
          <div className="mt-1 d-flex flex-row" data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
            <div>
              <div className="icon text-primary fs-28 me-6 mt-n1"><i className="uil uil-phone-volume" />
              </div>
            </div>
            <div>
              <h5 className="mb-1">Phone</h5>
              <a href="tel:+18774115969">+1 (877) 411-LYNX</a>
            </div>
          </div>
          <br data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }} />
          <div className="d-flex flex-row" data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
            <div>
              <div className="icon text-primary fs-28 me-6 mt-n1"><i className="uil uil-envelope" /></div>
            </div>
            <div>
              <h5 className="mb-1">Email</h5>
              <a href="mailto:hello@connectwithlynx.com" className="link-email">hello@connectwithlynx.com</a>
            </div>
          </div>
        </div>
        {/*/column */}
      </div>
      <div className="row">
        <div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
          <div data-cues="slideInUp" data-duration={1200} data-disabled="true">
            {/* <h2 class="display-4 mb-3 text-center">Drop Us a Line</h2> */}
            <h2 className="section-title mb-3 text-center" data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Reach Out Anytime</h2>
            {/* <p class="lead text-center mb-10">Fill out our contact form below, and we’ll get back to you fast.</p> */}
            <p className="lead text-center mb-10" data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Have a question or need support? Fill out the form below, and
              we’ll get back to you fast.</p>
          </div>
          <div data-cues="slideInUp" data-duration={1200} data-disabled="true">
            <form className="contact-form contact-form-cnt-page" onSubmit={handleSubmit} noValidate={false} data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
              {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                  <i className="uil uil-times-circle me-2"></i>
                  <strong>Error!</strong> {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    aria-label="Close"
                    onClick={hideError}
                  ></button>
                </div>
              )}
              {success && (
                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                  <i className="uil uil-check-circle me-2"></i>
                  <strong>Success!</strong> Thank you for your message! We'll get back to you soon.
                  <button 
                    type="button" 
                    className="btn-close" 
                    aria-label="Close"
                    onClick={hideSuccess}
                  ></button>
                </div>
              )}
              <div className="row gx-4">
                <div className="col-md-6">
                  <div className="form-floating mb-2 mb-md-4">
                    <input 
                      id="form_name" 
                      type="text" 
                      name="fname" 
                      className="form-control" 
                      placeholder="Jane" 
                      value={formData.fname}
                      onChange={(e) => updateFormData('fname', e.target.value)}
                      required 
                    />
                    <label htmlFor="form_name">First Name *</label>
                  </div>
                </div>
                {/* /column */}
                <div className="col-md-6">
                  <div className="form-floating mb-2 mb-md-4">
                    <input 
                      id="form_lastname" 
                      type="text" 
                      name="lname" 
                      className="form-control" 
                      placeholder="Doe" 
                      value={formData.lname}
                      onChange={(e) => updateFormData('lname', e.target.value)}
                      required 
                    />
                    <label htmlFor="form_lastname">Last Name *</label>
                  </div>
                </div>
                {/* /column */}
                <div className="col-md-6">
                  <div className="form-floating mb-2 mb-md-4">
                    <input 
                      id="form_email" 
                      type="email" 
                      name="email" 
                      className="form-control" 
                      placeholder="jane.doe@example.com" 
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      required 
                    />
                    <label htmlFor="form_email">Email *</label>
                  </div>
                </div>
                {/* /column */}
                <div className="col-md-6">
                  <div className="form-select-wrapper mb-2 mb-md-4">
                    <select 
                      className="form-select" 
                      id="form-select" 
                      name="department" 
                      value={formData.department}
                      onChange={(e) => updateFormData('department', e.target.value)}
                      required
                    >
                      <option value="">I am a…</option>
                      <option value="Homeowner/Renter">Homeowner/Renter</option>
                      <option value="Business Owner/Manager">Business Owner/Manager</option>
                      <option value="Service Professional/Contractor">Service Professional/Contractor
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                {/* /column */}
                <div className="col-12">
                  <div className="form-floating mb-2 mb-md-4">
                    <textarea 
                      id="form_message" 
                      name="message" 
                      className="form-control" 
                      placeholder="Your message" 
                      style={{ height: 150 }} 
                      value={formData.message}
                      onChange={(e) => updateFormData('message', e.target.value)}
                      required 
                    />
                    <label htmlFor="form_message">Message *</label>
                  </div>
                </div>
                <div className="col-12 text-center">
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-pill btn-send mb-3" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="text-muted mb-0"><strong>*</strong> These fields are required.</p>
                </div>
              </div>
              {/* /.row */}
              <div className="messages" />
            </form>
            {/* /form */}
          </div>
        </div>
        {/* /column */}
      </div>
    </div>
  </section>
  );
};

export default ContactMainContent; 