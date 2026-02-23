import React from 'react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  lastPage, 
  onPageChange 
}) => {
  if (lastPage <= 1) {
    return null;
  }

  return (
    <div className="text-center mt-4">
      <ul className="pagination justify-content-center" id="request-pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a 
            className="page-link wide" 
            href="javascript:void(0);" 
            onClick={() => onPageChange(currentPage - 1)}
          >
            « Previous
          </a>
        </li>

        {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <a 
              className={`page-link ${currentPage === page ? 'bg-aqua' : ''}`}
              href="javascript:void(0);" 
              onClick={() => onPageChange(page)}
            >
              {page}
            </a>
          </li>
        ))}

        <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
          <a 
            className="page-link wide" 
            href="javascript:void(0);" 
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next »
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
