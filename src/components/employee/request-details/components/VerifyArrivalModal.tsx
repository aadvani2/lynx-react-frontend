import React, { useState, useEffect } from 'react';
import { employeeService } from '../../../../services/employeeServices/employeeService';
import { addModalCloseIconStyles, modalCloseIconConfigs } from '../../../../utils/modalCloseIcon';
import Swal from 'sweetalert2';

interface VerifyArrivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  onSuccess?: () => void;
}

const VerifyArrivalModal: React.FC<VerifyArrivalModalProps> = ({
  isOpen,
  onClose,
  requestId,
  onSuccess
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Manage modal close icon styles
  useEffect(() => {
    if (isOpen) {
      const cleanup = addModalCloseIconStyles({
        ...modalCloseIconConfigs.default,
        className: 'verify-arrival-modal-close'
      });
      
      return cleanup;
    }
  }, [isOpen]);

  // Handle verification submission
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      return;
    }

    try {
      setIsVerifying(true);
      
      const requestBody = {
        code: verificationCode,
        request_id: requestId
      };

      const response = await employeeService.verifyArrival(requestBody);
      
      // Check if response indicates success
      if (response && response.success === true && !response.message?.toLowerCase().includes('valid code')) {
        // Success - show success modal
        const successMessage = response?.message || 'Verification successful!';
        showSuccessModal(successMessage);
      } else {
        // Server returned error response (either success: false or success: true with error message)
        const errorMessage = response?.message || 'Verification failed. Please try again.';
        showErrorModal(errorMessage);
      }
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify arrival. Please try again.';
      showErrorModal(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // Show error modal using SweetAlert2
  const showErrorModal = (message: string) => {
    Swal.fire({
      title: 'Verification Failed',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc3545',
      customClass: {
        popup: 'rounded-3',
        confirmButton: 'btn rounded-pill btn-danger'
      }
    });
  };

  // Show success modal using SweetAlert2
  const showSuccessModal = (message: string) => {
    Swal.fire({
      title: 'Verification Successful!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#28a745',
      customClass: {
        popup: 'rounded-3',
        confirmButton: 'btn rounded-pill btn-success'
      }
    }).then(() => {
      // Close modal and call success callback after user clicks OK
      handleClose();
      onSuccess?.();
    });
  };

  // Handle modal close
  const handleClose = () => {
    setVerificationCode('');
    setIsVerifying(false);
    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      <div 
        className="modal fade show" 
        style={{ display: 'block' }} 
        tabIndex={-1} 
        role="dialog"
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleVerificationSubmit}>
            <div className="modal-content">
              <div className="modal-header border-0 d-flex align-items-center position-relative">
                <h5 className="modal-title w-100 text-center">Verify your arrival</h5>
                <button 
                  type="button" 
                  className="verify-arrival-modal-close" 
                  onClick={handleClose}
                  aria-label="Close"
                >
                </button>
              </div>
              <div className="modal-body">
                <p>Verify your arrival by entering the verification code provided by the customer.</p>
                <div className="form-floating">
                  <input 
                    type="text" 
                    className="form-control border-0" 
                    placeholder="Enter Code" 
                    id="code" 
                    name="code"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    style={{ border: '1px solid #dee2e6 !important' }}
                    autoFocus
                  />
                  <label htmlFor="code">Verification Code</label>
                </div>
                <input type="hidden" name="request_id" value={requestId} />
              </div>
              <div className="modal-footer">
                <button 
                  type="submit" 
                  className="btn rounded-pill btn-primary"
                  disabled={isVerifying || !verificationCode.trim()}
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default VerifyArrivalModal;
