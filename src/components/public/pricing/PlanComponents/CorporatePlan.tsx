import React from 'react';
import type { PricingPlanProps } from '../types';

const CorporatePlan: React.FC<PricingPlanProps> = ({ 
  plan, 
  isMobile = false, 
  isOpen = false, 
  onToggle, 
  panelRef 
}) => {
  // Note: Corporate plan is coming soon, so no subscription handler needed

  if (isMobile) {
    return (
      <div
        className="card accordion-item"
        style={{
          background: "linear-gradient(90deg, #F1B60040 0%, rgba(255,255,255,1) 100%)",
        }}
      >
        <div className="card-header" id="heading13">
          <button
            className={`accordion-button no-chevron${
              isOpen ? "" : " collapsed"
            }`}
            type="button"
            aria-expanded={isOpen}
            aria-controls="collapse13"
            style={{ flexDirection: "column", alignItems: "flex-start" }}
            onClick={onToggle}
          >
            <p
              className="pricing-ribbon badge"
              style={{ fontSize: 10, fontWeight: 400 }}
            >
              Coming Soon
            </p>
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <p>
              Starting from <b>{plan.price} / {plan.period}</b>
            </p>
          </button>
        </div>
        <div
          id="collapse13"
          ref={panelRef}
          aria-labelledby="heading13"
          data-bs-parent="#accordionExample"
        >
          <div className="card-body">
            <div className="plan-price">
              <div className="price">
                <p>
                  <b>{plan.price}</b>
                  <br />
                  <span className="fs-14">{plan.period}</span>
                </p>
              </div>
            </div>

            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>
                  {feature.included ? '✅' : '❌'} <b>{feature.text}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-column brevo-coming-soon">
      <div className="plan-popular fs-16">Coming Soon</div>
      <div className="pricing-column-top">
        <div className="plan-name">
          <h3 className="m-0">{plan.name}</h3>
        </div>
        <div className="price-starting">
          <div className="price-currency">
            <div className="d-flex align-items-end">
              <h3 className="m-0 display-4">{plan.price}</h3>
              <span>/{plan.period}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-column-bottom">
        <div>
          <h6 className="text-start">{plan.description}</h6>
          <ul className="icon-list bullet-bg bullet-soft-primary mt-3 mb-3 text-start">
            {plan.features.map((feature, index) => (
              <li key={index}>
                <span
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={feature.tooltip}
                >
                  {feature.included ? '✅' : '❌'} <b>{feature.text}</b>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CorporatePlan; 