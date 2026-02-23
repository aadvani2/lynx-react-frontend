import React from 'react';

interface ProviderLoaderProps {
  isVisible: boolean;
}

const ProviderLoader: React.FC<ProviderLoaderProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="d-block" id="searchProviderAlert" style={{ display: 'block' }}>
      <div className="row text-start justify-content-center">
        <div className="col-md-12 text-center">
          <div className="my-5" id="searchProviderLoader">
            <span className="loader" />
          </div>
          <p className="mb-0">We are searching for a nearby provider for your service...</p>
        </div>
      </div>
    </div>
  );
};

export default ProviderLoader;
