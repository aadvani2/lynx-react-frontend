import React, { useMemo } from 'react';

/**
 * Props for RequestsPagination component
 */
export interface RequestsPaginationProps {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
}

/**
 * Global pagination component for Partner request lists
 * Based on AcceptedRequestsContent implementation with enhancements
 */
const RequestsPagination: React.FC<RequestsPaginationProps> = ({
  currentPage,
  lastPage,
  perPage,
  total,
  onPageChange,
  ariaLabel = 'Requests pagination'
}) => {
  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const start = (currentPage - 1) * perPage + 1;
    const end = Math.min(currentPage * perPage, total);
    return { start, end };
  }, [currentPage, perPage, total]);

  // Generate page numbers for pagination (smart pagination with max visible pages)
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, lastPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Don't render if only one page
  if (lastPage <= 1) {
    return null;
  }

  return (
    <nav aria-label={ariaLabel} className="mt-3">
      {/* Pagination Info */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-muted">
          Showing {paginationInfo.start} to {paginationInfo.end} of {total} entries
        </div>
        <div className="text-muted">
          Page {currentPage} of {lastPage}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="text-center">
        <ul className="pagination justify-content-center" id="request-pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a
              className="page-link wide"
              href="javascript:void(0);"
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous"
            >
              « Previous
            </a>
          </li>

          {pageNumbers.map((page) => {
            const isActive = page === currentPage;
            return (
              <li key={page} className={`page-item ${isActive ? 'active' : ''}`}>
                <a
                  className={`page-link ${isActive ? 'bg-aqua' : ''}`}
                  href="javascript:void(0);"
                  onClick={() => handlePageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </a>
              </li>
            );
          })}

          <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
            <a
              className="page-link wide"
              href="javascript:void(0);"
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next"
            >
              Next »
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default RequestsPagination;

