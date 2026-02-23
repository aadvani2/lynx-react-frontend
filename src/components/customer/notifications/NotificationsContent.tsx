import React, { useEffect } from 'react';
import { useNotificationStore } from '../../../store/notificationStore';
import NotificationCard from './components/NotificationCard';
import type { NotificationItem } from '../../../types/notifications';
import { customerService } from '../../../services/customerServices/customerService';
import NotificationPagination from './components/NotificationPagination';

interface NotificationsContentProps {
  goToRequestDetails: (status: string, requestId: number, currentPage?: number) => void;
  setActivePage: (page: string) => void;
}

const NotificationsContent: React.FC<NotificationsContentProps> = ({
  goToRequestDetails, setActivePage
}) => {
  const { notifications, currentPage, lastPage, fetchNotifications, loading, error, setCurrentPage } = useNotificationStore();

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, fetchNotifications]);


  const openFromNotification = async (notif: NotificationItem) => {
    try {
      const requestId = Number(notif.request_id ?? notif.id); // adjust if your shape differs
      const payload = {
        id: requestId,
        type: "notifications",
        user_timezone: 5.5,
        currentPage: currentPage || 1,
        filter_status: false,
      };

      const response = await customerService.getRequestDetails(payload);

      // Expecting: response.request_status like "on hold" / "in process" / "accepted" / "rejected" ...
      goToRequestDetails(response.request_status, requestId, currentPage || 1);
    } catch (e) {
      console.error(e);
      // Optional: show a toast or inline error.
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading notifications...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">Error: {error}</div>;
  }

  return (
    <div id="loadView">
      <div className="card my-account-dashboard">
        <div className="card-header p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-between">
            <button
              className="btn btn-primary btn-sm rounded-pill"
              onClick={() => setActivePage("dashboard")}
            >
              <i className="uil uil-arrow-left" /> Back
            </button>
            &nbsp;&nbsp;
            <h4 className="card-title mb-0">Notifications</h4>
          </div>
        </div>
        <div className="card-body">

          <div className="row">
            {notifications.length > 0 &&
              notifications.map((item: NotificationItem) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  onOpen={() => openFromNotification(item)}
                />
              ))}
          </div>

          {notifications.length === 0 && (
            <div className="alert alert-info text-center">No notifications to display.</div>
          )}
          
          {lastPage > 1 && (
            <NotificationPagination
              currentPage={currentPage}
              lastPage={lastPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsContent;
