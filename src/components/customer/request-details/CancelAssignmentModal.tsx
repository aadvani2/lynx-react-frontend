import React, { useState, useEffect } from 'react';
import { addModalCloseIconStyles } from '../../../utils/modalCloseIcon';
import { customerService } from '../../../services/customerServices/customerService';
import Swal from 'sweetalert2';

interface CancelAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cancelReason: string) => void;
  requestId: number;
}

const CancelAssignmentModal: React.FC<CancelAssignmentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  requestId
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState<string | null>(null); // State for validation errors

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!cancelReason.trim()) {
      setError('Please provide a cancellation reason.');
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please provide a cancellation reason.',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (!requestId || requestId <= 0) {
      setError('Invalid Request ID. Please try again.');
      Swal.fire({
        title: 'Validation Error!',
        text: 'Invalid Request ID. Please try again.',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    
    // Show SweetAlert modal
    Swal.fire({
      title: 'Cancel Assignment',
      html: 'Are you sure you want to cancel this assignment?',
      imageUrl: '',
      imageWidth: 77,
      imageHeight: 77,
      showCancelButton: false,
      showDenyButton: false,
      confirmButtonText: 'Yes, cancel it!',
      confirmButtonColor: '#007bff',
      customClass: {
        confirmButton: 'btn btn-primary rounded-pill w-20'
      },
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try {
          // Show loading state
          Swal.fire({
            title: 'Processing...',
            text: 'Cancelling your request',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          
          // Make API call to cancel request using service
          await customerService.cancelRequest({
            cancel_reason: cancelReason,
            request_id: requestId
          });


          // Close loading modal first
          Swal.close();

          // Success
          Swal.fire({
            title: 'Success!',
            text: 'Your request has been cancelled successfully.',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            // Call the original onConfirm with the cancel reason AFTER API success
            onConfirm(cancelReason);
            setCancelReason('');
            // Close the modal
            onClose();
          });
        } catch (error) {
          console.error('Cancel request error:', error);
          
          // Close loading modal first
          Swal.close();
          
          Swal.fire({
            title: 'Error!',
            text: error instanceof Error ? error.message : 'Failed to cancel request. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
          });
        }
      } else {
        console.log('❌ User cancelled the confirmation');
      }
    });
  };

  const handleClose = () => {
    setCancelReason('');
    onClose();
  };

  // Add modal close icon styles when modal opens
  useEffect(() => {
    if (isOpen) {
      const cleanup = addModalCloseIconStyles({
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        hoverBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        size: 1.8,
        fontSize: 1.2,
        top: '0.7rem',
        right: '0.7rem'
      });
      
      return cleanup; // Cleanup function
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1040
        }}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="modal fade show" 
        id="cancelAssignmentModal" 
        tabIndex={-1} 
        aria-labelledby="cancelAssignmentLabel" 
        aria-modal="true" 
        role="dialog" 
        style={{ 
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1050
        }}
      >
      <div className="modal-dialog modal-dialog-centered">
        <form onSubmit={handleSubmit}>
          <div className="modal-content position-relative">
            {/* Custom Close Icon */}
            <button 
              type="button" 
              className="custom-modal-close" 
              aria-label="Close" 
              onClick={handleClose}
            ></button>
            
            <div className="modal-header border-0 d-flex align-item-center">
              <h5 className="modal-title" id="cancelAssignmentLabel">Cancel Assignment</h5>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel this service request? Your payment will not be refunded.</p>
              {error && ( // Display error message if present
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
                required // Added required attribute
              />
              <input type="hidden" name="request_id" value={requestId} />
            </div>
            <div className="modal-footer">
              <button 
                type="submit" 
                className="btn rounded-pill btn-danger"
              >
                Cancel Assignment
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
