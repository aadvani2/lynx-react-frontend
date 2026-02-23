import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import HeaderBar from './components/HeaderBar';
import RequestTypeCard from './components/RequestTypeCard';
import CommunicationCard from './components/CommunicationCard';
import ProposedTimeCard from './components/ProposedTimeCard';
import ServiceRequestDetailsCard from './components/ServiceRequestDetailsCard';
import AttachmentsCard from './components/AttachmentsCard';
import LastUpdatedText from './components/LastUpdatedText';
import ScheduleHistorySection from './components/ScheduleHistorySection';
import { useOnHoldRequestStore } from './store/useOnHoldRequestStore';
import { useSelectedRequestId } from './hooks/useSelectedRequestId';
import { useFormat } from './hooks/useFormat';
import ProposeTimeModal from '../../common/ProposeTimeModal';
import { getBackendImageUrl } from '../../../utils/urlUtils';
import { useAuthStore } from '../../../store/authStore';
import { useRequestRealtime } from '../../../hooks/useRequestRealtime';
import LoadingComponent from '../../common/LoadingComponent';
import { getUserTimezoneOffset } from '../../../utils/timezoneHelper';

interface OnHoldRequestDetailsIndexProps {
  setActivePage: (page: string) => void;
}

const OnHoldRequestDetailsIndex: React.FC<OnHoldRequestDetailsIndexProps> = ({ setActivePage }) => {
  const navigate = useNavigate();
  const requestId = useSelectedRequestId();
  const { formatDate } = useFormat();
  const [showProposeTimeModal, setShowProposeTimeModal] = useState(false);
  const [showHistorySection, setShowHistorySection] = useState(false);
  const { user } = useAuthStore();

  const {
    request,
    handshakehistory,
    messages,
    status_icon,
    channelName,
    loading,
    error,
    getRequestDetails,
    acceptRequest,
    declineRequest,
    buttons
  } = useOnHoldRequestStore();

  const latestHandshakeNote = useMemo(() => {
    const list = Array.isArray(handshakehistory) ? handshakehistory : [];
    if (list.length === 0) return { notes: '', new_schedule: '' };

    // Choose the most recent by `created_at` (fallback to `updated_at`, then `id`)
    const latest = list.reduce((acc, cur) => {
      const accTs =
        (acc?.created_at && Date.parse(acc.created_at)) ||
        (acc?.updated_at && Date.parse(acc.updated_at)) ||
        0;
      const curTs =
        (cur?.created_at && Date.parse(cur.created_at)) ||
        (cur?.updated_at && Date.parse(cur.updated_at)) ||
        0;
      if (curTs > accTs) return cur;
      if (curTs === accTs) return (cur?.id ?? 0) > (acc?.id ?? 0) ? cur : acc;
      return acc;
    }, list[0]);

    return {
      notes: (latest?.notes ?? '').toString().trim(),
      new_schedule: latest?.new_schedule ?? ''
    }
  }, [handshakehistory]);

  useEffect(() => {
    if (requestId === null) {
      // Redirect to a safe page if no request ID is found
      navigate('/professional/my-account');
      return;
    }

    // Fetch request details
    const userTimezone = getUserTimezoneOffset();
    getRequestDetails(requestId, "on hold", userTimezone);

    // Cleanup on unmount
    return () => {
      // sessionStorage.removeItem('selectedRequestId'); // Clean up session storage
    };
  }, [requestId, navigate, getRequestDetails]);

  // Listen for real-time request updates via WebSocket
  useRequestRealtime(requestId, () => {
    const userTimezone = new Date().getTimezoneOffset() / -60;
    if (requestId) {
      getRequestDetails(requestId, "on hold", userTimezone);
    }
  });

  const handleBackToList = () => {
    setActivePage("active-communication-requests");
  };

  const handleProposeTimeClick = () => {
    setShowProposeTimeModal(true);
  };

  const handleCloseProposeTimeModal = () => {
    setShowProposeTimeModal(false);
  };

  const handleProposeTimeSubmit = async () => {
    const userTimezone = getUserTimezoneOffset();
    if (requestId == null) return;
    getRequestDetails(requestId, "on hold", userTimezone);
    return;
  };

  const handleAcceptClick = async () => {
    if (!requestId) return;

    await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to accept this request.",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Yes, accept it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true,
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        if (confirmBtn) confirmBtn.classList.add('rounded-pill');
      },
      preConfirm: async () => {
        try {
          Swal.showLoading();
          const success = await acceptRequest({ requestId });

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
        // success handled after modal closes
        await Swal.fire({
          icon: 'success',
          title: 'Request Accepted!',
          text: 'The request has been successfully accepted.',
          timer: 2000,
          showConfirmButton: false,
        });

        // Navigate or refetch as needed
        sessionStorage.setItem('selectedRequestId', requestId.toString());
        setActivePage("accepted-request-details");
      }
    });
  };

  const handleDeclineClick = async () => {
    if (!requestId) return;

    const { isConfirmed, value: declineReason } = await Swal.fire({
      title: 'Decline Request',
      text: 'Are you sure you want to decline this request? This action cannot be undone.',
      input: 'textarea',
      inputPlaceholder: 'Write reason',
      inputAttributes: {
        'aria-label': 'Write reason',
        maxlength: '500',
        rows: '4',
      },
      inputValidator: (value: string) => {
        if (!value || !value.trim()) return 'This field is required!';
        return undefined;
      },
      showCancelButton: true,
      confirmButtonText: 'Decline',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'swal2-confirm btn btn-danger rounded-pill',
        cancelButton: 'swal2-cancel btn btn-secondary rounded-pill ms-2',
      },
      focusConfirm: false,
    });

    if (!isConfirmed) return;

    const receiverId =
      request?.customer?.id?.toString?.() ??
      request?.provider?.id?.toString?.() ??
      '';

    if (!receiverId) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Receiver not found for this request.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const ok = await declineRequest({
      requestId,
      reason: declineReason.trim(),
      receiver: receiverId,
    });

    // Optionally refetch to refresh UI immediately
    if (ok) {
      const tz = getUserTimezoneOffset();
      await getRequestDetails(requestId, messages?.type ?? 'on hold', tz);
    }
  };

  const handleHistoryClick = () => {
    setShowHistorySection((prev) => !prev);
  };

  if (loading || requestId === null) { return (<LoadingComponent />); }

  if (error) {
    return (
      <div className="alert alert-danger mt-3" role="alert">
        {error}
        <button className="btn btn-primary mt-3" onClick={handleBackToList}>Back to List</button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="alert alert-info mt-3" role="alert">
        Request details not found.
        <button className="btn btn-primary mt-3" onClick={handleBackToList}>Back to List</button>
      </div>
    );
  }
  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f0f9fb' }}>
      <HeaderBar requestId={request.request_id} onBack={handleBackToList} />

      <div className="row">
        {/* Left Column (col-lg-6) */}
        <div className="col-lg-6">
          {/* Card 1: Request Type */}
          <div className="card mb-3">
            <div className="card-body p-3">
              <RequestTypeCard label="Request Type:" value={request.service_tier_tag} />
            </div>
          </div>

          {/* Card 2: Communication/Status */}
          <div className="card mb-3">
            <div className="card-body p-3">
              <CommunicationCard
                statusIconUrl={getBackendImageUrl(status_icon)}
                message={messages?.message || ''}
                chatButton={{
                  rid: request.id,
                  status: request.status.toLowerCase(),
                  channel: channelName || '',
                  identity_name: `P_${user?.id || ''}`,
                  au_id: String(user?.id || ''),
                  user_type: 'provider',
                  friendly_name: `#${request.request_id || request.id}`,
                  request_status: request.status === 'pending' ? 'pending' : 1,
                  url: "/professional/join-channel"
                }}
              />
            </div>
          </div>

          {/* Card 3: Service Request Details */}
          <div className="card mb-3">
            <div className="card-body p-3">
              <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Service Request Details</p>
              <ServiceRequestDetailsCard
                requestedServices={`${request.category} > ${request.services_name}`}
                additionalDetails={request.description}
                location={`${request.city}, ${request.state}, ${request.zip_code}`}
              />
            </div>
          </div>

          {/* Card 4: Last Updated */}
          <div className="card mb-3">
            <div className="card-body p-3">
              <LastUpdatedText text={formatDate(request.created_at)} />
            </div>
          </div>

          {/* Card 5: Attachments */}
          {request.files &&
            <div className="card mb-3">
              <div className="card-body p-3">
                <p className="fw-semibold mb-1 text-secondary fs-sm">Attachments</p>
                <AttachmentsCard files={request.files ? JSON.parse(request.files) : []} />
              </div>
            </div>
          }
        </div>

        {/* Right Column (col-lg-6) */}
        <div className="col-lg-6">
          {/* Card 6: Proposed Time Card */}
          <div className="card mb-3">
            <div className="card-body p-3 text-center">
              <ProposedTimeCard
                headerMessage={messages.message}
                newScheduleDate={formatDate(latestHandshakeNote.new_schedule)}
                noteText={latestHandshakeNote.notes}
                buttons={{
                  onPropose: buttons?.btn_propose_schedule ? handleProposeTimeClick : undefined,
                  onAccept: buttons?.btn_accept ? handleAcceptClick : undefined,
                  onDecline: buttons?.btn_decline ? handleDeclineClick : undefined,
                  onHistory: buttons?.btn_history ? handleHistoryClick : undefined,
                }}
              />
            </div>
          </div>
          {/* Card 7: Schedule History Section */}
          {showHistorySection &&
            <div className="card mb-3">
              <div className="card-body p-3">
                <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Propose Time Schedule History</p>
                <ScheduleHistorySection
                  show={showHistorySection}
                  requestId={requestId}
                />
              </div>
            </div>
          }
          {/* Card 8: Help (Contact Info) - Mimicking RequestDetailsContent.tsx */}
          <div className="card mb-3">
            <div className="card-body p-3">
              <p className="fw-semibold mb-1 text-secondary fs-sm">Need help? We’ve got your back!</p>
              <ul className="list-unstyled">
                <li><i className="uil uil-phone me-2"></i> +18774115969</li>
                <li><i className="uil uil-envelope me-2"></i> <a href="mailto:hello@connectwithlynx.com">hello@connectwithlynx.com</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Propose New Time Modal */}
      <ProposeTimeModal
        show={showProposeTimeModal}
        onClose={handleCloseProposeTimeModal}
        requestId={requestId}
        onSubmit={handleProposeTimeSubmit}
      />
    </div>
  );
};

export default OnHoldRequestDetailsIndex;
