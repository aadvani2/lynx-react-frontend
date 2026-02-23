import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { customerService } from '../../services/customerServices/customerService';
import { useCustomerStore } from '../../store/customerStore/customerStore';
import { addModalCloseIconStyles } from '../../utils/modalCloseIcon';

interface SubscriptionDetailsContentProps {
  setActivePage: (page: string) => void;
}

interface Plan {
  id: string;
  product: string;
  name: string;
  amount: number;
  currency: string;
  interval: string;
  interval_count: number;
  color: string | null;
  upgradable: boolean;
}

interface UpcomingInvoice {
  amount_due: number;
  currency: string;
  period_start: number;
  period_end: number;
  next_payment_attempt: number;
}

interface Subscription {
  id: string;
  billing_cycle_anchor: number;
  cancel_at: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  created: number;
  currency: string;
  current_period_end: number;
  current_period_start: number;
  customer: string;
  payment_settings: {
    payment_method_options: unknown;
    payment_method_types: unknown;
    save_default_payment_method: string;
  };
  quantity: number;
  start_date: number;
  status: string;
  trial_start: number | null;
  trial_end: number | null;
  plan: Plan;
  upcoming_invoice: UpcomingInvoice;
}

interface PastInvoice {
  amount: number;
  status: string;
  number: string;
  created_at: string;
  pdf_url: string;
  currency?: string;
}

interface SubscriptionDetailsResponse {
  user_timezone: number;
  subscription: Subscription;
  upcomingInvoice: unknown;
  pastInvoice: PastInvoice[] | null;
}

const SubscriptionDetailsContent: React.FC<SubscriptionDetailsContentProps> = ({ setActivePage }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<SubscriptionDetailsResponse | null>(null);
  const { selectedSubscriptionId } = useCustomerStore();

  // Utility functions
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100); // Convert from cents
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  const subId = useMemo(() => {
    // Use subscription ID from store, fallback to reading from hidden input, then placeholder
    if (selectedSubscriptionId) {
      return selectedSubscriptionId;
    }
    const el = document.getElementById('my_sub_id') as HTMLInputElement | null;
    return el?.value ;
  }, [selectedSubscriptionId]);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const payload = { subId: subId || '', user_timezone: timezoneHours };
        const response = await customerService.getSubscriptionDetails(payload);
        const data = response?.data || response;
        if (isMounted) setDetails(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load subscription details';
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [subId, timezoneHours]);

  const handleCancelSubscription = () => {
    // Add custom close icon styles
    const cleanupStyles = addModalCloseIconStyles({
      className: 'swal2-close',
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      hoverBackgroundColor: 'rgba(0, 0, 0, 0.25)',
      size: 1.8,
      fontSize: 1.2,
      top: '0.7rem',
      right: '0.7rem'
    });

    Swal.fire({
      title: 'Cancel Subscription',
      html: 'Are you sure you want to cancel your subscription? Your subscription will be cancelled and you will not be charged for the next billing cycle.',
      imageUrl: '',
      imageWidth: 77,
      imageHeight: 77,
      showCancelButton: false,
      showDenyButton: false,
      showCloseButton: true,
      confirmButtonText: 'Yes, cancel it!',
      confirmButtonColor: '#0d6efd',
      customClass: {
        popup: 'swal2-popup swal2-modal swal2-show',
        container: 'swal2-container swal2-center swal2-backdrop-show',
        confirmButton: 'btn btn-primary rounded-pill w-20'
      },
      buttonsStyling: false
    }).then((result) => {
      // Cleanup styles after modal closes
      cleanupStyles();
      
      if (result.isConfirmed) {
        // TODO: hook up cancel endpoint
        Swal.fire('Cancelled!', 'Your subscription has been cancelled.', 'success');
      }
    });
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
        <h4 className="card-title mb-0 ms-3">Subscription Details</h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="text-center py-3">Loading...</div>}
        {!loading && details && (
          <div className="row g-4 subscriptionDetailModal">
            <input type="hidden" id="my_sub_id" defaultValue={subId} />
            <div className="col-lg-12">
              <div className="info-box">
                <p><strong>Status:</strong> {capitalizeFirstLetter(details.subscription?.status || '—')}</p>
                <p><strong>Created:</strong> {details.subscription?.created ? formatTimestamp(details.subscription.created) : '—'}</p>
                <p><strong>Current Period:</strong> {details.subscription?.current_period_start && details.subscription?.current_period_end 
                  ? `${formatTimestamp(details.subscription.current_period_start)} to ${formatTimestamp(details.subscription.current_period_end)}`
                  : '—'}</p>
                <p><strong>Plan:</strong> {details.subscription?.plan?.name || '—'}</p>
                <p><strong>Amount:</strong> {details.subscription?.plan?.amount ? formatCurrency(details.subscription.plan.amount, details.subscription.currency) : '—'}</p>
                <p><strong>Billing:</strong> {details.subscription?.plan?.interval ? `${capitalizeFirstLetter(details.subscription.plan.interval)}` : '—'}</p>
              </div>
            </div>
            <div className="col-lg-12">
              <h4 className="mt-0">Upcoming Invoice</h4>
              <div className="info-box fs-15">
                {details.subscription?.upcoming_invoice ? (
                  <>
                    <div className="row mb-3">
                      <div className="col">
                        <div>
                          {formatTimestamp(details.subscription.upcoming_invoice.period_start)} – {formatTimestamp(details.subscription.upcoming_invoice.period_end)}
                        </div>
                        <div className="fw-semibold">{details.subscription.plan?.name || '—'}</div>
                      </div>
                      <div className="col-auto text-end fw-semibold">
                        {formatCurrency(details.subscription.upcoming_invoice.amount_due, details.subscription.upcoming_invoice.currency)}
                      </div>
                    </div>
                    <hr style={{margin: 0}} />
                    <div className="d-flex justify-content-between fw-semibold">
                      <span>Amount Due</span>
                      <span>{formatCurrency(details.subscription.upcoming_invoice.amount_due, details.subscription.upcoming_invoice.currency)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Next Payment Attempt</span>
                      <span>{formatTimestamp(details.subscription.upcoming_invoice.next_payment_attempt)}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted py-3">
                    No upcoming invoice available
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-12">
              <h4 className="mt-0">Past Invoices</h4>
              <div className="info-box info-box-pdf fs-15">
                {details.pastInvoice && Array.isArray(details.pastInvoice) && details.pastInvoice.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table mb-0 w-100">
                      <thead>
                        <tr>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Invoice No.</th>
                          <th>Created</th>
                          <th>PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.pastInvoice.map((inv: PastInvoice, idx: number) => (
                          <tr key={idx}>
                            <td>{formatCurrency(inv.amount, inv.currency || 'usd')}</td>
                            <td><span className="badge bg-success">{capitalizeFirstLetter(inv.status)}</span></td>
                            <td>{inv.number}</td>
                            <td>{inv.created_at}</td>
                            <td>
                              <a href={inv.pdf_url} target="_blank" className="pdf-icon" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width={512} height={512} x={0} y={0} viewBox="0 0 512 512" xmlSpace="preserve">
                                  <g>
                                    <path d="M370.374 428.197c5.24-11.392 14.572-19.742 25.854-23.677V362c0-24.813 20.187-45 45-45H467a44.79 44.79 0 0 1 15 2.58V45c0-24.813-20.187-45-45-45H137c-24.813 0-45 20.187-45 45v22h258c33.084 0 60 26.916 60 60v140c0 33.084-26.916 60-60 60H92v140c0 24.813 20.187 45 45 45h270.702l-30.612-35.714c-11.574-13.504-14.148-31.931-6.716-48.089z" fill="#e2626b" opacity={1} data-original="#000000" />
                                    <path d="M496.971 432H482v-70c0-8.284-6.716-15-15-15h-25.772c-8.284 0-15 6.716-15 15v70h-14.971c-12.815 0-19.729 15.032-11.389 24.762l42.857 50c5.986 6.984 16.791 6.984 22.778 0l42.857-50c8.34-9.73 1.426-24.762-11.389-24.762zM192.012 157h-18.304c.021 12.221.054 32.202.054 39.889 0 9.163.058 28.278.096 40.062 6.496-.037 14.523-.095 18.808-.17 20.426-.357 29.729-20.872 29.729-39.781 0-19.337-7.981-40-30.383-40zM94.917 157H77.103c.019 6.62.04 14.699.04 18.22 0 4.152.036 11.935.068 18.288 6.165-.033 13.643-.067 17.706-.067 10.176 0 18.773-8.344 18.773-18.22S105.093 157 94.917 157z" fill="#e2626b" opacity={1} data-original="#000000" />
                                    <path d="M380 267V127c0-16.569-13.431-30-30-30H30c-16.569 0-30 13.431-30 30v140c0 16.569 13.431 30 30 30h320c16.569 0 30-13.431 30-30zM94.917 213.44c-4.081 0-11.66.035-17.844.068V247c0 5.523-4.477 10-10 10s-10-4.477-10-10v-99.968a10.001 10.001 0 0 1 10-10.031h27.844c21.379 0 38.773 17.146 38.773 38.22s-17.393 38.219-38.773 38.219zm134.738 24.705c-9.011 11.76-22.022 18.377-36.639 18.633-8.052.141-28.23.219-29.085.222h-.038a10 10 0 0 1-10-9.964c-.001-.363-.13-36.399-.13-50.147 0-11.402-.072-49.87-.072-49.871A9.999 9.999 0 0 1 163.69 137h28.322c30.136 0 50.383 24.112 50.383 60 0 15.81-4.524 30.422-12.74 41.145zM312.926 157h-30.531v29.053h27.311c5.523 0 10 4.477 10 10s-4.477 10-10 10h-27.311V247c0 5.523-4.477 10-10 10s-10-4.477-10-10V147a10.001 10.001 0 0 1 10-10h40.531c5.523 0 10 4.477 10 10s-4.477 10-10 10z" fill="#e2626b" opacity={1} data-original="#000000" />
                                  </g>
                                </svg>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted py-3">
                    No past invoices available
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex gap-2 mt-3 justify-content-center">
              <button type="button" className="btn btn-primary rounded-pill resume-subscription-btn d-none" data-sub-id={subId}>
                Resume Subscription
              </button>
              <button 
                type="button" 
                className="btn rounded-pill btn-danger cancel-subscription-btn" 
                data-sub-id={subId}
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetailsContent; 