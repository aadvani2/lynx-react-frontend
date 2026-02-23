import ScrollAnimation from "./ScrollAnimation";

const LaunchNotice = () => {
  return (
    <>
      {/* Launch Notice Section */}
      <section className="wrapper bg-light">
        <div className="container py-6 py-md-6">
          <ScrollAnimation>
            <div
              className="card image-wrapper bg-full bg-soft-aqua mb-12"
              data-image-src=""
            >
              <div className="card image-wrapper bg-full bg-soft-aqua mb-12" data-image-src="./assets/img/photos/bg22.png">
                <div className="card-body py-6 px-6">
                  <div className="row">
                    <div className="col-xxl-10 mx-auto" data-cues="slideInUp" data-duration={1200} data-disabled="true">
                      <h4 className="section-title font-bricolage mb-md-7 mb-4" data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Lynx Is Live — Starting with Dallas-Fort Worth!</h4>
                      <h5 data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}><b>100% free to join. No hoops. No hassle. Just help.</b></h5>
                      <p data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>We’re now live in DFW—connecting homeowners with top-rated local pros for emergency and scheduled jobs. Fast matches. Zero spam. Real results.</p>
                      <ul data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>
                        <li>Customers – Book trusted help across the Metroplex, fast.</li>
                        <li>Service Providers – We’re matching jobs daily. Claim your spot before they’re gone.</li>
                      </ul>
                      <p data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Need help along the way? A real person is always available to assist.</p>
                      <p data-cue="slideInUp" data-duration={1200} data-show="true" style={{ animationName: 'slideInUp', animationDuration: '1200ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both' }}>Get the job done. Connect with Lynx.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
          <div className="row">
            <div className="col-xxl-10 mx-auto">
              <div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
                <div className="col-lg-5 position-relative order-lg-2 mb-5 what-is-lynx">
                  <ScrollAnimation>
                    <div className="what-is-lynx-img overlap-grid overlap-grid-2">
                      <div className="item">
                        <figure className="rounded shadow">
                          <img
                            src=""
                            srcSet=""
                            alt=""
                          />
                        </figure>
                      </div>

                      <div className="item">
                        <figure className="rounded shadow">
                          <img
                            src=""
                            srcSet=""
                            alt=""
                          />
                        </figure>
                      </div>
                    </div>
                  </ScrollAnimation>
                </div>
                <div className="text-center why-choose-lynx">
                  <ScrollAnimation>
                    <div className="col-md-10 col-lg-7 mx-auto position-relative">
                      <h3 className="section-title font-bricolage mb-3 px-xl-6">
                        Why Choose Lynx?
                      </h3>
                      <h3 className="mb-0">
                        You've tried the others. This one actually works.
                      </h3>
                    </div>
                  </ScrollAnimation>
                </div>
                <div className="col-lg-7 mt-lg-10 mt-7">
                  <ul className="icon-list bullet-bg bullet-soft-aqua mb-0">
                    <ScrollAnimation>
                      <li className="mb-lg-6 mb-5">
                        <span>
                          <i className="uil uil-check text-primary"></i>
                        </span>
                        <h4 className="mobile-text-left">
                          No spam. No lists. No guessing.
                        </h4>
                        We connect you with one trusted pro — not a directory
                        that will treat you like a lead.
                      </li>
                    </ScrollAnimation>
                    <ScrollAnimation>
                      <li className="mb-lg-6 mb-5">
                        <span>
                          <i className="uil uil-check text-primary"></i>
                        </span>
                        <h4 className="mobile-text-left">
                          We vet the customer and the provider.
                        </h4>
                        You both deserve to work with someone serious.
                      </li>
                    </ScrollAnimation>
                    <ScrollAnimation>
                      <li className="mb-lg-6 mb-5">
                        <span>
                          <i className="uil uil-check text-primary"></i>
                        </span>
                        <h4 className="mobile-text-left">
                          Need help in hours? Days? Next week?
                        </h4>
                        ASAP? Later this week? Totally up to you.
                      </li>
                    </ScrollAnimation>
                    <ScrollAnimation>
                      <li className="mb-lg-6 mb-5">
                        <span>
                          <i className="uil uil-check text-primary"></i>
                        </span>
                        <h4 className="mobile-text-left">
                          Pay your pro directly.
                        </h4>
                        No weird fees. No surprise charges.
                      </li>
                    </ScrollAnimation>
                    <ScrollAnimation>
                      <li>
                        <span>
                          <i className="uil uil-check text-primary"></i>
                        </span>
                        <h4 className="mobile-text-left">
                          Emergency support without emergency headaches.
                        </h4>
                        We'll get someone to you — fast, not frantic.
                      </li>
                    </ScrollAnimation>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Launch Notice Section */}

      {/* Why Choose Lynx Section */}
      <section>
        <div className="container">
          <hr className="my-6 mobile-hr" />
        </div>
      </section>
      {/* End Why Choose Lynx Section */}
    </>
  );
};

export default LaunchNotice;
