import React from 'react';

interface VerifyArrivalAlertProps {
  onVerifyClick: () => void;
}

const VerifyArrivalAlert: React.FC<VerifyArrivalAlertProps> = ({ onVerifyClick }) => {
  return (
    <div className="alert alert-warning d-flex justify-content-between align-items-center pt-1 pb-1">
      <span>Verify when reached at location</span>
      <button 
        className="btn rounded-pill btn-link" 
        onClick={onVerifyClick}
      >
        VERIFY
      </button>
    </div>
  );
};

export default VerifyArrivalAlert;
