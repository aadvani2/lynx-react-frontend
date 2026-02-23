import React from 'react';
import { Link } from 'react-router-dom';
import errorImageUrl from '../../../assets/Icon/error-404.svg';
import './ErrorPages.css';

const Error404: React.FC = () => {

  return (
    <section className="error-page-wrapper bg-light">
      <div className="container pt-12 pb-12 pt-md-14 pb-md-16 text-center">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <img 
              src={errorImageUrl} 
              className="img-fluid mb-5 error-image" 
              alt="404 Error" 
              style={{ maxWidth: '360px' }}
            />
            <h1 className="display-4 mb-3 error-title">Oops! Page not found.</h1>
            <p className="lead mb-6">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/" className="btn btn-primary rounded-pill">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Error404;

