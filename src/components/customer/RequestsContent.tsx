import React, { useEffect } from 'react';
import { useRequests } from '../../hooks/useRequests';
import { getRequestTypeTitle } from '../../utils/requestsUtils';
import { TimeFilter, RequestBadges, RequestsList, Pagination } from './requests';
import type { RequestItem as RequestItemType } from '../../store/requestsStore'; // Corrected import path

interface RequestsContentProps {
  setActivePage: (page: string) => void;
  requestType: string;
}

const RequestsContent: React.FC<RequestsContentProps> = ({ setActivePage, requestType }) => {
  const {
    requests,
    selectedFilter,
    timeFilter,
    page,
    lastPage,
    loading,
    error,
    requestCounts,
    handleFilterClick: originalHandleFilterClick,
    handleTimeChange,
    handlePageClick
  } = useRequests(requestType);

  // Override handleFilterClick to also update the page route
  const handleFilterClick = (status: string) => {
    // Update the page route to reflect the new filter
    setActivePage(`requests_${status}`);
    // Call the original filter click handler
    originalHandleFilterClick(status);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRequestClick = (request: RequestItemType) => { // Accept the request object
    const normalizedStatus = request.status.toLowerCase().replace(/\s+/g, '_'); // Get status from the request object
    setActivePage(`details_${normalizedStatus}_${request.id}_${page}`);
  };

  const effectiveFilter = selectedFilter || requestType;
  const headerTitle = getRequestTypeTitle(effectiveFilter);

  return (
    <div className="card">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <button
            className="btn btn-primary btn-sm rounded-pill"
            onClick={() => setActivePage("dashboard")}
          >
            <i className="uil uil-arrow-left" /> Back
          </button>
          &nbsp;&nbsp;
          <h4 className="card-title mb-0">
            {headerTitle}
          </h4>
        </div>
      </div>
      
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="filter-top-wrap mb-5 d-flex align-items-center d-flex filter-top-wrap flex-md-nowrap flex-wrap gap-4 justify-content-between mb-3">
          <TimeFilter 
            timeFilter={timeFilter}
            onTimeChange={handleTimeChange}
          />
          
          <RequestBadges
            selectedFilter={selectedFilter}
            requestCounts={requestCounts}
            onFilterClick={handleFilterClick}
          />
        </div>

        <RequestsList 
          requests={requests}
          loading={loading}
          onRequestClick={handleRequestClick}
        />

        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageClick={handlePageClick}
        />
      </div>
    </div>
  );
};

export default RequestsContent;
