import React from 'react';
import type { RequestDetailsResponse } from '../../../types/employee/request-details';
import BackendImage from '../../common/BackendImage/BackendImage';
import { RequestHeader } from '../../partner/accepted-request-details';
import LoadingComponent from '../../common/LoadingComponent';

interface CompletedRequestDetailsContentProps {
  onBack: () => void;
  requestDetails: RequestDetailsResponse['data'] | null;
  isLoading: boolean;
  error: string | null;
}

const CompletedRequestDetailsContent: React.FC<CompletedRequestDetailsContentProps> = ({ onBack, requestDetails, isLoading, error }) => {
  if (isLoading) { return (<LoadingComponent />); }

  if (error) {
    return (
      <div className="alert alert-danger mt-3">
        {error}
      </div>
    );
  }

  if (!requestDetails) {
    return (
      <div className="alert alert-warning mt-3">
        No request details found.
      </div>
    );
  }

  const scheduleLabel = String(requestDetails.request.service_tier_tag || '').toLowerCase() === 'emergency'
    ? 'Emergency Time'
    : 'Scheduled time';

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f0f9fb' }}>
      <RequestHeader
        requestId={requestDetails.request.request_id}
        onBackClick={onBack}
      />

      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="card mb-3">
            <div className="card-body p-3">
              <div className="mb-3 service-tier-tag">
                <u className="text-bold`">Request Type: {" "}</u>
                <b>{requestDetails.request.service_tier_tag}</b>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div /* style={{ width: 32, height: 32 }} */>
                  <BackendImage 
                    src={requestDetails.status_icon} 
                    alt="Status Icon" 
                    className="img-fluid"
                  />
                </div>
                <div className="ms-3">
                  {requestDetails.message}
                </div>
              </div>
              <hr className="mt-2 mb-2" />
              <div className="d-flex align-items-center">
                <div style={{ width: 80, height: 80 }}>
                  <BackendImage 
                    src={requestDetails.request.member.image} 
                    alt="Employee Image" 
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div className="ms-3">
                  <div className="fw-semibold">{requestDetails.request.member.name}</div>
                  <div className="text-body fs-sm link-email">{requestDetails.request.member.email}</div>
                  <div className="text-body fs-sm">
                    <i className="uil uil-phone" />
                    <a href={`tel:${requestDetails.request.member.dial_code}${requestDetails.request.member.phone}`}>
                      {requestDetails.request.member.dial_code} ({requestDetails.request.member.phone.substring(0, 3)}) {requestDetails.request.member.phone.substring(3, 6)}-{requestDetails.request.member.phone.substring(6)}
                    </a>
                  </div>
                  {requestDetails.request.member.phone2 && (
                    <div className="text-body fs-sm">
                      <i className="uil uil-phone" />
                      <a href={`tel:${requestDetails.request.member.dial_code2}${requestDetails.request.member.phone2}`}>
                        {requestDetails.request.member.dial_code2} ({requestDetails.request.member.phone2.substring(0, 3)}) {requestDetails.request.member.phone2.substring(3, 6)}-{requestDetails.request.member.phone2.substring(6)}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body p-3">
              <div className="text-end text-muted fs-sm" style={{ fontSize: '0.9em' }}>
                Last updated
                on
                {new Intl.DateTimeFormat('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                }).format(new Date(requestDetails.request.updated_at))}
              </div>
            </div>
          </div>

        </div>
        <div className="col-lg-6">

          <div className="card mb-3">
            <div className="card-body p-3 text-center">
              <div className="row justify-content-center">
                <div className="col-auto">
                  <p className="mb-2">{scheduleLabel}</p>
                  <p className="fw-semibold mb-0">
                    <i className="uil uil-calendar-alt" />
                    {new Date(requestDetails.request.schedule_time).toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body p-3">
              <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Service Request Details</p>
              <div className="table-responsive">
                <table className="table table-borderless mb-0">
                  <tbody><tr className="border-bottom">
                    <th className="border-end">Requested services</th>
                    <td>{requestDetails.request.category_name} &gt; {requestDetails.request.services_name} &gt; {requestDetails.request.description}</td>
                  </tr>
                    <tr className="border-bottom">
                      <th className="border-end">Additional Details</th>
                      <td>{requestDetails.request.description || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th className="border-end">Location</th>
                      <td>{requestDetails.request.city}, {requestDetails.request.state}, {requestDetails.request.zip_code}</td>
                    </tr>
                    <tr className="border-bottom border-top">
                      <th className="border-end">Contact</th>
                      <td>
                        {requestDetails.request.contact_person}<br />
                        <a href={`tel:${requestDetails.request.dial_code}${requestDetails.request.phone}`}>
                          <i className="uil uil-phone" />{requestDetails.request.dial_code} ({requestDetails.request.phone.substring(0, 3)}) {requestDetails.request.phone.substring(3, 6)}-{requestDetails.request.phone.substring(6)}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th className="border-end">Address</th>
                      <td className="p-0">
                        <table className="table table-borderless m-0">
                          <tbody><tr className="border-bottom">
                            <th className="border-end">Address</th>
                            <td>
                              {requestDetails.request.address || 'N/A'}
                              <div className="mt-2">
                                <a href={`https://maps.google.com/?q=${requestDetails.request.city},${requestDetails.request.state}`} target="_blank" className="btn btn-warning rounded-pill btn-sm">
                                  <i className="uil uil-location-arrow" />&nbsp;&nbsp;Get Direction
                                </a>
                              </div>
                            </td>
                          </tr>
                            <tr className="border-bottom">
                              <th className="border-end">Block No</th>
                              <td></td>
                            </tr>
                            <tr className="border-bottom">
                              <th className="border-end">Street</th>
                              <td>{requestDetails.request.address || 'N/A'}</td>
                            </tr>
                            <tr>
                              <th className="border-end">Type</th>
                              <td>Home</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default CompletedRequestDetailsContent;
