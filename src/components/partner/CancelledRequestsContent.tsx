import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { partnerService } from '../../services/partnerService/partnerService';
import { PartnerRequestCard, RequestsPagination } from './common';
import type { BasePartnerRequest } from './common';
// Removed: import { useEmployeeStore } from '../../store/employeeStore';

interface CancelledRequestsContentProps {
  setActivePage: (page: string) => void;
  employeeId: number | null; // Added prop to receive employeeId
}

interface Category {
  id: number;
  title: string;
}

interface CancelledRequest {
  timestamp?: string | ((timestamp: unknown) => React.ReactNode);
  tag: string;
  id: number;
  request_id: number;
  user_id: number;
  provider_id: number;
  service_tier_tag: string;
  service_tier_id: number;
  duration: number;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zip_code: string;
  contact_person: string;
  cat_id: number;
  service_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  accepted_time: string;
  cancelled_time: string;
  cancellation_reason: string;
  payment_status: string;
  show_timer: number;
  category: Category;
  services_name: string;
  address: string;
  customer?: { name: string } | string;
}

const CancelledRequestsContent: React.FC<CancelledRequestsContentProps> = ({ setActivePage, employeeId }) => {
  const [cancelledRequests, setCancelledRequests] = useState<CancelledRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 20,
    last_page: 1
  });

  // const selectedEmployeeId = useEmployeeStore((s) => s.selectedEmployeeId); // Removed
  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  const handleBackToDashboard = () => setActivePage('dashboard');

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format address for display
  const formatAddress = (request: BasePartnerRequest) => {
    const req = request as unknown as CancelledRequest;
    return `(${req.city}, ${req.state}, ${req.zip_code})`;
  };

  const handleViewDetails = (requestId: number) => {
    // Find the actual request to get request_id
    const request = cancelledRequests.find(r => r.id === requestId);
    const actualRequestId = request?.id || requestId;
    
    // Set both sessionStorage keys for compatibility
    sessionStorage.setItem('selectedRequestId', actualRequestId.toString());
    sessionStorage.setItem('selectedCancelledRequestId', actualRequestId.toString());
    setActivePage("cancelled-request-details");
  };

  // Fetch cancelled requests
  const fetchCancelledRequests = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        employee_id: employeeId, // Use the employeeId from props
        user_timezone: timezoneHours,
        page: page
      };

      const response = await partnerService.getCancelledRequests(payload);

      // Handle the response based on your API structure
      if (response?.success) {
        const data = response.data; // The actual data is directly under response.data
        setCancelledRequests(data.requests || []);
        setPagination({
          current_page: data.current_page || page,
          total: data.total || 0,
          per_page: data.per_page || 20,
          last_page: data.last_page || 1
        });
      } else {
        setError('Failed to load cancelled requests. Please try again.');
      }
    } catch (err) {
      console.error('Failed to fetch cancelled requests:', err);
      setError('Failed to load cancelled requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [employeeId, timezoneHours]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
      fetchCancelledRequests(page);
    }
  };

  // Fetch cancelled requests when component mounts or dependencies change
  useEffect(() => {
    fetchCancelledRequests(1);
  }, [fetchCancelledRequests]);

  return (
    <div className="card">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <button
            className="btn btn-primary btn-sm rounded-pill"
            onClick={handleBackToDashboard}
          >
            <i className="uil uil-arrow-left" /> Back
          </button>
          &nbsp;&nbsp;
          <h4 className="card-title mb-0">Cancelled Requests</h4>
        </div>
      </div>
      <div className="card-body">
        {loading && (
          <div className="w-100 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading cancelled requests...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && cancelledRequests.length === 0 && (
          <div className="w-100 text-center">
            <i className="uil uil-plus-circle fs-1 text-muted"></i>
            <p className="mt-2">No cancelled requests found.</p>
          </div>
        )}

        {!loading && !error && cancelledRequests.length > 0 && (
          <ul className="nav nav-tabs nav-tabs-bg nav-tabs-shadow-lg d-flex justify-content-center nav-justified requests-list">
            {cancelledRequests.map((request) => {
              // Handle timestamp which might be a function or string
              const timestampValue = typeof request.timestamp === 'function' 
                ? request.created_at 
                : (request.timestamp || request.created_at);
              
              // Create a request object compatible with BasePartnerRequest
              const requestForCard: BasePartnerRequest = {
                ...request,
                customer: request.contact_person || (typeof request.customer === 'object' ? request.customer.name : request.customer || ''),
                timestamp: timestampValue
              };

              return (
                <PartnerRequestCard
                  key={request.id}
                  request={requestForCard}
                  onClick={handleViewDetails}
                  requestType="cancelled"
                  currentPage={pagination.current_page}
                  statusBadgeText="Cancelled"
                  statusBadgeClass="bg-cancelled-request"
                  formatDate={formatDate}
                  formatAddress={formatAddress}
                />
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <RequestsPagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            perPage={pagination.per_page}
            total={pagination.total}
            onPageChange={handlePageChange}
            ariaLabel="Cancelled requests pagination"
          />
        )}

      </div>
    </div>
  );
};

export default CancelledRequestsContent; 