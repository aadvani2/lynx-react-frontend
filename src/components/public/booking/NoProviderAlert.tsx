import React from 'react';

interface NoProviderAlertProps {
  isVisible: boolean;
  message?: string;
}

const NoProviderAlert: React.FC<NoProviderAlertProps> = ({
  isVisible,
  message = "No providers found in your area"
}) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="d-block" id="noProviderAlert" style={{ display: 'block' }}>
        <div className="row text-start justify-content-center">
          <div className="col-md-12 text-center">
            <img
              src=""
              className="my-2 w-10"
              alt="No providers found"
            />
            <p className="mb-0" id="notFoundMsg">{message}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoProviderAlert;
