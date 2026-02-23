import React from 'react';

interface EmptyStateProps {
  message?: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "No in-progress requests found.",
  icon = "uil uil-chart-line"
}) => {
  return (
    <div className="w-100 text-center">
      <i className={`${icon} fs-1 text-muted`}></i>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default EmptyState;
