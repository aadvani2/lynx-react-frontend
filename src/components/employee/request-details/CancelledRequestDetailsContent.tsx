import React from 'react';
import type { RequestDetailsResponse } from '../../../types/employee/request-details';
import BackendImage from '../../common/BackendImage/BackendImage';
import { RequestHeader } from '../../partner/accepted-request-details';
import LoadingComponent from '../../common/LoadingComponent';

interface CancelledRequestDetailsContentProps {
  onBack: () => void;
  requestDetails: RequestDetailsResponse['data'] | null;
  isLoading: boolean;
  error: string | null;
}

const CancelledRequestDetailsContent: React.FC<CancelledRequestDetailsContentProps> = ({ onBack, requestDetails, isLoading, error }) => {

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
                <u className="text-bold`">Request Type: </u>
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
            </div>
          </div>

        </div>
        <div className="col-lg-6">
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
                  </tbody></table>
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
      </div>
    </div>
  );
};

export default CancelledRequestDetailsContent;
