import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { partnerService } from '../../services/partnerService/partnerService';
import { PartnerRequestCard, RequestsPagination } from './common';
import type { BasePartnerRequest } from './common';
// Removed: import { useEmployeeStore } from '../../store/employeeStore';

interface CompletedRequestsContentProps {
  setActivePage: (page: string) => void;
  employeeId: number | null; // Added prop to receive employeeId
}


interface Category {
  id: number;
  title: string;
  slug: string;
  image?: string;
  description?: string;
  color?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

interface CompletedRequest extends BasePartnerRequest {
  services_name: string;
  category: Category;
  total: number;
  customer: {
    name: string;
  };
}

const CompletedRequestsContent: React.FC<CompletedRequestsContentProps> = ({ setActivePage, employeeId }) => {
  const [completedRequests, setCompletedRequests] = useState<CompletedRequest[]>([]);
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

  const handleBackToDashboard = () => setActivePage('dashboard');

  const handleViewDetails = (requestId: number) => {
    sessionStorage.setItem('selectedRequestId', requestId.toString());
    setActivePage('completed-request-details');
  };

  // Fetch completed requests
  const fetchCompletedRequests = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        employee_id: employeeId, // Use the employeeId from props
        user_timezone: timezoneHours,
        page: page
      };
      
      const response = await partnerService.getCompletedRequests(payload);
      
      // Handle the response based on your API structure
      if (response?.success) {
        const data = response.data; // The actual data is directly under response.data
        setCompletedRequests(data.requests || []);
        setPagination({
          current_page: data.current_page || page,
          total: data.total || 0,
          per_page: data.per_page || 20,
          last_page: data.last_page || 1
        });
      } else {
        setError('Failed to load completed requests. Please try again.');
      }
    } catch (err) {
      console.error('Failed to fetch completed requests:', err);
      setError('Failed to load completed requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [employeeId, timezoneHours]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
      fetchCompletedRequests(page);
    }
  };

  // Fetch completed requests when component mounts or dependencies change
  useEffect(() => {
    fetchCompletedRequests(1);
  }, [fetchCompletedRequests]);

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
          <h4 className="card-title mb-0">Completed Requests</h4>
        </div>
      </div>
      <div className="card-body">
        {loading && (
          <div className="w-100 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading completed requests...</p>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
        
        {!loading && !error && completedRequests.length === 0 && (
          <div className="w-100 text-center">
            <i className="uil uil-cloud-check fs-1 text-muted"></i>
            <p className="mt-2">No completed requests found.</p>
          </div>
        )}
        
        {!loading && !error && completedRequests.length > 0 && (
          <ul className="nav nav-tabs nav-tabs-bg nav-tabs-shadow-lg d-flex justify-content-center nav-justified requests-list">
            {completedRequests.map((request) => (
              <PartnerRequestCard
                key={request.id}
                request={request}
                onClick={handleViewDetails}
                requestType={request.status}
                currentPage={pagination.current_page}
                statusBadgeClass="bg-completed-request"
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
            ariaLabel="Completed requests pagination"
          />
        )}
      </div>
    </div>
  );
};

export default CompletedRequestsContent; 