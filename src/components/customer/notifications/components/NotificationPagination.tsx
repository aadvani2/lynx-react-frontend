import React from "react";

interface NotificationPaginationProps {
  currentPage: number;
  lastPage: number;
  setCurrentPage: (page: number) => void;
}

const NotificationPagination: React.FC<NotificationPaginationProps> = ({
  currentPage,
  lastPage,
  setCurrentPage,
}) => {
  // Ensure currentPage and lastPage are numbers (defensive)
  const current = Number(currentPage) || 1;
  const total = Number(lastPage) || 1;

  return (
    <div className="text-center mt-4">
      <ul className="pagination justify-content-center" id="request-pagination">
        {/* Previous Button */}
        <li className={`page-item ${current === 1 ? "disabled" : ""}`}>
          <a
            href="#"
            className="page-link wide"
            onClick={(e) => {
              e.preventDefault();
              if (current > 1) setCurrentPage(current - 1);
            }}
          >
            « Previous
          </a>
        </li>

        {/* Page Numbers with Ellipsis */}
        {(() => {
          const pageNumbers: React.ReactNode[] = [];
          const delta = 2; // Number of pages shown around current
          const left = current - delta;
          const right = current + delta + 1;
          const range: number[] = [];

          for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= left && i < right)) {
              range.push(i);
            }
          }

          let lastPrinted = 0;
          range.forEach((page) => {
            if (page - lastPrinted > 1) {
              pageNumbers.push(
                <li key={`ellipsis-${page}`} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              );
            }

            pageNumbers.push(
              <li
                key={page}
                className={`page-item ${current === page ? "active" : ""}`}
              >
                <a
                  href="#"
                  className={`page-link ${
                    current === page ? "bg-aqua text-white" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Number(page)); // ✅ ensure numeric
                  }}
                >
                  {page}
                </a>
              </li>
            );
            lastPrinted = page;
          });

          return pageNumbers;
        })()}

        {/* Next Button */}
        <li className={`page-item ${current === total ? "disabled" : ""}`}>
          <a
            href="#"
            className="page-link wide"
            onClick={(e) => {
              e.preventDefault();
              if (current < total) setCurrentPage(current + 1); // ✅ numeric safe
            }}
          >
            Next »
          </a>
        </li>
      </ul>
    </div>
  );
};

export default NotificationPagination;
