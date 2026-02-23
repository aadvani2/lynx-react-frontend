import React from 'react';
import type { RequestDetailsData } from '../../../store/requestDetailsStore';

interface ServiceProviderInfoProps {
  requestDetails: RequestDetailsData | null;
}

const ServiceProviderInfo: React.FC<ServiceProviderInfoProps> = ({ requestDetails }) => {
  // Don't render if no provider assigned
  if (!requestDetails?.data?.request?.provider_id) {
    return null;
  }

  return (
    <>
      <hr className="mt-2 mb-2" />
      <div className="d-flex align-items-center flex-md-nowrap flex-wrap gap-2">
        <div className="d-flex align-items-center">
          <img 
            src="" 
            className="img-fluid rounded-circle rdtl-emp-img object-fit-cover" 
            alt="Employee" 
          />
          <div className="ms-3">
            <div className="fw-semibold">Service Provider</div>
            <div className="text-body fs-sm">Provider ID: {requestDetails.data.request.provider_id}</div>
            <div className="text-body fs-sm">
              <i className="uil uil-phone" />
              <a href={`tel:${requestDetails.data.request.dial_code}${requestDetails.data.request.phone}`}>
                {requestDetails.data.request.dial_code} {requestDetails.data.request.phone}
              </a>
            </div>
          </div>
        </div>
        <div className="d-flex ms-auto">
          <button className="btn btn-sm btn-primary rounded-pill d-flex m-auto gap-2 mt-3 mb-3">
            Chat<i className="uil uil-comment-alt-lines" style={{fontSize: 15}} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ServiceProviderInfo;
