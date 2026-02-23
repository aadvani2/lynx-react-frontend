import React, { useState, useEffect } from 'react';
import { api } from '../../services/api/api';
import { PARTNER_ENDPOINTS } from '../../services/apiEndpoints/partner';
import { RequestsPagination } from './common';
import { partnerService } from '../../services/partnerService/partnerService';

interface NotificationsContentProps {
  setActivePage: (page: string) => void;
  goToRequestDetails?: (status: string, requestId: number, currentPage?: number) => void;
}

interface Notification {
  id: number;
  user_id: number;
  user_type: string;
  is_general: number;
  request_id: number | null;
  message: string;
  created_at: string;
  updated_at: string;
  title?: string; // Optional, may not be in API response
  type?: string; // Optional, may not be in API response
  is_read?: boolean; // Optional, may not be in API response
}

interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

const NotificationsContent: React.FC<NotificationsContentProps> = ({ 
  setActivePage,
  goToRequestDetails 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 0
  });

  const handleBackToDashboard = () => {
    setActivePage("dashboard");
  };

  const fetchNotifications = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query string with pagination
      const timezone = 5.5;
      const queryParams = page > 1
        ? `?user_timezone=${timezone}&page=${page}`
        : `?user_timezone=${timezone}`;

      const response = await api.get(`${PARTNER_ENDPOINTS.PROFESSIONAL_NOTIFICATIONS}${queryParams}`);

      // api.get() returns the JSON response directly, not an axios response
      const data = response as NotificationsResponse;

      if (data?.success && data?.data?.notifications) {
        setNotifications(data.data.notifications);
        setPagination({
          current_page: data.data.current_page,
          total: data.data.total,
          per_page: data.data.per_page,
          last_page: data.data.last_page
        });
      } else {
        console.log('No valid data found, setting empty state');
        setNotifications([]);
        setPagination({
          current_page: 1,
          total: 0,
          per_page: 10,
          last_page: 0
        });
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications. Please try again.');
      setNotifications([]);
      setPagination({
        current_page: 1,
        total: 0,
        per_page: 10,
        last_page: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePagination = (page: number) => {
    if (page < 1 || page > pagination.last_page || page === pagination.current_page) {
      return;
    }
    fetchNotifications(page);
  };

  const openFromNotification = async (notification: Notification) => {
    try {
      const requestId = Number(notification.request_id ?? notification.id);
      
      if (!requestId || requestId === 0) {
        console.warn('No valid request ID found in notification');
        return;
      }

      const payload = {
        id: requestId,
        type: "notifications",
        user_timezone: 5.5,
        currentPage: pagination.current_page || 1,
      };

      const response = await partnerService.getRequestDetails(payload);

      // Expecting: response.request_status like "on hold" / "in process" / "accepted" / "rejected" ...
      if (response?.request_status && goToRequestDetails) {
      console.log("if block");
        goToRequestDetails(response.request_status, requestId, pagination.current_page || 1);
      } else if (response?.request_status) {
        console.log("else if block");
        // Fallback: use handleRequestSelection pattern if goToRequestDetails is not provided
        const requestType = response.request_status.toLowerCase().replace(' ', '-');
        sessionStorage.setItem('selectedRequestId', requestId.toString());
        
        // Navigate to different pages based on request type
        if (requestType === "accepted") {
          setActivePage("accepted-request-details");
        } else if (requestType === "in-progress" || requestType === "in process") {
          setActivePage("in-progress-request-details");
        } else if (requestType === "completed") {
          setActivePage("completed-request-details");
        } else if (requestType === "on-hold" || requestType === "on hold") {
          setActivePage("on-hold-request-details");
        } else {
          setActivePage("request-details");
        }
      }
    } catch (e) {
      console.error('Error opening notification:', e);
      // Optional: show a toast or inline error
    }
  };

  if (isLoading) {
    return (
      <div className="card my-account-dashboard">
        <div className="card-header p-3 d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
              <i className="uil uil-arrow-left" /> Back
            </button>
            &nbsp;&nbsp;
            <h4 className="card-title mb-0">Notifications</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 mb-0">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card my-account-dashboard">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
            <i className="uil uil-arrow-left" /> Back
          </button>
          &nbsp;&nbsp;
          <h4 className="card-title mb-0">Notifications</h4>
        </div>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="uil uil-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        <div className="row">
          {notifications.length === 0 && !error ? (
            <div className="col-12 text-center">
              <div className="py-4">
                <i className="uil uil-bell-slash text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3 mb-0 text-muted">No notifications found.</p>
                <small className="text-muted">You're all caught up!</small>
              </div>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div key={notification.id} className="col-12 col-md-12 col-lg-12 col-xl-6 d-flex">
                  <a
                    href="javascript:void(0)"
                    className="card lift requestItem notification-list w-100"
                    onClick={(e) => {
                      e.preventDefault();
                      openFromNotification(notification);
                    }}
                    role="button"
                    tabIndex={0}
                    data-id={notification.id}
                    data-type="notifications"
                    data-currentpage={pagination.current_page}
                  >
                    <div className="card-body p-3">
                      <p className="mb-1">{notification.message}</p>
                      <p className="fs-sm text-secondary mb-0">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </>
          )}

          {/* Pagination */}
          {!isLoading && !error && (
            <RequestsPagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              perPage={pagination.per_page}
              total={pagination.total}
              onPageChange={handlePagination}
              ariaLabel="Notifications pagination"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsContent; 