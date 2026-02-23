import React from 'react';
import type { Request } from '../../../../types/employee/requests';

interface RequestItemProps {
  request: Request;
  currentPage: number;
  onRequestClick?: (requestId: number) => void;
}

const RequestItem: React.FC<RequestItemProps> = ({ 
  request, 
  currentPage, 
  onRequestClick 
}) => {
  // Helper function to format date
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

  // Helper function to format request ID
  const formatRequestId = (requestId: number) => {
    return `#${requestId}`;
  };

  // Helper function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-accepted-request text-primary';
      case 'in process':
        return 'bg-process-request text-primary';
      case 'completed':
        return 'bg-completed-request text-primary';
      case 'cancelled':
        return 'bg-cancelled-request text-primary';
      default:
        return 'bg-secondary';
    }
  };

  const handleClick = () => {
    if (onRequestClick) {
      onRequestClick(request.id);
    }
  };

  return (
    <li className="nav-item m-0">
      <button 
        className="nav-link active requestItem requestItemDash" 
        data-id={request.id}
        data-type="accepted" 
        data-currentpage={currentPage}
        onClick={handleClick}
      >
        <div className="row align-items-center justify-content-between mb-4 requestItemAddressItem">
          <div className="col text-start">
            <h5 className="mb-1">{request.category.title}</h5>
            <p >{request.services_name}</p>
          </div>
          <div className="col-auto text-center">
            <span className="fw-medium fs-sm mb-2">{formatRequestId(request.request_id)}</span>
            <p className="rounded-btn">{request.service_tier_tag}</p>
          </div>
        </div>

        <div className="row align-items-center justify-content-between gap-1 requestItemAddress">
          <div className="col">
            <p className="text-start">
              <i className="uil uil-user me-2"></i>
              {request.customer.name}
            </p>
            <p>({request.city}, {request.state}, {request.zip_code})</p>
          </div>
          <div className="col-auto text-end">
            <div className={`position-relative badge rounded-pill ${getStatusBadgeClass(request.status)} text-primary text-uppercase px-3 py-2`}>
              {request.status}
            </div>
            <p><small className="text-muted">{formatDate(request.created_at)}</small></p>
          </div>
        </div>
      </button>
    </li>
  );
};

export default RequestItem;
