import React from 'react';
import PrivacyPolicyContent from '../../../public/PrivacyPolicy/PrivacyPolicyContent';

interface PrivacyPolicyModalProps {
  show: boolean;
  onAccept: (e?: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isAccepting?: boolean;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ show, onAccept, isAccepting = false }) => {
  if (!show) return null;

  return (
    <>
      {/* Inject CSS to ensure modal is scrollable - overrides global rules */}
      <style>{`
        #modal-privacy-policy.modal .modal-dialog-scrollable .modal-content {
          max-height: 100% !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
        }
        #modal-privacy-policy.modal .modal-dialog-scrollable .modal-body {
          overflow-y: auto !important;
          flex: 1 1 auto !important;
          min-height: 0 !important;
        }
      `}</style>

      {/* Backdrop overlay with blur effect */}
      <div 
        className="modal-backdrop fade show" 
        style={{ 
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}
      />

      <div className="modal fade show" id="modal-privacy-policy" tabIndex={-1} data-bs-backdrop="static" data-bs-keyboard="false"
        aria-modal="true" role="dialog" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div 
            className="modal-content"
            style={{
              maxHeight: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="modal-header d-flex align-items-center">
              <h4 className="mb-0 text-start" id="policyTitle">Privacy Policy</h4>
            </div>
            <div 
              className="modal-body" 
              id="policyContent"
              style={{
                overflowY: 'auto',
                flex: '1 1 auto',
                minHeight: 0
              }}
            >
              <PrivacyPolicyContent />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                id="acceptPolicy"
                data-pokey="privacy_policy"
                data-version="1"
                disabled={isAccepting}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAccept(e);
                }}
              >
                {isAccepting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Accepting...
                  </>
                ) : (
                  'Accept'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyModal;
