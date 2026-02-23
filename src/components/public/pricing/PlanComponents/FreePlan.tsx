import React from 'react';
import type { PricingPlanProps } from '../types';

const FreePlan: React.FC<PricingPlanProps> = ({ 
  plan, 
  isMobile = false, 
  isOpen = false, 
  onToggle, 
  panelRef,
  onSubscribe,
  showSubscribeButton = true
}) => {
  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe();
    } else {
      // Fallback to original behavior if no onSubscribe prop is provided
      console.log('Subscribe to Free plan');
    }
  };

  if (isMobile) {
    return (
      <div
        className="card accordion-item"
        style={{
          background: "linear-gradient(90deg, #349DEB40 0%, rgba(255,255,255,1) 100%)",
        }}
      >
        <div className="card-header" id="heading11">
          <button
            className={`accordion-button no-chevron${
              isOpen ? "" : " collapsed"
            }`}
            style={{ flexDirection: "column", alignItems: "flex-start" }}
            type="button"
            aria-expanded={isOpen}
            aria-controls="collapse11"
            onClick={onToggle}
          >
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
          </button>
        </div>
        <div
          id="collapse11"
          ref={panelRef}
          aria-labelledby="heading11"
          data-bs-parent="#accordionExample"
        >
          <div className="card-body">
            <div className="plan-price">
              <div className="price select">
                <p>{plan.price}</p>
              </div>
            </div>

            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>
                  {feature.included ? '✅' : '❌'} <b>{feature.text}</b>
                </li>
              ))}
            </ul>

            {showSubscribeButton && (
              <form
                method="POST"
                action=""
                id="subscriptionForm-11-mobile"
                className="subscriptionForm"
              >
                <input
                  type="hidden"
                  name="_token"
                  value="kyybBxekFLntTXnjJVKXbcrGSxvVSK6Exi9f55HA"
                  autoComplete="off"
                />
                <input type="hidden" name="p_name" value={plan.name} />
                <input
                  type="hidden"
                  name="p_id"
                  value={plan.priceId}
                />
                <button
                  type="button"
                  className="btn btn-primary rounded-pill d-flex mx-auto mt-3 selectPlan"
                  onClick={handleSubscribe}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-column">
      <div className="pricing-column-top">
        <div className="plan-name">
          <h3 className="m-0">{plan.name}</h3>
        </div>
        <div className="price-starting">
          <div className="price-currency">
            <div>
              <h3 className="display-6 mb-0">{plan.price}</h3>
              <p className="fs-12">No credit card required.</p>
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

      {showSubscribeButton && (
        <form
          method="POST"
          action=""
          id="subscriptionForm-11-desktop"
          className="subscriptionForm"
        >
          <input
            type="hidden"
            name="_token"
            value="kyybBxekFLntTXnjJVKXbcrGSxvVSK6Exi9f55HA"
            autoComplete="off"
          />
          <input type="hidden" name="p_name" value={plan.name} />
          <input
            type="hidden"
            name="p_id"
            value={plan.priceId}
          />
          <button
            type="button"
            className="btn btn-primary rounded-pill w-100 mt-3 selectPlan"
            onClick={handleSubscribe}
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
};

export default FreePlan;
