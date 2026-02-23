import React from 'react';

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="text-center mt-4">
      <ul className="pagination justify-content-center" id="transaction-pagination">
        <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
          <a 
            className="page-link wide" 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            style={{ cursor: currentPage > 1 ? 'pointer' : 'default' }}
          >
            « Previous
          </a>
        </li>
        
        {generatePageNumbers().map((pageNumber, index) => (
          <li 
            key={index} 
            className={`page-item ${pageNumber === currentPage ? 'active' : ''} ${pageNumber === '...' ? 'disabled' : ''}`}
          >
            {pageNumber === '...' ? (
              <span className="page-link">...</span>
            ) : (
              <a 
                className={`page-link ${pageNumber === currentPage ? 'bg-aqua' : ''}`}
                onClick={() => onPageChange(pageNumber as number)}
                style={{ cursor: 'pointer' }}
              >
                {pageNumber}
              </a>
            )}
          </li>
        ))}
        
        <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
          <a 
            className="page-link wide" 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            style={{ cursor: currentPage < totalPages ? 'pointer' : 'default' }}
          >
            Next »
          </a>
        </li>
      </ul>
    </div>
  );
};

export default TransactionPagination;
