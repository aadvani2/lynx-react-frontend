import React, { useEffect, useState, useMemo } from 'react';
import { partnerService } from '../../services/partnerService/partnerService';
import { PartnerRequestCard, RequestsPagination } from './common';
import type { BasePartnerRequest } from './common';

interface AcceptedRequestsContentProps {
  setActivePage: (page: string) => void;
  employeeId: number | null; // Added prop to receive employeeId
}

interface AcceptedRequest extends BasePartnerRequest {
  description: string;
  distance: string;
  timestamp: string;
  total: number;
}

const AcceptedRequestsContent: React.FC<AcceptedRequestsContentProps> = ({ setActivePage, employeeId }) => {
  const [acceptedRequests, setAcceptedRequests] = useState<AcceptedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 20,
    last_page: 1
  });

  // Removed selectedEmployeeId as it is now passed via props
  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  const handleBackToDashboard = () => {
    setActivePage("dashboard");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      setPagination(prev => ({ ...prev, current_page: page }));
      // The useEffect will trigger when pagination.current_page changes
    }
  };

  const handleViewDetails = (requestId: number) => {
    // Navigate to accepted request details page
    setActivePage("accepted-request-details");
    // Store the request ID in sessionStorage for the new component to access
    sessionStorage.setItem('selectedRequestId', requestId.toString());
  };



  // Fetch accepted requests when component mounts
  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const payload = {
          employee_id: employeeId, // Use the employeeId from props
          user_timezone: timezoneHours,
          page: pagination.current_page
        };
        
        const response = await partnerService.getAcceptedRequests(payload);
        
        
        // Handle the response based on your API structure
        if (response?.success) {
          const data = response.data; // The actual data is directly under response.data
          setAcceptedRequests(data.requests || []);
          setPagination({
            current_page: data.current_page,
            total: data.total,
            per_page: data.per_page,
            last_page: data.last_page
          });
        } else {
          setError('Failed to load accepted requests. Please try again.');
        }
      } catch (err) {
        console.error('Failed to fetch accepted requests:', err);
        setError('Failed to load accepted requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedRequests();
  }, [employeeId, timezoneHours, pagination.current_page]);

  return (
    <div className="card">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
            <i className="uil uil-arrow-left" /> Back
          </button>
          &nbsp;&nbsp;
          <h4 className="card-title mb-0">Accepted Requests</h4>
        </div>
      </div>
      <div className="card-body">
        {loading && (
          <div className="w-100 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading accepted requests...</p>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
        
        {!loading && !error && acceptedRequests.length === 0 && (
          <div className="w-100 text-center">
            <i className="uil uil-inbox fs-1 text-muted"></i>
            <p className="mt-2">No accepted requests found.</p>
          </div>
        )}
        
        {!loading && !error && acceptedRequests.length > 0 && (
          <ul className="nav nav-tabs nav-tabs-bg nav-tabs-shadow-lg d-flex justify-content-center nav-justified requests-list">
            {acceptedRequests.map((request) => (
              <PartnerRequestCard
                key={request.id}
                request={request}
                onClick={handleViewDetails}
                requestType="accepted"
                currentPage={pagination.current_page}
                statusBadgeClass="bg-accepted-request"
                formatAddress={(req) => `(${req.address})`}
              />
            ))}
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
            ariaLabel="Accepted requests pagination"
          />
        )}

      </div>
    </div>
  );
};

export default AcceptedRequestsContent; 