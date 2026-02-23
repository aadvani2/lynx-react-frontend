import React, { useState, useEffect } from 'react';
import { partnerService } from '../../../services/partnerService/partnerService';
import { getModalCloseIconCleanup } from '../../../utils/modalCloseIcon';
import Swal from 'sweetalert2';

interface VerifyArrivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  onVerifySuccess?: () => void;
}

const VerifyArrivalModal: React.FC<VerifyArrivalModalProps> = ({
  isOpen,
  onClose,
  requestId,
  onVerifySuccess
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the custom modal close icon utility
  useEffect(() => {
    const cleanup = getModalCloseIconCleanup(isOpen, {
      className: 'verify-arrival-close',
      backgroundColor: 'rgba(0, 0, 0, 0.15)'
    });
    
    return cleanup;
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the verify arrival API
      const payload = {
        code: code.trim(),
        request_id: requestId
      };
      
      const response = await partnerService.verifyArrival(payload);
      
      if (response.success) {
        // Call success callback if provided
        if (onVerifySuccess) {
          onVerifySuccess();
        }
        Swal.fire({
            icon: 'success',
            title: 'Arrival Verified!',
            text: response.message || 'Employee arrival has been successfully verified.',
            timer: 2000,
            showConfirmButton: false
        });
        // Close modal and reset form
        onClose();
        setCode('');
      } else {
        // Display error message from API response
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.message || 'Failed to verify arrival. Please try again.',
            confirmButtonText: 'OK'
        });
        setError(response.message || 'Failed to verify arrival. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error verifying arrival:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: errorMessage,
          confirmButtonText: 'OK'
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
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
        id="verifyArrivalModal" 
        tabIndex={-1} 
        aria-labelledby="verifyArrivalLabel" 
        aria-modal="true" 
        role="dialog" 
        style={{ display: 'block' }}
      >
        <div className="modal-dialog modal-dialog-centered">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="modal-content">
            <div className="modal-header border-0 d-flex align-item-center position-relative">
              <h5 className="modal-title w-100 text-center">Verify your arrival</h5>
              <button 
                type="button" 
                className="verify-arrival-close" 
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Verify your arrival by entering the verification code provided by the customer.</p>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <div className="form-floating">
                <input 
                  type="text" 
                  className="form-control border-0" 
                  placeholder="Enter Code" 
                  id="code" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  disabled={loading}
                />
                <label htmlFor="code">Verification Code</label>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="submit" 
                className="btn rounded-pill btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify'
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

export default VerifyArrivalModal;
