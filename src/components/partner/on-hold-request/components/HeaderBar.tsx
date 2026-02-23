import React from 'react';

interface HeaderBarProps {
  requestId: number;
  onBack: () => void;
  rightContent?: React.ReactNode;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ requestId, onBack, rightContent }) => {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <button className="btn btn-primary btn-sm rounded-pill" onClick={onBack}>
        <i className="uil uil-arrow-left" /> Back
      </button>
      <h4 className="card-title mb-0">Request #{requestId}</h4>
      {rightContent}
    </div>
  );
};

export default HeaderBar;
