import { useState, useEffect } from 'react';
import { partnerService } from '../../services/partnerService/partnerService';
import { authService } from '../../services/generalServices/authService';
import LogoutModal from './LogoutModal';
import DeleteAccountModal from './DeleteAccountModal';
import Swal from 'sweetalert2';

interface SettingsContentProps {
  setActivePage: (page: string) => void;
}

interface Device {
  id: number;
  device_type: string;
  device_type_raw: string;
  device_name: string;
  device_info: string;
  unique_id: string;
  last_used_at: string;
  last_used_at_raw: string;
  is_current_session: boolean;
  session_token: string;
  created_at: string;
}



const SettingsContent: React.FC<SettingsContentProps> = ({ setActivePage }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    deviceId: ''
  });

  // SweetAlert close button styling helpers
  const addSweetAlertStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .swal2-close {
        font-size: 0 !important;
        position: absolute !important;
        top: 0.7rem !important;
        right: 0.7rem !important;
        width: 1.8rem !important;
        height: 1.8rem !important;
        background: rgba(0, 0, 0, 0.08) !important;
        border-radius: 100% !important;
        border: none !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        cursor: pointer !important;
      }
      .swal2-close:before {
        content: "×" !important;
        font-size: 1.2rem !important;
        font-weight: bold !important;
        line-height: 1 !important;
      }
      .swal2-close:hover {
        background: rgba(0, 0, 0, 0.15) !important;
      }
    `;
    document.head.appendChild(style);
    return style;
  };
  const removeSweetAlertStyles = (style: HTMLStyleElement) => {
    if (document.head.contains(style)) {
      document.head.removeChild(style);
    }
  };

  const handleBackToDashboard = () => {
    setActivePage("dashboard");
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await partnerService.getSettingsInfo(5.5); // Using 5.5 as default timezone

        // Check if response has the expected structure
        if (response?.success && response?.data) {

          if (response.data.devices && Array.isArray(response.data.devices)) {
            setDevices(response.data.devices);
          } else {
            setDevices([]);
          }
        } else {
          setDevices([]);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError('Failed to load settings. Please try again.');
        setDevices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`;
    } else if (diffInHours < 48) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };



  const handleSignOut = (deviceId: string) => {
    setModalConfig({
      title: 'Logout Device',
      message: 'Do you want to log out from this device?',
      confirmText: 'Yes, logout it!',
      deviceId
    });
    setIsModalOpen(true);
  };

  const handleSignOutAllDevices = () => {
    setModalConfig({
      title: 'Logout All Devices',
      message: 'Do you want to log out from all other devices?',
      confirmText: 'Yes, logout all!',
      deviceId: 'all'
    });
    setIsModalOpen(true);
  };

  const handleModalConfirm = async () => {
    try {
      // Show loading state
      Swal.fire({
        title: 'Processing Logout...',
        text: 'Please wait while we process your request.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      if (modalConfig.deviceId === 'all') {
        console.log('Logging out all other devices');
        // Call logout all devices API with logout_all: 2
        await authService.logoutDevice(0, true);
      } else {
        console.log(`Logging out device: ${modalConfig.deviceId}`);
        // Call individual device logout API with logout_all: 0
        await authService.logoutDevice(parseInt(modalConfig.deviceId), false);
      }

      // Close loading dialog
      Swal.close();

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Logout Successful!',
        text: modalConfig.deviceId === 'all'
          ? 'Successfully logged out from all other devices.'
          : 'Successfully logged out from the selected device.',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'OK'
      });

      setIsModalOpen(false);

      // Refresh the devices list
      const response = await partnerService.getSettingsInfo(5.5);
      if (response?.success && response?.data?.devices) {
        setDevices(response.data.devices);
      }

    } catch (err) {
      console.error('Logout failed:', err);

      // Close loading dialog
      Swal.close();

      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: err instanceof Error ? err.message : 'Failed to logout. Please try again.',
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Try Again'
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const showDeleteConfirm = async () => {
    const style = addSweetAlertStyles();
    const result = await Swal.fire({
      title: 'Delete Account',
      html: `
        <div class="text-center">
          <p>By proceeding to delete account it will remove your all your account data and cancel requests if you have any.</p>
          <p>Are you sure you want to delete your account?</p>
        </div>
      `,
      imageUrl: '',
      imageWidth: 77,
      imageHeight: 77,
      showCancelButton: false,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#0d6efd',
      buttonsStyling: false,
      customClass: {
        popup: 'swal2-popup swal2-modal swal2-show',
        container: 'swal2-container swal2-center swal2-backdrop-show',
        confirmButton: 'btn btn-primary rounded-pill w-20'
      },
      showCloseButton: true,
      allowOutsideClick: true,
      willClose: () => removeSweetAlertStyles(style)
    });

    if (result.isConfirmed) {
      try {
        // Optional: show loading
        Swal.fire({
          title: 'Deleting account...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        // Call delete API (adjust payload as required by backend)
        await authService.deleteAccount();

        Swal.close();
        await Swal.fire({
          icon: 'success',
          title: 'Account Deleted',
          html: 'Your account has been successfully deleted.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          confirmButtonText: 'OK',
          confirmButtonColor: '#007bff',
          customClass: { confirmButton: 'btn btn-primary rounded-pill w-20' }
        });

        // Optionally redirect
        window.location.href = '/';
      } catch (err) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err instanceof Error ? err.message : 'Failed to delete account. Please try again.',
          confirmButtonColor: '#dc3545'
        });
      }
    } else {
      removeSweetAlertStyles(style);
    }
  };

  if (isLoading) {
    return (
      <div className="card my-account-dashboard">
        <div className="card-header p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
              <i className="uil uil-arrow-left" /> Back
            </button>
            &nbsp;&nbsp;
            <h4 className="card-title mb-0">Settings</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 mb-0">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card my-account-dashboard">
        <div className="card-header p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
              <i className="uil uil-arrow-left" /> Back
            </button>
            &nbsp;&nbsp;
            <h4 className="card-title mb-0">Settings</h4>
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
            <div className="col-xxl-12 col-xl-12 col-md-12">
              {/* Where You're Signed In Section */}
              <div className="card mb-4 border shadow-sm">
                <div className="card-body p-3">
                  <h6 className="mb-3">Devices where You're Signed In</h6>

                  {devices.length === 0 ? (
                    <div className="text-center py-3">
                      <i className="uil uil-desktop text-muted" style={{ fontSize: '2rem' }}></i>
                      <p className="mt-2 mb-0 text-muted">No devices found.</p>
                    </div>
                  ) : (
                    <>
                      {devices.map((device) => (
                        <div key={device.id} className={`d-flex justify-content-between align-items-center mb-2 device-${device.id}`}>
                          <div>
                            <strong>{device.device_name || 'Unknown Device'}</strong><br />
                            <small>{device.device_type} · {formatDate(device.last_used_at_raw)}</small>
                            {device.device_info && (
                              <>
                                <br />
                                <small className="text-muted">{device.device_info}</small>
                              </>
                            )}
                          </div>
                          {device.is_current_session ? (
                            <p className="text-secondary mb-0 fs-14">Current Session</p>
                          ) : (
                            <a
                              href="javascript:void(0);"
                              className="hover bold primary"
                              onClick={() => handleSignOut(device.id.toString())}
                            >
                              Sign Out
                            </a>
                          )}
                        </div>
                      ))}

                      {/* Sign-out options */}
                      {devices.length > 1 && (
                        <div className="text-end mt-4">
                          <button className="btn btn-sm btn-outline-primary" onClick={handleSignOutAllDevices}>
                            Sign out all other devices
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Delete Account Section */}
              <div className="card mb-4 border shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Delete Account</h6>
                      Remove all account data
                    </div>
                    <button type="button" className="btn btn-sm btn-danger rounded-pill btn-login" id="del-account" onClick={showDeleteConfirm}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Logout Modal */}
      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
      />

      {/* Delete Account Modal (not used in new flow, kept for compatibility) */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default SettingsContent; 