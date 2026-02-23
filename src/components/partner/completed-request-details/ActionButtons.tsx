import React from 'react';


const ActionButtons: React.FC = () => {
  return (
    <div className="d-flex justify-content-center gap-2 mt-3">
      <button className="btn rounded-pill btn-success text-white" data-bs-toggle="modal" data-bs-target="#completeRequestModal">Rate Service</button>
    </div>
  );
};

export default ActionButtons;
