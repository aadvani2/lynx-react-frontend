import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPages.css';
import errorImageUrl from '../../../assets/Icon/error-500.svg';
/**
 * 500 Internal Server Error Component
 * Displays when a server error occurs
 */
const Error500: React.FC = () => {

  return (
    <section className="error-page-wrapper bg-light">
      <div className="container pt-12 pb-12 pt-md-14 pb-md-16 text-center">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <img 
              src={errorImageUrl} 
              className="img-fluid mb-5 error-image" 
              alt="500 Error" 
              style={{ maxWidth: '300px' }}
            />
            <h1 className="display-4 mb-3">Oops! Something went wrong on our end.</h1>
            <p className="lead mb-6">
              We're on it. You can try again shortly, or share your details via Contact Us, and we'll follow
              up once it's fixed.
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

export default Error500;

