import React, { useState, useEffect } from 'react';
import { partnerService } from '../../../services/partnerService/partnerService';
import { getModalCloseIconCleanup } from '../../../utils/modalCloseIcon';
import Swal from 'sweetalert2';

interface CancelAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  onCancelSuccess?: () => void;
  setActivePage?: (page: string) => void;
  redirectTo?: string; // Optional: specify where to redirect after successful cancellation
}

const CancelAssignmentModal: React.FC<CancelAssignmentModalProps> = ({
  isOpen,
  onClose,
  requestId,
  onCancelSuccess,
  setActivePage,
  redirectTo
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the custom modal close icon utility
  useEffect(() => {
    const cleanup = getModalCloseIconCleanup(isOpen, {
      className: 'cancel-assignment-close',
      backgroundColor: 'rgba(0, 0, 0, 0.15)'
    });
    
    return cleanup;
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      setError('Please provide a cancellation reason');
      return;
    }

    // Show confirmation modal before calling API
    const result = await Swal.fire({
      imageUrl: '',
      imageWidth: 77,
      imageHeight: 77,
      title: 'Cancel Assignment',
      html: 'Are you sure you want to cancel this assignment? Cancelling will negatively impact your performance metrics.',
      showCancelButton: false,
      showDenyButton: false,
      confirmButtonText: 'Yes, cancel it!',
      customClass: {
        confirmButton: 'swal2-confirm btn btn-primary rounded-pill w-20'
      }
    });

    // Only proceed if user confirmed
    if (result.isConfirmed) {
      setLoading(true);
      setError(null);

      try {
        // Call the cancel assignment API
        const payload = {
          request_id: requestId,
          cancel_reason: cancelReason.trim()
        };
        
        const response = await partnerService.cancelAssignment(payload);
        
        // Check if API call was successful
        if (response?.success) {
          // Show success message with auto timer
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Assignment cancelled successfully!',
            showConfirmButton: false,
            timer: 2000, // Auto close after 2 seconds
            timerProgressBar: true
          }).then(() => {
            // Call success callback if provided (this allows parent to handle navigation)
            if (onCancelSuccess) {
              onCancelSuccess();
            }
            
            // Navigate based on redirectTo prop or setActivePage
            if (setActivePage) {
              if (redirectTo) {
                // Use redirectTo if provided (most flexible)
                setActivePage(redirectTo);
              } else {
                // Fallback: if setActivePage is provided but no redirectTo, use default
                // This maintains backward compatibility
                console.warn('CancelAssignmentModal: setActivePage provided but no redirectTo specified. Navigation skipped.');
              }
            } else if (redirectTo) {
              // If redirectTo is provided but setActivePage is missing, log warning
              console.warn('CancelAssignmentModal: redirectTo provided but setActivePage is missing. Navigation skipped.');
            } 
            
            // Close modal and reset form
            onClose();
            setCancelReason('');
          });
        } else {
          // Handle API error response
          const errorMessage = response?.message || 'Failed to cancel assignment. Please try again.';
          setError(errorMessage);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: errorMessage,
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-danger rounded-pill'
            }
          });
        }
      } catch (error: unknown) {
        console.error('Error canceling assignment:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to cancel assignment. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setCancelReason('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ 
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div 
        className="modal fade show" 
        id="cancelAssignmentModal" 
        tabIndex={-1} 
        aria-labelledby="cancelAssignmentLabel" 
        aria-modal="true" 
        role="dialog" 
        style={{ display: 'block' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="modal-content">
              <div className="modal-header border-0 d-flex align-items-center position-relative">
                <h5 className="modal-title" id="cancelAssignmentLabel">Cancel Assignment</h5>
                <button 
                  type="button" 
                  className="cancel-assignment-close" 
                  onClick={handleClose}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel this job? If you cancel this job, It will negatively affect your performance metrics.</p>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <textarea 
                  name="cancel_reason" 
                  className="form-control" 
                  placeholder="Write cancellation reason" 
                  rows={4}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="modal-footer">
                <button 
                  type="submit" 
                  className="btn rounded-pill btn-danger"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Canceling...
                    </>
                  ) : (
                    'Cancel Assignment'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CancelAssignmentModal;
