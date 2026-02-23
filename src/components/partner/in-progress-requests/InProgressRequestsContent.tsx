import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { partnerService } from '../../../services/partnerService/partnerService';
import { PartnerRequestCard, RequestsPagination } from '../common';
import type { BasePartnerRequest } from '../common';
import { LoadingSpinner, EmptyState } from './components';
import type { InProcessRequest } from './types';

interface InProgressRequestsContentProps {
  setActivePage: (page: string) => void;
  onRequestClick?: (requestId: number, requestType: string) => void;
  employeeId: number | null; // Added prop to receive employeeId
}

const InProgressRequestsContent: React.FC<InProgressRequestsContentProps> = ({ setActivePage, onRequestClick, employeeId }) => {
  const [inProcessRequests, setInProcessRequests] = useState<InProcessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 20,
    last_page: 1
  });

  // Removed: const selectedEmployeeId = useEmployeeStore((s) => s.selectedEmployeeId);
  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  const handleBackToDashboard = () => {
    setActivePage("dashboard");
  };

  // Handle request click
  const handleRequestClick = (requestId: number) => {
    if (onRequestClick) {
      onRequestClick(requestId, "in-progress");
    }
  };

  // Fetch in process requests
  const fetchInProcessRequests = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        employee_id: employeeId, // Use the employeeId from props
        user_timezone: timezoneHours,
        page: page
      };

      const response = await partnerService.getInProcessRequests(payload);

      // Handle the response based on your API structure
      if (response?.success) {
        const data = response.data; // The actual data is directly under response.data
        setInProcessRequests(data.requests || []);
        setPagination({
          current_page: data.current_page || page,
          total: data.total || 0,
          per_page: data.per_page || 20,
          last_page: data.last_page || 1
        });
      } else {
        setError('Failed to load in-progress requests. Please try again.');
      }
    } catch (err) {
      console.error('Failed to fetch in process requests:', err);
      setError('Failed to load in-progress requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [employeeId, timezoneHours]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
      fetchInProcessRequests(page);
    }
  };

  // Fetch in process requests when component mounts or dependencies change
  useEffect(() => {
    fetchInProcessRequests(1);
  }, [fetchInProcessRequests]);

  return (
    <div className="col lynx-my_account position-relative overflow-hidden" id="loadView1">
      <div className="loader-main-v2 d-none">
        <span className="loader-v2"> </span>
      </div>
      <div id="loadView">
        <div className="card">
          <div className="card-header p-3 d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
              <a
                href="javascript:;"
                className="btn btn-primary btn-sm rounded-pill"
                onClick={handleBackToDashboard}
              >
                <i className="uil uil-arrow-left"></i>Back
              </a>
              &nbsp;&nbsp;<h4 className="card-title mb-0">In-Progress Requests</h4>
            </div>
          </div>
          <div className="card-body">
            {loading && <LoadingSpinner />}

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            {!loading && !error && inProcessRequests.length === 0 && (
              <EmptyState />
            )}

            {!loading && !error && inProcessRequests.length > 0 && (
              <>
                <ul className="nav nav-tabs nav-tabs-bg nav-tabs-shadow-lg d-flex justify-content-center nav-justified requests-list">
                  {inProcessRequests.map((request) => {
                    // Convert InProcessRequest to BasePartnerRequest format
                    const requestForCard: BasePartnerRequest = {
                      ...request,
                      address: request.address,
                      created_at: request.created_at,
                      timestamp: request.timestamp
                    };

                    return (
                      <PartnerRequestCard
                        key={request.id}
                        request={requestForCard}
                        onClick={handleRequestClick}
                        requestType="in process"
                        currentPage={pagination.current_page}
                        statusBadgeClass="bg-process-request"
                        formatAddress={(req) => `(${req.address})`}
                      />
                    );
                  })}
                </ul>
                <RequestsPagination
                  currentPage={pagination.current_page}
                  lastPage={pagination.last_page}
                  perPage={pagination.per_page}
                  total={pagination.total}
                  onPageChange={handlePageChange}
                  ariaLabel="In-progress requests pagination"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InProgressRequestsContent; 