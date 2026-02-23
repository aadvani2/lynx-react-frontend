import React from 'react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageClick: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, lastPage, onPageClick }) => {
  if (lastPage <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(lastPage, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="d-flex justify-content-center mt-4">
      <nav aria-label="Requests pagination">
        <ul className="pagination">
          {/* Previous button */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => currentPage > 1 && onPageClick(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          {/* First page if not visible */}
          {pages[0] > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => onPageClick(1)}>
                  1
                </button>
              </li>
              {pages[0] > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {/* Page numbers */}
          {pages.map((page) => {
            const isActive = page === currentPage;
            return (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button
                  className={`page-link ${isActive ? 'bg-aqua' : ''}`}
                  onClick={() => onPageClick(page)}
                >
                  {page}
                </button>
              </li>
            )
          })}

          {/* Last page if not visible */}
          {pages[pages.length - 1] < lastPage && (
            <>
              {pages[pages.length - 1] < lastPage - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button className="page-link" onClick={() => onPageClick(lastPage)}>
                  {lastPage}
                </button>
              </li>
            </>
          )}

          {/* Next button */}
          <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => currentPage < lastPage && onPageClick(currentPage + 1)}
              disabled={currentPage === lastPage}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination; 