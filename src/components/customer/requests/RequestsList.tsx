import React from 'react';
import type { RequestItem as RequestItemType } from '../../../store/requestsStore';
import RequestItem from './RequestItem';

interface RequestsListProps {
  requests: RequestItemType[];
  loading: boolean;
  onRequestClick: (request: RequestItemType) => void; // Update prop type
}

const RequestsList: React.FC<RequestsListProps> = ({ requests, loading, onRequestClick }) => {
  if (loading) {
    return <div className="text-center py-3">Loading...</div>;
  }

  if (!requests.length) {
    return (
      <div className="text-center py-5">
        <p className="m-0">No requests found.</p>
      </div>
    );
  }

  return (
    <ul className="nav nav-tabs nav-tabs-bg nav-tabs-shadow-lg d-flex justify-content-center nav-justified requests-list">
      {requests.map((request) => (
        <RequestItem key={request.id} request={request} onRequestClick={onRequestClick} />
      ))}
    </ul>
  );
};

export default RequestsList; 