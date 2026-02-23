import React from 'react';
import type { RequestDetailsData } from '../../../store/requestDetailsStore';
import { getStatusMessage, getStatusIcon } from '../../../utils/requestDetailsUtils';

interface StatusHeaderProps {
  requestDetails: RequestDetailsData | null;
}

const StatusHeader: React.FC<StatusHeaderProps> = ({ requestDetails }) => {
  return (
    <div className="d-flex align-items-center">
      <img 
        src={getStatusIcon(
          requestDetails?.request_status || '', 
          requestDetails?.data?.status_icon
        )} 
        alt="Status Icon" 
        width={32} 
        height={32} 
      />
      <div className="ms-3 me-2">
        {getStatusMessage(requestDetails?.request_status || '')}
      </div>
    </div>
  );
};

export default StatusHeader; 