import React from 'react';
import { useRequestDetails } from '../../../../hooks/useRequestDetails';
import styles from './OnHoldRequestDetailsPage.module.css';
import type { RequestDetailsData } from '../../../../store/requestDetailsStore';
import RequestProgressBar from '../../../common/requestDetails/RequestProgressBar/RequestProgressBar';
import RequestSummaryCard from '../../../common/requestDetails/RequestSummaryCard/RequestSummaryCard';
import ProviderInfoCard from '../../../common/requestDetails/ProviderInfoCard/ProviderInfoCard';
import ScheduledTimeCard from '../../../common/requestDetails/ScheduledTimeCard/ScheduledTimeCard';
import HelpContactCard from '../../../common/requestDetails/HelpContactCard/HelpContactCard';
import CancelAssignmentModal from '../../request-details/CancelAssignmentModal';
import RequestActionButtons from '../../../common/requestDetails/RequestActionButtons/RequestActionButtons';
import ProposeTimeModal from '../../../common/ProposeTimeModal';
import Swal from 'sweetalert2';
import { customerService } from '../../../../services/customerServices/customerService';
import ArrowLeftIcon from "../../../../assets/Icon/arrow left.svg";
import { useRequestRealtime } from '../../../../hooks/useRequestRealtime';
import ErrorIcon from "../../../../assets/Icon/error.svg";
import LoadingComponent from '../../../common/LoadingComponent';

interface OnHoldRequestDetailsPageProps {
  setActivePage: (page: string) => void;
  requestId: number;
  currentPage: number;
}

const OnHoldRequestDetailsPage: React.FC<OnHoldRequestDetailsPageProps> = ({
  setActivePage,
  requestId,
  currentPage
}) => {
  const requestType = 'all';
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [isProposeTimeModalOpen, setIsProposeTimeModalOpen] = React.useState(false);

  const { requestDetails, loading, error, refetch } = useRequestDetails(
    requestId,
    requestType,
    currentPage
  ) as { requestDetails: RequestDetailsData; loading: boolean; error: string; refetch: () => Promise<void> };

  // Listen for real-time request updates via WebSocket
  useRequestRealtime(requestId, () => {
    refetch();
  });

  const handleCancelAssignmentClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
  };

  const handleProposeTimeClick = () => {
    setIsProposeTimeModalOpen(true);
  };

  const handleProposeTimeModalClose = () => {
    setIsProposeTimeModalOpen(false);
  };

  const handleProposeTimeSubmit = () => {
    // TODO: call API to submit proposal
    handleProposeTimeModalClose();
  };

  const handleAcceptClick = async () => {
    if (!requestId) return;

    await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to accept this request.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, accept it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        if (confirmBtn) confirmBtn.classList.add('rounded-pill');
      },
      preConfirm: async () => {
        try {
          Swal.showLoading();
          const success = await customerService.acceptRequest({
            request_id: requestId,
            is_accepted: 1,
          });

          if (!success) {
            Swal.showValidationMessage('Failed to accept the request. Please try again.');
            return false;
          }
          return true;
        } catch (err) {
          console.error('Error accepting request:', err);
          Swal.showValidationMessage('An error occurred while accepting. Please try again.');
          return false;
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Refetch request details to get the latest status from backend
        // After customer accepts purpose time, status should still be "on hold" until provider accepts
        await refetch();
        
        await Swal.fire({
          icon: 'success',
          title: 'Schedule Accepted!',
          text: 'You have accepted the proposed schedule. Waiting for service partner confirmation.',
          timer: 2000,
          showConfirmButton: false,
        });

        // Status should still be "on hold" after customer accepts (until provider accepts)
        // Stay on the on_hold page - don't navigate to accepted page
        // The refetch will update the UI to show the updated handshake status
        // No need to change page - we're already on the correct page
      }
    });
  };

  const handleCancelModalSubmit = () => {
    handleCancelModalClose();
  };

  if (loading) { return (<LoadingComponent />); }

  if (error) {
    return (
      <div className={styles.body}>
        <p>Error: {error}</p>
        <button onClick={() => setActivePage('my_requests')}>Back to Requests</button>
      </div>
    );
  }

  const request = requestDetails?.data?.request;

  if (!request) {
    return (
      <div className={styles.body}>
        <p>No request details available.</p>
        <button onClick={() => setActivePage('my_requests')}>Back to Requests</button>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <div className="container">
        {/* Top bar: Back + progress */}
        <div
          className={`d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 mb-7 ${styles.buttonParent}`}
        >
          <div
            className={`${styles.button} ${styles.backButtonHover}`}
            onClick={() => setActivePage('my_requests')}
          >
            <img
              className={styles.iconarrowLeft}
              alt="Back"
              src={ArrowLeftIcon}
            />
            <b className={styles.bodyButton}>Back</b>
          </div>
          <div className="flex-grow-1 w-100">
            <RequestProgressBar currentStatus={request.status || 'pending'} />
          </div>
        </div>

        {/* Provider on top for <1800px */}
        <div className={styles.providerTop}>
          <ProviderInfoCard
            sub_category_name={request.sub_category_name || 'N/A'}
            handshake_provider_name={request.provider?.name || 'N/A'}
            status_message={request?.status_message || ''}
            email={request?.provider?.email}
            dial_code={request?.provider?.dial_code}
            phone={request?.provider?.phone}
            showContactInfo={true}
            providerImage={request.provider?.image}
          />
        </div>

        {/* Main grid */}
        <div className={`row g-3 g-lg-4 ${styles.frameContainer}`}>
          {/* LEFT column */}
          <div className={`col-12 ${styles.mainColLeft}`}>
            <div className={styles.frameDiv}>
              <RequestSummaryCard
                schedule_msg={request.schedule_msg || ''}
                request_id={String(request.request_id || '')}
                updated_at={request.updated_at || ''}
                services_name={request.services_name || ''}
                description={request.description || ''}
                city={request.city || ''}
                state={request.state || ''}
                zip_code={request.zip_code || ''}
                contact_person={request.contact_person || ''}
                phone={request.phone || ''}
                dial_code={request.dial_code || ''}
                full_address={request.full_address || ''}
                files={request.files || ''}
                RequestSummaryHeader="Request On Hold"
              />

              {/* Buttons under summary for ≥1800px */}
              <div className={`${styles.buttonGroup} ${styles.buttonGroupTop}`}>
                <div
                  className={styles.button2}
                  onClick={() => setActivePage('my_requests')}
                >
                  <b className={styles.bodyRequestSent}>Back to Requests</b>
                </div>
                <div
                  className={styles.button4}
                  onClick={handleCancelAssignmentClick}
                >
                  <img
                    className={styles.iconarrowLeft}
                    alt=""
                    src={ErrorIcon}
                  />
                  <b className={styles.bodyRequestSent}>Cancel Request</b>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT column */}
          <div className={`col-12 ${styles.mainColRight}`}>
            <div className={styles.bookingServiceInfo}>
              {/* Provider only visible here on ≥1800px */}
              <div className={styles.providerRightOnly}>
                <ProviderInfoCard
                  sub_category_name={request.sub_category_name || 'N/A'}
                  handshake_provider_name={request.provider?.name || 'N/A'}
                  status_message={request?.status_message || ''}
                  email={request?.provider?.email}
                  dial_code={request?.provider?.dial_code}
                  phone={request?.provider?.phone}
                  showContactInfo={true}
                  providerImage={request.provider?.image}
                />
              </div>

              <RequestActionButtons
                timestampText={request.schedule_msg || ''}
                schedule_time={request.schedule_time || ''}
                noteText={request.status_message || ''}
                proposedBy={requestDetails.data?.buttons?.btn_accept ? 'partner' : 'customer'}
                onPropose={
                  requestDetails.data?.buttons?.btn_propose_schedule
                    ? handleProposeTimeClick
                    : undefined
                }
                onAccept={
                  requestDetails.data?.buttons?.btn_accept
                    ? handleAcceptClick
                    : undefined
                }
              />

              <ScheduledTimeCard
                schedule_time={request.schedule_time || ''}
                service_tier={request.service_tier || ''}
              />

              <HelpContactCard />

              <ProposeTimeModal
                show={isProposeTimeModalOpen}
                onClose={handleProposeTimeModalClose}
                requestId={requestId}
                isCustomer={true}
                onSubmit={handleProposeTimeSubmit}
                setActivePage={setActivePage}
              />
            </div>
          </div>
        </div>

        {/* Bottom buttons for <1800px */}
        <div className={`${styles.buttonGroup} ${styles.buttonGroupBottom}`}>
          <div
            className={styles.button2}
            onClick={() => setActivePage('my_requests')}
          >
            <b className={styles.bodyRequestSent}>Back to Requests</b>
          </div>
          <div
            className={styles.button4}
            onClick={handleCancelAssignmentClick}
          >
            <img
              className={styles.iconarrowLeft}
              alt=""
              src={ErrorIcon}
            />
            <b className={styles.bodyRequestSent}>Cancel Request</b>
          </div>
        </div>
      </div>

      <CancelAssignmentModal
        isOpen={isCancelModalOpen}
        onClose={handleCancelModalClose}
        onConfirm={handleCancelModalSubmit}
        requestId={requestId}
      />
    </div>
  );
};

export default OnHoldRequestDetailsPage;
