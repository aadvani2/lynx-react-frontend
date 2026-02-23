import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <section className="wrapper bg-light">
      <div className="container pt-6 pb-10">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 mb-0">Loading blogs...</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoadingState;
