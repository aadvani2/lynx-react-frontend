import React, { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../../services/employeeServices/employeeService';
import { RequestList, LoadingSpinner } from './accepted-requests/components';
import type { AcceptedRequestsResponse, InProgressRequestsResponse, CompletedRequestsResponse, CancelledRequestsResponse } from '../../types/employee/requests';

interface RequestsContentProps {
  setActivePage: (page: string) => void;
  onRequestClick: (requestId: number, type: string, page: number) => void;
  requestType: 'accepted' | 'in process' | 'completed' | 'cancelled';
}

const RequestsContent: React.FC<RequestsContentProps> = ({ setActivePage, onRequestClick, requestType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestsData, setRequestsData] = useState<AcceptedRequestsResponse['data'] | InProgressRequestsResponse['data'] | CompletedRequestsResponse['data'] | CancelledRequestsResponse['data'] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch requests
  const fetchRequests = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const requestBody = {
        employee_id: null, // This should come from user context or props
        user_timezone: 5.5, // This should come from user settings or context
        page: page
      };
      
      let response: AcceptedRequestsResponse | InProgressRequestsResponse | CompletedRequestsResponse | CancelledRequestsResponse | undefined;

      switch (requestType) {
        case 'accepted':
          response = await employeeService.getAcceptedRequests(requestBody);
          break;
        case 'in process':
          response = await employeeService.getInProgressRequests(requestBody);
          break;
        case 'completed':
          response = await employeeService.getCompletedRequests(requestBody);
          break;
        case 'cancelled':
          response = await employeeService.getCancelledRequests(requestBody);
          break;
        default:
          throw new Error('Invalid request type');
      }
      
      if (response?.success && response.data) {
        setRequestsData(response.data);
        setCurrentPage(page);
      } else {
        setError(`Failed to fetch ${requestType} requests`);
      }
    } catch (error) {
      console.error(`Error fetching ${requestType} requests:`, error);
      setError(`Failed to fetch ${requestType} requests. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [requestType]);

  useEffect(() => {
    fetchRequests(1);
  }, [requestType, fetchRequests]);

  const openDashboard = () => {
    setActivePage('dashboard');
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (requestsData?.last_page || 1)) {
      fetchRequests(page);
    }
  };

  // Handle request click
  const handleRequestClick = (requestId: number) => {
    onRequestClick(requestId, requestType, currentPage);
  };

  const getTitle = () => {
    switch (requestType) {
      case 'accepted':
        return "Accepted Requests";
      case 'in process':
        return "In-Progress Requests";
      case 'completed':
        return "Completed Requests";
      case 'cancelled':
        return "Cancelled Requests";
      default:
        return "Requests";
    }
  };

  if (isLoading) {
    return <LoadingSpinner onBackClick={openDashboard} />;
  }

  return (
    <div id="loadView">
      <div className="card">
        <div className="card-header p-3 d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-between">
            <a href="javascript:;" className="btn btn-primary btn-sm rounded-pill" onClick={openDashboard}>
              <i className="uil uil-arrow-left"></i>Back
            </a>
            &nbsp;&nbsp;<h4 className="card-title mb-0">{getTitle()}</h4>
          </div>
        </div>
        <div className="card-body">
          {(requestsData && 'requests' in requestsData) && (
            <RequestList
              requests={requestsData.requests}
              currentPage={currentPage}
              lastPage={requestsData.last_page}
              onPageChange={handlePageChange}
              onRequestClick={handleRequestClick}
            />
          )}
          
          {error && (
            <div className="alert alert-danger mt-3" id="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsContent; 