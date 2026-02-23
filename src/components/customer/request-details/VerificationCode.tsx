import React from 'react';
import type { RequestDetailsData } from '../../../store/requestDetailsStore';

interface VerificationCodeProps {
  requestDetails: RequestDetailsData | null;
}

const VerificationCode: React.FC<VerificationCodeProps> = ({ requestDetails }) => {
  if (!requestDetails?.data?.request?.verification_code) {
    return null;
  }

  return (
    <div className="alert alert-warning mb-3">
      <div className="text-center">
        <h5>Verification Code</h5>
        <hr className="mt-2 mb-2" />
        <p className="text-primary mb-2">
          Provide this verification code to the service partner upon arrival at your location
        </p>
        <div className="fw-semibold fs-lg">{requestDetails.data.request.verification_code}</div>
      </div>
    </div>
  );
};

export default VerificationCode; 