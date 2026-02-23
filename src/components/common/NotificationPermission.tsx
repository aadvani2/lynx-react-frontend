import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationPermissionProps {
  userType: 'customer' | 'provider' | 'employee';
  onPermissionGranted?: () => void;
}

const NotificationPermission: React.FC<NotificationPermissionProps> = ({
  userType,
  onPermissionGranted
}) => {
  const { permissionStatus, isLoading, requestPermission, error } = useNotifications();
  const [showPrompt, setShowPrompt] = useState(false);

  const handleRequestPermission = async () => {
    try {
      const granted = await requestPermission();
      if (granted) {
        setShowPrompt(false);
        onPermissionGranted?.();
      }
    } catch (err) {
      console.error('Failed to request permission:', err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Show permission prompt if not granted and not denied
  React.useEffect(() => {
    if (permissionStatus === 'default' && !showPrompt) {
      setShowPrompt(true);
    }
  }, [permissionStatus, showPrompt]);

  if (permissionStatus === 'granted') {
    return null; // Don't show anything if permission is already granted
  }

  if (permissionStatus === 'denied') {
    return (
      <div className="alert alert-warning" role="alert">
        <div className="d-flex align-items-center">
          <i className="uil uil-bell-slash me-2"></i>
          <div>
            <strong>Notifications Disabled</strong>
            <p className="mb-0">
              You have disabled notifications. To receive important updates about your requests, 
              please enable notifications in your browser settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              <i className="uil uil-bell text-primary me-2"></i>
              Enable Notifications
            </h5>
          </div>
          <div className="modal-body">
            <div className="text-center mb-4">
              <i className="uil uil-bell-slash text-muted" style={{ fontSize: '3rem' }}></i>
            </div>
            <h6 className="text-center mb-3">Stay Updated with Real-time Notifications</h6>
            <p className="text-muted text-center mb-4">
              Get instant notifications about:
            </p>
            <ul className="list-unstyled text-muted">
              {userType === 'customer' ? (
                <>
                  <li><i className="uil uil-check text-success me-2"></i>Request acceptance by providers</li>
                  <li><i className="uil uil-check text-success me-2"></i>Service completion updates</li>
                  <li><i className="uil uil-check text-success me-2"></i>Payment confirmations</li>
                  <li><i className="uil uil-check text-success me-2"></i>SMS notifications for all request steps</li>
                  <li><i className="uil uil-check text-success me-2"></i>Important announcements</li>
                </>
              ) : userType === 'employee' ? (
                <>
                  <li><i className="uil uil-check text-success me-2"></i>New request assignments</li>
                  <li><i className="uil uil-check text-success me-2"></i>Request cancellation updates</li>
                  <li><i className="uil uil-check text-success me-2"></i>Status change notifications</li>
                  <li><i className="uil uil-check text-success me-2"></i>SMS notifications for all request steps</li>
                  <li><i className="uil uil-check text-success me-2"></i>Important announcements</li>
                </>
              ) : (
                <>
                  <li><i className="uil uil-check text-success me-2"></i>New service requests</li>
                  <li><i className="uil uil-check text-success me-2"></i>Request status changes</li>
                  <li><i className="uil uil-check text-success me-2"></i>Payment notifications</li>
                  <li><i className="uil uil-check text-success me-2"></i>SMS notifications for all request steps</li>
                  <li><i className="uil uil-check text-success me-2"></i>System updates</li>
                </>
              )}
            </ul>
            {error && (
              <div className="alert alert-danger" role="alert">
                <small>{error}</small>
              </div>
            )}
          </div>
          <div className="modal-footer border-0 justify-content-center">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={handleDismiss}
              disabled={isLoading}
            >
              Not Now
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRequestPermission}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Enabling...
                </>
              ) : (
                <>
                  <i className="uil uil-bell me-2"></i>
                  Enable Notifications
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermission;

