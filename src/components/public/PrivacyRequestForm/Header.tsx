import React from "react";

const PrivacyRequestFormHeader: React.FC = () => (
  <section className="wrapper image-wrapper bg-yellow">
    <div className="container pt-16 pb-6 text-center">
      <div className="row">
        <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto">
          <div className="post-header">
            <h1 className="display-1 mb-3">Privacy Request Form</h1>
            <p className="lead px-xxl-10">Don't take our word for it. See what customers are saying about us.</p>
          </div>
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

);

export default PrivacyRequestFormHeader; 