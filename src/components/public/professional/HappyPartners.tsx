// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

const HappyPartners = () => {
  return (
    <section>
      <h2 className="section-title mb-3 text-center">Happy Partners</h2>
      <p className="lead text-center mb-6 px-md-16 px-lg-0">
        Customer satisfaction is our major goal. See what our service partners
        are saying about us.
      </p>
      <div className="position-relative testimonials overflow-hidden">
        <div
          className="shape rounded-circle bg-soft-yellow rellax w-16 h-16"
          data-rellax-speed="1"
          style={{ bottom: "0.5rem", right: "-1.7rem" }}
        ></div>
        <div
          className="shape bg-dot primary rellax w-16 h-16"
          data-rellax-speed="1"
          style={{ top: "-1rem", left: "-1.7rem" }}
        ></div>
        <div className="swiper-container dots-closer mb-6">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
            className="swiper"
          >
            <SwiperSlide className="d-flex">
              <div className="item-inner w-100 d-flex">
                <div className="card w-100">
                  <div className="card-body">
                    <blockquote className="icon mb-0">
                      <p>
                        "I've used other platforms. This was better. Fewer
                        steps. Fewer surprises."
                      </p>
                      <div className="blockquote-details">
                        <div className="info ps-0">
                          <h5 className="mb-1">Melissa H., Plano</h5>
                        </div>
                      </div>
                    </blockquote>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="d-flex">
              <div className="item-inner w-100 d-flex">
                <div className="card w-100">
                  <div className="card-body">
                    <blockquote className="icon mb-0">
                      <p>
                        "My AC went out the day before we hosted a birthday
                        party. Lynx had someone here in 3 hours. No nonsense, no
                        quotes, just fixed."
                      </p>
                      <div className="blockquote-details">
                        <div className="info ps-0">
                          <h5 className="mb-1">Alex G., North Dallas</h5>
                        </div>
                      </div>
                    </blockquote>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="d-flex">
              <div className="item-inner w-100 d-flex">
                <div className="card w-100">
                  <div className="card-body">
                    <blockquote className="icon mb-0">
                      <p>
                        "I didn't want a list. I wanted the right person. Lynx
                        nailed it."
                      </p>
                      <div className="blockquote-details">
                        <div className="info ps-0">
                          <h5 className="mb-1">Chris D., Arlington</h5>
                        </div>
                      </div>
                    </blockquote>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <div className="image-wrapper bg-green">
        <div className="p-10 p-xl-12">
          <div className="row text-center">
            <div className="col-xl-8 col-xxl-6 col-md-8 mx-auto">
              <h2 className="fs-16 text-uppercase text-primary mb-3">
                If you're the real deal, let's do this.
              </h2>
              <h3 className="section-title text-primary">
                We're not for everyone. Just the pros who still give a damn.
              </h3>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-2">
            <span>
              <Link
                to="/signup/partner"
                className="btn btn-primary rounded-pill"
              >
                Apply to Join
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HappyPartners;
