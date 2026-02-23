import React from 'react';
import { addModalCloseIconStyles } from '../../../../utils/modalCloseIcon';

interface EurasianLynxInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EurasianLynxInfoModal: React.FC<EurasianLynxInfoModalProps> = ({ isOpen, onClose }) => {
  const cleanupRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      cleanupRef.current = addModalCloseIconStyles({
        className: 'eurasian-modal-close',
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
                className=" eurasian-modal-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
              <h3 id="tierModalTitle" className="text-center">
                Eurasian Lynx Partner
              </h3>
            </div>
            <div className="modal-body">
              <hr className="mt-2 mb-3" />
              <div id="tierModalDescription" className="mb-6">
                <p>
                  For top-tier professionals who can handle all job types, including emergency service within 4 hours.
                </p>
                <ul className="icon-list bullet-bg bullet-soft-primary mb-0">
                  <li className="mt-3">
                    <span>
                      <i className="uil uil-check"></i>
                    </span>
                    <span>
                      Highest Priority Access – First choice for high-value, high-demand jobs.
                    </span>
                  </li>
                  <li className="mt-3">
                    <span>
                      <i className="uil uil-check"></i>
                    </span>
                    <span>
                      Exclusive Marketing Benefits – Stand out as a trusted emergency provider.
                    </span>
                  </li>
                  <li className="mt-3">
                    <span>
                      <i className="uil uil-check"></i>
                    </span>
                    <span>
                      Premium Earnings Potential – Earn more with urgent and emergency service premiums.
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

export default EurasianLynxInfoModal;
