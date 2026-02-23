import React, { useEffect, useState } from 'react';
import { useCompletedRequestDetailsStore } from '../../store/partnerStore/completedRequestDetailsStore';
import { RequestHeader, ProviderInfoCard, ServiceRequestDetails, ScheduledTimeCard, ScheduleHistoryComponent } from './accepted-request-details';
import RequestAttachments from './RequestAttachments';


interface CompletedRequestsContentDetailsProps {
  setActivePage: (page: string) => void;
}

const CompletedRequestsContentDetails: React.FC<CompletedRequestsContentDetailsProps> = ({
  setActivePage
}) => {
  const {
    requestDetails,
    loading,
    error,
    fetchRequestDetails,
    fetchScheduleHistory,
    requestDetails: requestDetailsData
  } = useCompletedRequestDetailsStore();
  const request = requestDetailsData?.request;
  const provider = request?.provider;
  const member = request?.member || null;

  const displayPerson = member || provider;

  const name = displayPerson?.name || "";
  const email = displayPerson?.email || "";
  const phone = displayPerson?.phone || "";
  const dialCode = displayPerson?.dial_code || "";
  const image = displayPerson?.image || "";


  const [showScheduleHistory, setShowScheduleHistory] = useState(false);

  // Fetch request details when component mounts
  useEffect(() => {
    const requestId = sessionStorage.getItem('selectedRequestId'); // Changed from 'selectedRequestId'
    if (requestId) {
      fetchRequestDetails(parseInt(requestId));
    }
  }, [fetchRequestDetails]);

  const handleBackToCompletedRequests = () => {
    setActivePage("completed-requests");
  };

  const handleToggleScheduleHistory = () => {
    if (!showScheduleHistory && request?.id) {
      fetchScheduleHistory(request.id, new Date().getTimezoneOffset() / -60);
    }
    setShowScheduleHistory(!showScheduleHistory);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="w-100 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading completed request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button
            className="btn btn-primary"
            onClick={handleBackToCompletedRequests}
          >
            <i className="uil uil-arrow-left" /> Back
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-warning" role="alert">
            No completed request details found.
          </div>
          <button
            className="btn btn-primary"
            onClick={handleBackToCompletedRequests}
          >
            <i className="uil uil-arrow-left" /> Back
          </button>
        </div>
      </div>
    );
  }

  const scheduleLabel = String(request.service_tier_tag || '').toLowerCase() === 'emergency'
    ? 'Emergency Time'
    : 'Scheduled time';

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f0f9fb' }}>
      <RequestHeader
        requestId={request.request_id}
        onBackClick={handleBackToCompletedRequests}
      />

      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-3">
            <div className="card-body p-3">
              <div className="mb-3 service-tier-tag">
                <u className="text-bold">Request Type: </u>
                <b>{requestDetails?.request?.service_tier_tag}</b>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body p-3">
              <ProviderInfoCard
                statusIcon={requestDetails?.status_icon || ''}
                providerName={name}
                providerEmail={email}
                providerPhone={phone}
                providerDialCode={dialCode}
                providerImage={image}
                providerAltPhone={phone}
                providerAltDialCode={dialCode}
                channelName={requestDetails?.channel_name || ''}
                message={requestDetails?.message || ""}
              />
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body p-3">
              <ScheduledTimeCard
                updatedAt={request.updated_at}
                onToggleHistory={handleToggleScheduleHistory}
                showHistory={showScheduleHistory}
                label={scheduleLabel}
              />
            </div>
          </div>

          {showScheduleHistory && (
            <div className="card mb-3">
              <div className="card-body p-3">
                <ScheduleHistoryComponent />
              </div>
            </div>
          )}

        </div>
        <div className="col-lg-6">

          <div className="card mb-3">
            <div className="card-body p-3">
              <ServiceRequestDetails
                category={request.category}
                services_name={request.services_name}
                description={request.description}
                city={request.city}
                state={request.state}
                zipCode={request.zip_code}
                contactPerson={request.contact_person}
                phone={request.phone}
                dialCode={request.dial_code}
                address={request.address}
                countryCode={request.country_code}
                updatedAt={request.updated_at}
              />
            </div>
          </div>

          {/* Attachments */}
          {(() => {
            let attachmentFiles: string[] = [];
            try {
              const filesRaw = request.files;
              if (filesRaw) {
                attachmentFiles = JSON.parse(filesRaw);
              }
            } catch (error) {
              console.error('Error parsing files:', error);
              attachmentFiles = [];
            }
            
            return attachmentFiles.length > 0 ? (
              <div className="card mb-3">
                <div className="card-body p-3">
                  <p className="fw-semibold mb-1 text-secondary fs-sm">Attachments</p>
                  <RequestAttachments files={attachmentFiles} />
                </div>
              </div>
            ) : null;
          })()}

        </div>
      </div>

    </div>
  );
};

export default CompletedRequestsContentDetails;