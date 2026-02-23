import React from 'react';
import { getModalCloseIconCleanup } from '../../../../utils/modalCloseIcon';

interface BobcatPartnerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BobcatPartnerInfoModal: React.FC<BobcatPartnerInfoModalProps> = ({ isOpen, onClose }) => {
  const cleanupRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      cleanupRef.current = getModalCloseIconCleanup(isOpen, {
        className: 'bobcat-modal-close',
        size: 1.8,
        top: '0.7rem',
        right: '0.7rem'
      });
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{
          zIndex: 1040,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show"
        style={{
          display: "block",
          zIndex: 1050,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          padding: "1rem",
        }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content" style={{ position: 'relative' }}>
            <button 
              className="bobcat-modal-close" 
              onClick={onClose}
              aria-label="Close"
              type="button"
            ></button>
            <div className="modal-header pb-0">
              <h3 id="tierModalTitle" className="text-center">
                Bobcat Partner
              </h3>
            </div>
            <div className="modal-body">
              <hr className="mt-2 mb-3" />
              <div id="tierModalDescription" className="mb-6">
                <p>
                  For professionals who prefer to work on scheduled jobs,
                  booked at least 24 hours in advance.
                </p>
                <ul className="icon-list bullet-bg bullet-soft-primary mb-0">
                  <li className="mt-3">
                    <span>
                      <i className="uil uil-check"></i>
                    </span>
                    <span>
                      Consistent Work – Get steady service requests without
                      chasing leads.
                    </span>
                  </li>
                  <li className="mt-3">
                    <span>
                      <i className="uil uil-check"></i>
                    </span>
                    <span>
                      No Urgent or Emergency Calls – Work on your schedule,
                      at your pace.
                    </span>
                  </li>
                  <li className="mt-3">
                    <span>
                      <i className="uil uil-check"></i>
                    </span>
                    <span>
                      No High-Pressure Response Times – Build your
                      reputation at a comfortable speed.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BobcatPartnerInfoModal;
