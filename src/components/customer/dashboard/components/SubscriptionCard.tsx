import React from 'react';

interface MySubscriptionData {
  plan_name?: string;
  status?: string;
  billing_period?: string;
  next_invoice_on?: string;
  sub_id?: string;
}

interface SubscriptionCardProps {
  data: MySubscriptionData | null;
  loading: boolean;
  error: string | null;
  onViewDetails: () => void;
  onUpgrade: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  data,
  loading,
  error,
  onViewDetails,
  onUpgrade
}) => {
  // Utility function to capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const hasBillingInfo = !!(data?.plan_name || data?.status || data?.next_invoice_on || data?.sub_id || data?.billing_period);

  if (!hasBillingInfo) {
    return null;
  }

  return (
    <div className="card-body">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4 subscription-card">
            <div className="card-header bg-aqua px-4 py-3">
              <h4 className="m-0 fw-semibold h4">My Subscription</h4>
            </div>
            <div className="card-body p-3">
              {error && <div className="alert alert-danger">{error}</div>}
              {loading && <div>Loading...</div>}
              {!loading && (
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                  {/* Plan Info */}
                  <div className="d-flex align-items-center mb-3 mb-md-0">
                    <div className="align-items-center bg-aqua text-color-heading justify-content-center d-flex rounded-circle p-2 me-3 current-plan-icon" style={{ width: 48, height: 48, lineHeight: 27 }}>
                      <i className="uil uil-layer-group fs-23 text-color-heading" />
                    </div>
                    <div>
                      <div className="d-flex align-items-center mb-1">
                        <h3 className="h4 fw-bold text-dark me-2 mb-0">{data?.plan_name || '—'}</h3>
                        {data?.status && <span className="badge bg-green text-color-heading">{capitalizeFirstLetter(data.status)}</span>}
                      </div>
                      <p className="mb-0">Billing {data?.billing_period || '—'}</p>
                      <p className="text-muted mb-0">
                        Next invoice on {data?.next_invoice_on || '—'}
                      </p>
                      <a
                        data-sub-id={data?.sub_id || ''}
                        data-url="/subscribe-details"
                        data-cancel-status
                        className="text-decoration-none underline-3 text-primary my-subscription"
                        style={{ cursor: 'pointer' }}
                        onClick={onViewDetails}
                      >
                        <span className="underline-2 primary">View Details</span>
                      </a>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <a
                      href="javascript:;"
                      className="btn btn-sm btn-primary border-0 rounded-pill planUpgradeBtn"
                      data-sub-id={data?.sub_id || ''}
                      onClick={onUpgrade}
                    >
                      Upgrade
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
