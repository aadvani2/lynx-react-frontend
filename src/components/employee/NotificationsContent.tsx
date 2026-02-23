import React, { useState, useEffect } from 'react';
import { employeeService } from '../../services/employeeServices/employeeService';

interface NotificationsContentProps {
    setActivePage: (page: string) => void;
}

interface Notification {
    id: number;
    message: string;
    created_at: string;
    // Add other properties if available in the API response
}

const NotificationsContent: React.FC<NotificationsContentProps> = ({ setActivePage }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchNotifications = async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await employeeService.getNotifications(page);
            if (response.success) {
                setNotifications(response.data.notifications || []);
                setCurrentPage(response.data.current_page || 1);
                setLastPage(response.data.last_page || 1);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Helper functions
    const getNotificationIcon = (message: string): string => {
        if (message.includes('assigned')) return 'uil uil-user-check';
        if (message.includes('cancelled')) return 'uil uil-times-circle';
        if (message.includes('completed')) return 'uil uil-check-circle';
        return 'uil uil-bell';
    };

    const getNotificationBadge = (message: string): string => {
        if (message.includes('assigned')) return 'bg-success';
        if (message.includes('cancelled')) return 'bg-danger';
        if (message.includes('completed')) return 'bg-primary';
        return 'bg-info';
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

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
                        <h4 className="card-title mb-0">Employee Notifications</h4>
                    </div>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center">
                            <p className="m-0">Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center">
                            <p className="m-0">No new notifications.</p>
                        </div>
                    ) : (
                        <div className="row">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    className="col-12 mb-3"
                                >
                                    <div className="notification-item p-3 border rounded bg-white"
                                        style={{ 
                                            borderLeft: '4px solid #007bff',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div className="d-flex align-items-start">
                                            <div className="me-3">
                                                <i className={`${getNotificationIcon(notification.message)}`} style={{ fontSize: '1.5rem' }}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <h6 className="mb-0 fw-bold">Request Update</h6>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className={`badge ${getNotificationBadge(notification.message)}`}>
                                                            {notification.message.includes('assigned') ? 'Assignment' : 
                                                             notification.message.includes('cancelled') ? 'Cancellation' :
                                                             notification.message.includes('completed') ? 'Completion' : 'Update'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="mb-2 text-muted">{notification.message}</p>
                                                <small className="text-muted">
                                                    <i className="uil uil-clock me-1"></i>
                                                    {formatDate(notification.created_at)}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {lastPage > 1 && (
                        <div className="mt-4 pt-3 border-top">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="text-muted">
                                    Page {currentPage} of {lastPage}
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        disabled={currentPage === 1}
                                        onClick={() => fetchNotifications(currentPage - 1)}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        disabled={currentPage === lastPage}
                                        onClick={() => fetchNotifications(currentPage + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsContent;
