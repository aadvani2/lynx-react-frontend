import React from 'react';

interface LoadingSpinnerProps {
  onBackClick: () => void;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ onBackClick }) => {
  return (
    <div id="loadView">
      <div className="card">
        <div className="card-header p-3 d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn btn-primary btn-sm rounded-pill" onClick={onBackClick}>
              <i className="uil uil-arrow-left"></i>Back
            </button>
            &nbsp;&nbsp;<h4 className="card-title mb-0">Accepted Requests</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="w-100 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading accepted requests...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
