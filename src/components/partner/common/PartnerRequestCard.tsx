import React from 'react';
import type { BasePartnerRequest } from './types';

/**
 * Props for PartnerRequestCard component
 */
export interface PartnerRequestCardProps {
  request: BasePartnerRequest;
  onClick?: (requestId: number) => void;
  requestType?: string;
  currentPage?: number;
  /**
   * Custom status badge text (if different from request.status)
   */
  statusBadgeText?: string;
  /**
   * Custom status badge class (for different background colors)
   */
  statusBadgeClass?: string;
  /**
   * Format function for date display
   */
  formatDate?: (dateString: string) => string;
  /**
   * Custom address formatter
   */
  formatAddress?: (request: BasePartnerRequest) => string;
  /**
   * Additional data attributes
   */
  dataAttributes?: Record<string, string | number>;
}

/**
 * Get default status badge class based on status
 */
const getDefaultStatusBadgeClass = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('pending') || statusLower === 'pending') {
    return 'bg-process-request';
  } else if (statusLower.includes('accepted') || statusLower === 'accepted') {
    return 'bg-accepted-request';
  } else if (statusLower.includes('completed') || statusLower === 'completed') {
    return 'bg-completed-request';
  } else if (statusLower.includes('cancelled') || statusLower === 'cancelled') {
    return 'bg-cancelled-request';
  } else if (statusLower.includes('active communication') || statusLower.includes('on hold')) {
    return 'bg-activecommunication-request';
  } else if (statusLower.includes('in process') || statusLower.includes('in_process')) {
    return 'bg-process-request';
  }
  return 'bg-secondary';
};

/**
 * Default date formatter
 */
const defaultFormatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Default address formatter
 */
const defaultFormatAddress = (request: BasePartnerRequest): string => {
  if (request.city && request.state && request.zip_code) {
    return `(${request.city}, ${request.state}, ${request.zip_code})`;
  }
  return request.address || '';
};

/**
 * Global request card component for Partner request lists
 * Handles the common UI structure shared across all request types
 */
const PartnerRequestCard: React.FC<PartnerRequestCardProps> = ({
  request,
  onClick,
  requestType,
  currentPage = 1,
  statusBadgeText,
  statusBadgeClass,
  formatDate = defaultFormatDate,
  formatAddress = defaultFormatAddress,
  dataAttributes = {}
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick(request.id);
    }
  };

  // Get category title
  const categoryTitle = typeof request.category === 'object' ? request.category.title : request.category;

  // Get customer name
  const customerName = typeof request.customer === 'object' ? request.customer.name : request.customer;

  const serviceName = request.services_name;

  // Get status badge text
  const badgeText = statusBadgeText || request.status;

  // Get status badge class
  const badgeClass = statusBadgeClass || getDefaultStatusBadgeClass(request.status);

  // Get date to display (prefer timestamp, fallback to created_at)
  const dateToDisplay = request.created_at;

  // Get formatted address
  const addressText = formatAddress(request);

  // Build data attributes
  const allDataAttributes = {
    'data-id': request.id,
    'data-type': requestType || request.status,
    'data-currentpage': currentPage,
    ...dataAttributes
  };

  return (
    <li className="nav-item m-0">
      <a
        className="nav-link active requestItem requestItemDash"
        href="javascript:;"
        onClick={handleClick}
        {...Object.fromEntries(
          Object.entries(allDataAttributes).map(([key, value]) => [`${key}`, String(value)])
        )}
      >
        <div className="row align-items-center justify-content-between mb-4 requestItemAddressItem">
          <div className="col">
            <h5 className="mb-1">{categoryTitle}</h5>
            <p>{serviceName}</p>
          </div>
          <div className="col-auto text-center">
            <span className="fw-medium fs-sm mb-2">#{request.request_id}</span>
            <p className="rounded-btn">{request.tag}</p>
          </div>
        </div>

        <div className="row align-items-center justify-content-between gap-1 requestItemAddress">
          <div className="col">
            <p className="">
              <i className="uil uil-user me-2"></i>
              {customerName}
            </p>
            <p>{addressText}</p>
          </div>
          <div className="col-auto text-end">
            <div className={`position-relative badge rounded-pill ${badgeClass} text-primary text-uppercase px-3 py-2`}>
              {badgeText}
            </div>
            <p>
              <small className="text-muted">
                {dateToDisplay ? formatDate(dateToDisplay) : ''}
              </small>
            </p>
          </div>
        </div>
      </a>
    </li>
  );
};

export default PartnerRequestCard;

