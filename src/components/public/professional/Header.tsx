import { Link } from "react-router-dom";

const Header = () => {
  return (
    <section className="wrapper image-wrapper bg-yellow">
      <div className="container pt-16 pb-6">
        <div className="row gx-lg-8 gx-xl-12 text-center">
          <div className="col-lg-12">
            <h2 className="display-1 mb-3">Become a Partner</h2>
            <p className="lead fs-lg">
              We don't sell leads. We send real jobs.
            </p>
            <p className="mb-6">
              You've seen what the other platforms do. Pay-per-lead. Compete
              with ten other guys. Ghosted by the customer. We built Lynx to be
              the opposite — real jobs, one pro, no nonsense.
            </p>

            <span className="mt-6 mb-0">
              We don't work with just anyone.
              <br />
              <Link
                to="/signup/partner"
                className="btn btn-primary rounded-pill mt-4 w-20 mx-auto"
              >
                Apply to Join
              </Link>
              <br />
            </span>
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
};

export default Header;
