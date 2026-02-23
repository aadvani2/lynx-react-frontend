import React, { useState } from 'react';
import { useRequestDetails } from '../../hooks/useRequestDetails';
import { useScheduleRequestHistory } from '../../hooks/useScheduleRequestHistory';
import {
  ProgressTracker,
  StatusHeader,
  ScheduleCard,
  ScheduleHistory,
  VerificationCode,
  ServiceDetailsTable,
  // TransactionDetails,
  ServiceProviderInfo,
  CancelAssignmentModal
} from '../../components/customer/request-details';
import RequestAttachments from '../../components/customer/request-details/RequestAttachments';

interface RequestDetailsPageProps {
  setActivePage: (page: string) => void;
  requestId: number;
  requestType: string;
  currentPage: number;
}

const RequestDetailsPage: React.FC<RequestDetailsPageProps> = ({
  setActivePage,
  requestId,
  requestType,
  currentPage
}) => {
  const { requestDetails, loading, error, refetch } = useRequestDetails(requestId, requestType, currentPage);
  const { loading: historyLoading, error: historyError, historyData, fetchScheduleRequestHistory } = useScheduleRequestHistory();
  const [showHistory, setShowHistory] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Parse files from API response
  let attachmentFiles: string[] = [];
  try {
    const filesRaw = requestDetails?.data?.request?.files;
    if (filesRaw) {
      attachmentFiles = JSON.parse(filesRaw);
    }
  } catch (e) {
    attachmentFiles = [];
  }

  const handleBackClick = () => {
    setActivePage('my_requests');
  };

  const handleCancelAssignment = (cancelReason: string) => {
    // TODO: Implement cancel assignment API call
    console.log('Cancelling assignment with reason:', cancelReason);
    setShowCancelModal(false);
    // You can add API call here to cancel the assignment
  };

  const handleShowHistory = async () => {
    if (!requestDetails?.data?.request?.id) {
      console.error('❌ No request_id available for history');
      return;
    }

    // If history is already visible, just hide it
    if (showHistory) {
      setShowHistory(false);
      return;
    }

    // If history is not visible, fetch data and show it
    try {
      await fetchScheduleRequestHistory(requestDetails.data.request.id);
      setShowHistory(true);
    } catch (error) {
      console.error('❌ Failed to fetch schedule history:', error);
      // Error is already handled by the hook
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header p-3">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-primary btn-sm rounded-pill me-3"
              onClick={handleBackClick}
            >
              <i className="uil uil-arrow-left" /> Back
            </button>
            <h4 className="card-title mb-0">Request Details</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-header p-3">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-primary btn-sm rounded-pill me-3"
              onClick={handleBackClick}
            >
              <i className="uil uil-arrow-left" /> Back
            </button>
            <h4 className="card-title mb-0">Request Details</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            <i className="uil uil-exclamation-triangle me-2"></i>
            {error}
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={refetch}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="loadView">
      <div className="card mb-4">
        <div className="card-header p-3 d-flex align-items-center justify-content-between">
          <button
            className="btn btn-primary btn-sm rounded-pill"
            onClick={handleBackClick}
          >
            <i className="uil uil-arrow-left" /> Back
          </button>
          <h4 className="card-title mb-0">
            Request #{requestDetails?.data?.request?.request_id || requestId}
          </h4>
        </div>

        <div className="card-body p-3">
          {/* Service Tier Tag */}
          <div className="mb-3 service-tier-tag">
            <u className="text-bold">Request Type: </u>
            <b>{requestDetails?.data?.request?.service_tier || 'N/A'}</b>
          </div>

          {/* Progress Section */}
          <div id="requestProcess">
            <div className="card mb-3">
              <div className="card-body p-3">
                <StatusHeader requestDetails={requestDetails} />
                <ProgressTracker requestDetails={requestDetails} />

                {/* Service Provider Info */}
                {requestDetails?.data?.request?.status !== 'pending' &&
                  <ServiceProviderInfo requestDetails={requestDetails} />
                }
              </div>
            </div>
          </div>

          {requestDetails?.data?.request?.status !== 'cancelled' && (
            <ScheduleCard
              requestDetails={requestDetails}
              onShowHistory={handleShowHistory}
              isHistoryVisible={showHistory}
            />
          )}

          <ScheduleHistory
            requestDetails={requestDetails}
            historyData={historyData}
            loading={historyLoading}
            error={historyError}
            isVisible={showHistory}
          />

          <VerificationCode requestDetails={requestDetails} />
          <ServiceDetailsTable requestDetails={requestDetails} />

          {/* Last Updated */}
          <div className="text-end text-muted mt-2 fs-sm" style={{ fontSize: '0.9em' }}>
            Last updated on {requestDetails?.data?.request?.updated_at ?
              new Date(requestDetails.data.request.updated_at).toLocaleString() : 'N/A'}
          </div>

          <RequestAttachments files={attachmentFiles} />

          {/* Action Buttons */}
          {requestDetails?.data?.request?.status !== 'cancelled' && requestDetails?.data?.request?.status !== 'completed' && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button
                className="btn btn-danger rounded-pill text-white"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Assignment
              </button>
            </div>
          )}

          {/* <TransactionDetails requestDetails={requestDetails} /> */}

        </div>
      </div>

      {/* Cancel Assignment Modal */}
      <CancelAssignmentModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelAssignment}
        requestId={requestId}
      />
    </div>
  );
};

export default RequestDetailsPage;
