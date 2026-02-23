import React from 'react';

interface RequestHeaderProps {
  requestId: number;
  onBackClick: () => void;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ requestId, onBackClick }) => {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <button
        className="btn btn-primary btn-sm rounded-pill"
        onClick={onBackClick}
      >
        <i className="uil uil-arrow-left"></i> Back
      </button>
      <h4 className="card-title mb-0">Request #{requestId}</h4>
    </div>
  );
};

export default RequestHeader;
