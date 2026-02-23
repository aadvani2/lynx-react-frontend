import React from 'react';

interface ContactInformationContentProps {
  setActivePage: (page: string) => void;
}

const ContactInformationContent: React.FC<ContactInformationContentProps> = ({ setActivePage }) => {
  return (
    <div id="loadView">
      <div className="card my-account-dashboard">
        <div className="card-header p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-between">
            <button 
              className="btn btn-primary btn-sm rounded-pill" 
              onClick={() => setActivePage("dashboard")}
            >
              <i className="uil uil-arrow-left" /> Back
            </button>
            &nbsp;&nbsp;
            <h4 className="card-title mb-0">Contact Lynx</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-xxl-8 col-xl-12 col-md-12">
              <div className="d-flex flex-row mb-2">
                <div>
                  <div className="icon text-primary fs-24 me-4 mt-n1">
                    <i className="uil uil-envelope" />
                  </div>
                </div>
                <div>
                  <h6 className="mb-1">E-mail</h6>
                  <a href="mailto:hello@connectwithlynx.com" className="link-email">
                    hello@connectwithlynx.com
                  </a>
                </div>
              </div>
              
              <div className="d-flex flex-row mb-2">
                <div>
                  <div className="icon text-primary fs-24 me-4 mt-n1">
                    <i className="uil uil-phone-volume" />
                  </div>
                </div>
                <div>
                  <h6 className="mb-1">Phone</h6>
                  <a href="tel:+18774115969">
                    +1 (877) 411-5969
                  </a>
                </div>
              </div>
              
              <div className="d-flex flex-row mb-2">
                <div>
                  <div className="icon text-primary fs-24 me-4 mt-n1">
                    <i className="uil uil-phone-volume" />
                  </div>
                </div>
                <div>
                  <h6 className="mb-1">Phone 2</h6>
                  <a href="tel:+18774115969">
                    +1 (877) 411-LYNX
                  </a>
                </div>
              </div>
              
              <div className="d-flex flex-row">
                <div>
                  <div className="icon text-primary fs-24 me-4 mt-n1">
                    <i className="uil uil-map-marker" />
                  </div>
                </div>
                <div>
                  <h6 className="mb-1">Address</h6>
                  <label>5900 Balcones Drive STE 100
                  <br />Austin, TX 78731</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformationContent; 