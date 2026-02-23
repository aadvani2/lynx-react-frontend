import React from 'react';

interface ErrorSectionProps {
  subcategoryTitle: string;
  error: string;
}

const ErrorSection: React.FC<ErrorSectionProps> = ({ subcategoryTitle, error }) => {
  return (
    <>
      <section className="wrapper image-wrapper bg-yellow">
        <div className="container pt-16 pb-6 text-center">
          <div className="row">
            <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-group="page-title" data-disabled="true">
              <h1 className="display-1 mb-3" data-cue="slideInDown" data-group="page-title" data-show="true" style={{ animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
                {subcategoryTitle}
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
      <section id="service-details" className="wrapper bg-light wrapper-border">
        <div className="container pt-3 pb-10">
          <div className="position-relative text-center">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error Loading Service Details</h4>
              <p>{error}</p>
              <hr />
              <p className="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ErrorSection; 