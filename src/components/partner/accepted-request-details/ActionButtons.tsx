import React from 'react';

interface ActionButtonsProps {
  onCancelAssignmentClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancelAssignmentClick }) => {
  return (
    <div className="d-flex justify-content-center gap-2 mt-3">
      <button 
        className="btn rounded-pill btn-danger text-white" 
        onClick={onCancelAssignmentClick}
      >
        Cancel Assignment
      </button>
    </div>
  );
};

export default ActionButtons;
