import React, { useState } from 'react';

interface UpgradeSubscriptionContentProps {
  setActivePage: (page: string) => void;
}

const UpgradeSubscriptionContent: React.FC<UpgradeSubscriptionContentProps> = ({ setActivePage }) => {
  const [activeAccordion, setActiveAccordion] = useState<string>('collapse9');


  const handleAccordionToggle = (targetId: string) => {
    setActiveAccordion(activeAccordion === targetId ? '' : targetId);
  };


  const handleUpgrade = (planId: number) => {
    console.log(`Upgrading to plan ${planId}`);
    // Handle upgrade logic here
  };

  return (
    <div className="card my-account-dashboard">
      <div className="card-header p-3 d-flex align-items-center justify-content-start">
        <button
          className="btn btn-primary btn-sm rounded-pill"
          onClick={() => setActivePage("dashboard")}
        >
          <i className="uil uil-arrow-left" /> Back
        </button>
        <h4 className="card-title mb-0 ms-3">Upgrade Subscription</h4>
      </div>


      <section className="pricing-mobile d-block pricing-dask pb-6 pt-6">
        <div className="container">
          <div className="accordion accordion-wrapper" id="accordionExample">
            <div className="card accordion-item">
              <div className="card-header" id="heading9">
                <button 
                  onClick={() => handleAccordionToggle('collapse9')}
                  aria-expanded={activeAccordion === 'collapse9'}
                  aria-controls="collapse9"
                >
                  <div className="plan-header-content">
                    <h3>Premium</h3>
                    <p>For proactive homeowners who want more control and faster service.</p>
                    <p>Starting from <b>$150.00 / year</b></p>
                  </div>
                </button>
              </div>
              <div 
                id="collapse9" 
                className={`accordion-collapse collapse ${activeAccordion === 'collapse9' ? 'show' : ''}`} 
                aria-labelledby="heading9"
              >
                <div className="card-body">
                  <div className="plan-price">
                    <div className="price m_switch_plan select cursor-pointer" data-price-id="price_1RLhtID0X9PiOCIuQKs7O5rx" data-coming={0} data-form-id={9}>
                      <p>
                        <b>$150.00</b><br />
                        <span className="fs-14">Yearly</span>
                      </p>
                    </div>
                  </div>
                  <ul className="plan-features">
                    <li>✅ <b>Scheduled service</b></li>
                    <li>✅ <b>Urgent service</b></li>
                    <li>✅ <b>Emergency service</b> - 2 free per year, then $30 per request</li>
                    <li>✅ <b>Home Planner (Coming Soon)</b> - Standard features</li>
                    <li>✅ <b>Marketplace (Coming Soon)</b></li>
                    <li>✅ <b>Manage up to 3 properties</b></li>
                  </ul>
                  <form method="POST" action="" id="subscriptionForm-9" className="subscriptionForm">
                    <input type="hidden" name="_token" defaultValue="YcVuEyltbKHnPGm11gB0E645D1fBpHiQhdY6XNA0" autoComplete="off" />
                    <input type="hidden" name="p_name" defaultValue="Premium" />
                    <input type="hidden" name="is_upgrade" defaultValue="true" />
                    <input type="hidden" name="p_id" defaultValue="price_1RLhtID0X9PiOCIuQKs7O5rx" />
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill d-flex mx-auto mt-3 selectPlan"
                      onClick={() => handleUpgrade(9)}
                      data-upgrade="true"
                    >
                      Upgrade
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="card accordion-item">
              <div className="card-header" id="heading10">
                <button 
                  onClick={() => handleAccordionToggle('collapse10')}
                  aria-expanded={activeAccordion === 'collapse10'}
                  aria-controls="collapse10"
                >
                  <div className="plan-header-content">
                  <p className="pricing-ribbon badge" style={{ fontSize: 10, fontWeight: 400 }}>Coming Soon</p>
                    <h3>Corporate</h3>
                    <p>For landlords, property managers, or teams managing multiple locations.</p>
                    <p>Starting from <b>$500.00 / year</b></p>
                  </div>
                </button>
              </div>
              <div 
                id="collapse10" 
                className={`accordion-collapse collapse ${activeAccordion === 'collapse10' ? 'show' : ''}`} 
                aria-labelledby="heading10"
              >
                <div className="card-body">
                  <div className="plan-price">
                  </div>
                  <ul className="plan-features">
                    <li>✅ <b>Scheduled service</b></li>
                    <li>✅ <b>Urgent service</b></li>
                    <li>✅ <b>Emergency service</b> - $60 per request</li>
                    <li>✅ <b>Home Planner (Coming Soon)</b></li>
                    <li>✅ <b>Marketplace (Coming Soon)</b></li>
                    <li>✅ <b>Multi-property management dashboard</b></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpgradeSubscriptionContent; 