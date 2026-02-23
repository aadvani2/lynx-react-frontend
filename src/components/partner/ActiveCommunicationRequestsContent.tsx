import React, { useEffect, useState, useCallback } from 'react';
import { partnerService } from '../../services/partnerService/partnerService';
import { PartnerRequestCard, RequestsPagination } from './common';
import type { BasePartnerRequest } from './common';

interface ActiveCommunicationRequestsContentProps {
  setActivePage: (page: string) => void;
  onViewDetails: (requestId: number, requestType: string) => void; // New prop for viewing details
}

interface Category {
  id: number;
  title: string;
}

export interface ActiveCommunicationRequest extends BasePartnerRequest {
  category: Category;
  category_name: Category;
  services_name: string;
  description: string;
  distance: string;
  city: string;
  state: string;
  zip_code: string;
  timestamp: string;
  customer: Customer;
  total: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  dial_code: string;
  country_code: string;
}

const ActiveCommunicationRequestsContent: React.FC<ActiveCommunicationRequestsContentProps> = ({ setActivePage, onViewDetails }) => {
  const [activeCommunicationRequests, setActiveCommunicationRequests] = useState<ActiveCommunicationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 20,
    last_page: 1
  });

  const handleBackToDashboard = () => {
    setActivePage("dashboard");
  };


  // Format address for display
  const formatAddress = (request: BasePartnerRequest) => {
    const req = request as ActiveCommunicationRequest;
    return `(${req.city}, ${req.state}, ${req.zip_code})`;
  };

  const fetchActiveCommunicationRequests = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        employee_id: null,
        user_timezone: 5.5, // You might want to get this from user context or settings
        page: page
      };

      const response = await partnerService.getOnHoldRequests(payload);

      // Handle the response based on your API structure
      if (response?.success) {
        const data = response.data; // The actual data is directly under response.data
        setActiveCommunicationRequests(data.requests || []);
        setPagination({
          current_page: data.current_page || page,
          total: data.total || 0,
          per_page: data.per_page || 20,
          last_page: data.last_page || 1
        });
      } else {
        console.log('API response success is false:', response); // Debug log
        setError('Failed to load active communication requests. Please try again.');
      }
    } catch (err) {
      console.error('Failed to fetch active communication requests:', err);
      setError('Failed to load active communication requests. Please try again.');
    } finally {
      setLoading(false);
      console.log('API call completed, loading set to false'); // Debug log
    }
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page && page !== pagination.current_page) {
      fetchActiveCommunicationRequests(page);
    }
  };

  // Fetch active communication requests when component mounts
  useEffect(() => {
    fetchActiveCommunicationRequests(1);
  }, [fetchActiveCommunicationRequests]);

  return (
    <div className="card">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-primary btn-sm rounded-pill"
            onClick={handleBackToDashboard}
          >
            <i className="uil uil-arrow-left" /> Back
          </button>
          &nbsp;&nbsp;
          <h4 className="card-title mb-0">Active Communication Requests</h4>
        </div>
      </div>
      <div className="card-body">

        {loading && (
          <div className="w-100 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading active communication requests...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && activeCommunicationRequests.length === 0 && (
          <div className="w-100 text-center">
            <i className="uil uil-comments fs-1 text-muted"></i>
            <p className="mt-2">No active communication requests found.</p>
          </div>
        )}

        {!loading && !error && activeCommunicationRequests.length > 0 && (
          <ul className="nav nav-tabs nav-tabs-bg nav-tabs-shadow-lg d-flex justify-content-center nav-justified requests-list">
            {activeCommunicationRequests.map((request) => (
              <PartnerRequestCard
                key={request.id}
                request={request}
                onClick={(id) => onViewDetails(id, "on-hold")}
                requestType="on hold"
                currentPage={pagination.current_page}
                statusBadgeText="Active Communication"
                statusBadgeClass="bg-activecommunication-request"
                formatAddress={formatAddress}
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
            ariaLabel="Active communication requests pagination"
          />
        )}
      </div>
    </div>
  );
};

export default ActiveCommunicationRequestsContent; 