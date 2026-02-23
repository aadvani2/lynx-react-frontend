import React from 'react';

const BlogPagination: React.FC = () => {
  return (
    <nav className="d-flex justify-content-center" aria-label="pagination">
      <ul className="pagination">
        <li className="page-item disabled">
          <a className="page-link wide" href="#">
            Previous
          </a>
        </li>
        <li className="page-item active">
          <a 
            className="page-link" 
            href="" 
            style={{ backgroundColor: '#1e4d5a', color: 'white' }}
          >
            1
          </a>
        </li>
        <li className="page-item disabled">
          <a className="page-link wide" href="#">
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default BlogPagination;
