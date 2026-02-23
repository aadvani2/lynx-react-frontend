import React from 'react';
import { Link } from 'react-router-dom';
import errorImageUrl from '../../../assets/Icon/error-503.svg';
import './ErrorPages.css';

/**
 * 503 Service Unavailable Component
 * Displays when the service is temporarily unavailable
 */
const Error503: React.FC = () => {

  return (
    <section className="error-page-wrapper bg-light">
      <div className="container pt-10 pb-12 pt-md-14 pb-md-16 text-center">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <img 
              src={errorImageUrl} 
              className="img-fluid mb-5 error-image" 
              alt="503 Error" 
              style={{ maxWidth: '360px' }}
            />
            <h1 className="display-4 mb-3">503 - Service Temporarily Unavailable</h1>
            <p className="lead mb-6">
              Our servers are currently undergoing maintenance or are temporarily overloaded. Please check back in
              a few minutes.
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

export default Error503;

