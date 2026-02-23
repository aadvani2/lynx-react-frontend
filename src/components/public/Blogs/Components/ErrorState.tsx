import React from 'react';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <section className="wrapper bg-light">
      <div className="container pt-6 pb-10">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">
              <i className="uil uil-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorState;
