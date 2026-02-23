import React from 'react';
import type { Request } from '../../../../types/employee/requests';
import RequestItem from './RequestItem';
import Pagination from './Pagination';

interface RequestListProps {
  requests: Request[];
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onRequestClick?: (requestId: number) => void;
}

const RequestList: React.FC<RequestListProps> = ({ 
  requests, 
  currentPage, 
  lastPage, 
  onPageChange, 
  onRequestClick 
}) => {
  if (!requests || requests.length === 0) {
    return (
      <div className="w-100 text-center">
        <p>No accepted requests found.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="nav nav-tabs nav-tabs-bg nav-tabs-shadow-lg d-flex justify-content-center nav-justified requests-list">
        {requests.map((request) => (
          <RequestItem
            key={request.id}
            request={request}
            currentPage={currentPage}
            onRequestClick={onRequestClick}
          />
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default RequestList;
