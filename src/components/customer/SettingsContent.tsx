import React, { useEffect, useMemo, useState } from 'react';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import Swal from 'sweetalert2';

interface SettingsContentProps {
  setActivePage: (page: string) => void;
}


const SettingsContent: React.FC<SettingsContentProps> = ({ setActivePage }) => {
  const { isSubmitting, error: deleteError, handleDeleteAccount } = useDeleteAccount();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [timezoneHours]);

  const handleDeleteAccountClick = async () => {
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
      allowOutsideClick: true
    });

    if (result.isConfirmed) {
      await handleDeleteAccount();
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
            <h4 className="card-title mb-0">Settings</h4>
          </div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="text-center py-3">Loading...</div>}

          <div className="row">
            <div className="col-xxl-12 col-xl-12 col-md-12">
              {/* Where You're Signed In Section (kept as-is for now) */}
              <div className="card mb-4 border shadow-sm">
                <div className="card-body p-3">
                  <h6 className="mb-3">Devices where You're Signed In</h6>
                  <div className="d-flex justify-content-between align-items-center mb-2 device-3241">
                    <div>
                      <strong>Chrome on Linux</strong><br />
                      <small>GB · Today at 05:15 AM</small>
                    </div>
                    <p className="text-secondary mb-0 fs-14">Current Session</p>
                  </div>
                </div>
              </div>
              {/* Delete Account Section */}
              <div className="card mb-4 border shadow-sm">
                <div className="card-body p-3">
                  {/* Error Message */}
                  {deleteError && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {deleteError}
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Delete Account</h6>
                      <span className="text-muted">Remove all account data</span>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger rounded-pill btn-login" 
                      id="del-account"
                      onClick={handleDeleteAccountClick}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent; 