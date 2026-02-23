import { Link } from "react-router-dom";
import becomeAPartnerImage from "../../../assets/images/become-a-partner.jpeg";

const Message = () => {
  return (
    <>
      <section id="snippet-1" className="wrapper bg-light">
        <div className="container py-6 py-md-6">
          <div
            className="card image-wrapper bg-full bg-soft-aqua mb-6"
            data-image-src="./assets/img/photos/bg22.png"
          >
            <div className="card-body py-6 px-6">
              <div className="row">
                <div className="col-xxl-10 mx-auto">
                  <h2 className="fs-16 text-uppercase text-primary mb-3">
                    Lynx launches soon!
                  </h2>
                  <h3 className="section-title mb-3">
                    Get in early. Secure your spot. Help shape the platform.
                  </h3>
                  <h5>
                    <b>
                      Joining Lynx is 100% free, no upfront costs, and signing
                      up takes just minutes. No hoops. No hassle. Just jobs.
                    </b>
                  </h5>
                  <p>
                    We’re building something different — a platform that sends
                    you real jobs, not just leads. Lynx launches soon, and we’re
                    inviting a select group of service pros to join us from day
                    one.
                  </p>
                  <b>Why join early?</b>
                  <ul>
                    <li>Priority placement in customer searches</li>
                    <li>
                      Direct access to real, confirmed jobs (no chasing leads)
                    </li>
                    <li>
                      Influence how Lynx works — your feedback will drive
                      improvements
                    </li>
                    <li>
                      Lock in early access before this window closes soon.
                    </li>
                  </ul>
                  <span>
                    <Link
                      className="btn btn-primary rounded-pill"
                      to="/signup/partner"
                    >
                      Apply Now
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="row pt-14 what-makes">
            <div className="col-xxl-10 col-xl-10 col-lg-12 mx-auto">
              <div className="row align-items-center">
                <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-4 position-relative mobile-text-center">
                  <figure className="rounded mb-0 choose-partner">
                    <img
                      className="rounded shadow-lg p-3 mb-5 bg-white rounded"
                      src={becomeAPartnerImage}
                      alt="Become a Partner"
                    />
                  </figure>
                </div>
                <div className="col-xxl-9 col-xl-9 col-lg-8 col-md-8 mobile-text-center">
                  <h3 className="section-title mb-4">
                    What Makes Lynx Different
                  </h3>
                  <h4 className="fs-lg mb-5">
                    This isn’t a marketplace. It’s a match.
                  </h4>
                  <p className="mb-1">
                    <b>One customer. One pro.</b> - That’s it. No quoting
                    battles. No 'I’ll get back to you.'
                  </p>
                  <p className="mb-1">
                    <b>Real jobs only.</b> - We screen the customer before you
                    even hear from them.
                  </p>
                  <p className="mb-1">
                    <b>No finish, no fee.</b> - You only pay us if you actually
                    complete the job. Wild, right?
                  </p>
                  <p className="mb-1">
                    <b>We’re selective.</b> - We don’t list just anyone —
                    because trust works both ways.
                  </p>

                  <h3 className="section-title mb-4 mt-6">The Bigger Why</h3>
                  <h4 className="fs-lg mb-5">
                    You’ve built a reputation. Don’t rent it to platforms that
                    treat you like a number.
                  </h4>
                  <p>
                    You show up. You do it right. You’ve been burned by lead
                    sellers who care more about volume than value.
                  </p>
                  <p>Lynx is here to flip that script.</p>
                  <p>
                    We send you real, vetted customers — one at a time. If they
                    ghost, you don’t pay. If you pass, that’s fine. We’re here
                    to make your life easier — not more crowded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wrapper">
        <div className="container">
          <hr className="my-6 mobile-hr" />
        </div>
      </section>
    </>
  );
};

export default Message;
