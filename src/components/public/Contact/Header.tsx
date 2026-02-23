import React from "react";

const ContactHeader: React.FC = () => (
  <section className="wrapper image-wrapper bg-yellow">
    <div className="container pt-16 pb-6 text-center">
      <div className="row">
        <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-duration="1200" data-group="page-title" data-disabled="true">
          <h1 className="display-1 mb-3" data-cue="slideInDown" data-duration="1200" data-group="page-title" data-show="true" style={{ animationName: 'slideInDown', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Get in Touch</h1>
        </div>
      </div>
    </div>
    <div className="overflow-hidden">
      <div className="divider text-light mx-n2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60">
          <path fill="currentColor" d="M0,0V60H1440V0A5771,5771,0,0,1,0,0Z"></path>
        </svg>
      </div>
    </div>
  </section>
);

export default ContactHeader; 