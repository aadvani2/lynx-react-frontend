import React from 'react';
import { addModalCloseIconStyles } from '../../../../utils/modalCloseIcon';

interface IberianLynxInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IberianLynxInfoModal: React.FC<IberianLynxInfoModalProps> = ({ isOpen, onClose }) => {
  const cleanupRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      cleanupRef.current = addModalCloseIconStyles({
        className: 'iberian-modal-close',
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
          <div className="modal-content">
            <div className="modal-header pb-0">
              <button
                type="button"
                className=" iberian-modal-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
              <h3 id="tierModalTitle" className="text-center">
                Iberian Lynx Partner
              </h3>
            </div>
            <div className="modal-body">
              <hr className="mt-2 mb-3" />
              <div id="tierModalDescription" className="mb-6">
                <p>
                  For pros who want access to both scheduled and urgent jobs (completed within 24 hours).
                </p>
                <ul className="icon-list bullet-bg bullet-soft-primary mb-0">
                  <li className="mt-3">
                    <span>
                      <i className="uil uil-check"></i>
                    </span>
                    <span>
                      Priority Access – Get more jobs, including last-minute requests.
                    </span>
                  </li>
                  <li className="mt-3">
                    <span>
                      <i className="uil uil-check"></i>
                    </span>
                    <span>
                      Exclusive Placement – Preferred provider listing on the Lynx platform.
                    </span>
                  </li>
                  <li className="mt-3">
                    <span>
                      <i className="uil uil-check"></i>
                    </span>
                    <span>
                      Increased Earnings – Urgent jobs offer higher demand and better volume.
                    </span>
                  </li>
                </ul>
                <p>&nbsp;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IberianLynxInfoModal;
