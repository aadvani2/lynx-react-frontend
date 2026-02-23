import React from "react";

const TestimonialsMainContent: React.FC = () => (
  <section className="wrapper bg-light testimonials-page">
  <div className="container pt-6 pb-10">
    <div className="row isotope gx-md-5 gy-3" data-cues="fadeIn" data-duration={800} data-disabled="true">
      <div className="item col-md-6 col-lg-4 col-xl-4 d-flex" data-cue="fadeIn" data-duration={800} data-show="true" style={{ animationName: 'fadeIn', animationDuration: '800ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
        <div className="card shadow-lg w-100">
          <div className="card-body">
            <blockquote className="icon mb-0">
              <p>“I’ve used other platforms. This was better. Fewer steps. Fewer surprises.”</p>
              <div className="blockquote-details">
                <div className="info ps-0">
                  <h5 className="mb-1">Melissa H., Plano</h5>
                  {/*<p class="mb-0">Financial Analyst</p>*/}
                </div>
                <div className="info ps-0 ms-auto">
                  {/* <a href="#" class="btn btn-circle btn-aqua ripple"><i class="uil uil-link"></i></a> */}
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="item col-md-6 col-lg-4 col-xl-4 d-flex" data-cue="fadeIn" data-duration={800} data-show="true" style={{ animationName: 'fadeIn', animationDuration: '800ms', animationTimingFunction: 'ease', animationDelay: '400ms', animationDirection: 'normal', animationFillMode: 'both' }}>
        <div className="card shadow-lg w-100">
          <div className="card-body">
            <blockquote className="icon mb-0">
              <p>“My AC went out the day before we hosted a birthday party. Lynx had someone here in 3 hours. No nonsense, no quotes, just fixed.”</p>
              <div className="blockquote-details">
                <div className="info ps-0">
                  <h5 className="mb-1">Alex G., North Dallas</h5>
                  {/*<p class="mb-0">Financial Analyst</p>*/}
                </div>
                <div className="info ps-0 ms-auto">
                  {/* <a href="#" class="btn btn-circle btn-aqua ripple"><i class="uil uil-link"></i></a> */}
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="item col-md-6 col-lg-4 col-xl-4 d-flex" data-cue="fadeIn" data-duration={800} data-show="true" style={{ animationName: 'fadeIn', animationDuration: '800ms', animationTimingFunction: 'ease', animationDelay: '800ms', animationDirection: 'normal', animationFillMode: 'both' }}>
        <div className="card shadow-lg w-100">
          <div className="card-body">
            <blockquote className="icon mb-0">
              <p>“I didn’t want a list. I wanted the right person. Lynx nailed it.”</p>
              <div className="blockquote-details">
                <div className="info ps-0">
                  <h5 className="mb-1">Chris D., Arlington</h5>
                  {/*<p class="mb-0">Financial Analyst</p>*/}
                </div>
                <div className="info ps-0 ms-auto">
                  {/* <a href="#" class="btn btn-circle btn-aqua ripple"><i class="uil uil-link"></i></a> */}
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
);

export default TestimonialsMainContent; 