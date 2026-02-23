import React from 'react';

interface AssignEmployeeAlertProps {
  onAssignClick: () => void;
}

const AssignEmployeeAlert: React.FC<AssignEmployeeAlertProps> = ({ onAssignClick }) => {
  return (
    <div className="alert bg-soft-aqua d-flex justify-content-between align-items-center flex-wrap column-gap-2 pt-1 pb-1">
      <span className="px-4">Would you like to assign an employee to perform this job at the client's
        location?</span>
      <button 
        className="btn rounded-pill btn-link" 
        onClick={onAssignClick}
      >
        Assign Employee
      </button>
    </div>
  );
};

export default AssignEmployeeAlert;
