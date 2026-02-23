import React from 'react';

interface RequestTypeCardProps {
  label: string;
  value: string;
}

const RequestTypeCard: React.FC<RequestTypeCardProps> = ({ label, value }) => {
  return (
    <div className="mb-3 service-tier-tag">
      <u className="text-bold"> {label}</u>
      <b> {value}</b>
    </div>
  );
};

export default RequestTypeCard;
