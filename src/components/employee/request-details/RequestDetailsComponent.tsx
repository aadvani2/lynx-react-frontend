import React, { useEffect, useState } from 'react';
import { employeeService } from '../../../services/employeeServices/employeeService';
import type { RequestDetailsResponse } from '../../../types/employee/request-details';
import Swal from '../../../lib/swal';
import AcceptedRequestDetailsContent from './AcceptedRequestDetailsContent';
import InProgressRequestDetailsContent from './InProgressRequestDetailsContent';
import CompletedRequestDetailsContent from './CompletedRequestDetailsContent';
import CancelledRequestDetailsContent from './CancelledRequestDetailsContent';

interface RequestDetailsComponentProps {
  requestId: number;
  requestType: string;
  currentPage: number;
  onBack: () => void;
}

const RequestDetailsComponent: React.FC<RequestDetailsComponentProps> = ({ requestId, requestType, currentPage, onBack }) => {
  const [requestDetails, setRequestDetails] = useState<RequestDetailsResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const requestBody = {
          id: requestId,
          type: requestType,
          user_timezone: 5.5, // This should come from user settings or context
          currentPage: currentPage,
        };

        const response: RequestDetailsResponse = await employeeService.getRequestDetails(requestBody);

        if (response?.success && response.data) {
          setRequestDetails(response.data);
        } else {
          setError('Failed to fetch request details');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch request details',
          });
        }
      } catch (err) {
        console.error('Error fetching request details:', err);
        setError('Failed to fetch request details. Please try again.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch request details. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId, requestType, currentPage]);

  if (isLoading || error || !requestDetails) {
    return (
      <AcceptedRequestDetailsContent
        onBack={onBack}
        requestDetails={requestDetails}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  switch (requestType) {
    case 'accepted':
      return (
        <AcceptedRequestDetailsContent
          onBack={onBack}
          requestDetails={requestDetails}
          isLoading={isLoading}
          error={error}
        />
      );
    case 'in process':
      return (
        <InProgressRequestDetailsContent
          onBack={onBack}
          requestDetails={requestDetails}
          isLoading={isLoading}
          error={error}
        />
      );
    case 'completed':
      return (
        <CompletedRequestDetailsContent
          onBack={onBack}
          requestDetails={requestDetails}
          isLoading={isLoading}
          error={error}
        />
      );
    case 'cancelled':
      return (
        <CancelledRequestDetailsContent
          onBack={onBack}
          requestDetails={requestDetails}
          isLoading={isLoading}
          error={error}
        />
      );
    default:
      return (
        <AcceptedRequestDetailsContent
          onBack={onBack}
          requestDetails={requestDetails}
          isLoading={isLoading}
          error={error}
        />
      );
  }
};

export default RequestDetailsComponent;
