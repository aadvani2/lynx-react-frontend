import { Link } from "react-router-dom";

const WantToSeeYourCompany: React.FC = () => (
  <section className="wrapper bg-light">
    <div className="container mb-7">
      <div className="col-xxl-10 mx-auto">
        <div className="row gx-lg-8 gx-xl-12">
          <div className="col-lg-12 mt-8">
            <div className="card text-primary bg-soft-aqua">
              <div className="card-body p-5">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mobile-text-center">
                  <div>
                    <h3 className="section-title mb-3 pe-lg-10 pe-xl-5 pe-xxl-18">Want to See Your Company Here?</h3>
                    <p className="mb-0">
                      We're always on the lookout for the kind of pros who show up, do it right, and earn trust.<br />
                      If that's how you work, we'd love to meet you.
                    </p>
                  </div>
                  <Link to="/professional" className="btn btn-primary rounded-pill mb-0 text-nowrap mt-3 mt-lg-0">Learn More</Link>
                </div>
              </div>
              {/*/.card-body */}
            </div>
          </div>
          {/*/column */}
        </div>
      </div>
      {/*/.row */}
    </div>
    {/* /.container */}
  </section>
);

export default WantToSeeYourCompany;
