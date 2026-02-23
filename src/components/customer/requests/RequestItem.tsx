import React from 'react';
import type { RequestItem as RequestItemType } from '../../../store/requestsStore';
import { getStatusBadgeClass, getServiceName } from '../../../utils/requestsUtils';
import { HiOutlineLocationMarker } from "react-icons/hi";

interface RequestItemProps {
  request: RequestItemType;
  onRequestClick: (request: RequestItemType) => void; // Update prop type
}

const RequestItem: React.FC<RequestItemProps> = ({ request, onRequestClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getLocationLabel = () => {
    const city = request.city?.trim();
    const state = request.state?.trim();
    const zip = request.zip_code?.trim();
    const primary = [city, state].filter(Boolean).join(', ');
    if (primary && zip) return `${primary} ${zip}`;
    if (primary) return primary;
    if (zip) return zip;
    const fallback = (request.full_address || request.address || '').trim();
    return fallback || 'Location unavailable';
  };

  return (
    <li className="nav-item m-0">
      <a
        className="nav-link active p-3 d-block border rounded-3"
        href="javascript:;"
        data-id={request.id}
        data-type="all"
        data-req-no={request.request_id}
        onClick={(e) => {
          e.preventDefault();
          onRequestClick(request);
        }}
      >
        <div className="d-flex flex-column gap-1">

          {/* TOP ROW: Title + Service / #ID + Scheduled pill */}
          <div className="d-flex justify-content-between align-items-start gap-2">
            {/* Left: Category + Service name */}
            <div>
              <h6 className="mb-0 fw-semibold">
                {request.category.title}
              </h6>
              <small className="text-muted">
                {getServiceName(request?.service?.title)}
              </small>
            </div>

            {/* Right: #ID + Scheduled pill */}
            <div className="text-end">
              <div className="small ">
                #{request.request_id}
              </div>
              <span className="badge rounded-pill border border-primary text-primary text-uppercase small">
                {request.service_tier_tag}
              </span>
            </div>
          </div>
          <div className="border-bottom pb-2 mb-2"></div>

          {/* BOTTOM ROW: Location + Date / ON HOLD pill */}
          <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mt-1">
            {/* Left: Location + Date */}
            <div className="d-flex flex-column flex-grow-1">
              <div className="d-flex align-items-center text-truncate">
                <HiOutlineLocationMarker className="me-1" size={20} />
                <span className="text-truncate">
                  {getLocationLabel()}
                </span>
              </div>
              <small className="text-muted">
                {formatDate(request.created_at)}
              </small>
            </div>

            {/* Right: ON HOLD pill (using service_tier_tag here) */}
            <div className="mt-2 mt-sm-0">
              <span className={`badge rounded-pill ${getStatusBadgeClass(request.status)} text-primary text-uppercase px-3 py-2`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </a>
    </li>
  );

};

export default RequestItem; 
