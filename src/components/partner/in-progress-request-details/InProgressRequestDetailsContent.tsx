import React, { useState, useEffect } from 'react';
import { partnerService } from '../../../services/partnerService/partnerService';
import Swal from 'sweetalert2';
import {
    RequestHeader,
    EmployeeInfo,
    ScheduleInfo,
    ScheduleHistoryTable,
    CompleteRequestModal,
    ServiceDetails,
    LoadingSpinner,
    ErrorState,
    EmptyState
} from './components';
import type { RequestDetailsResponse } from './types';
import type { ScheduleHistoryEntry } from '../../../types/scheduleHistory';
import CancelAssignmentModal from '../accepted-request-details/CancelAssignmentModal';
import RequestAttachments from '../RequestAttachments';

interface InProgressRequestDetailsContentProps {
    requestId: number;
    onBack: () => void;
    setActivePage?: (page: string) => void;
}

const InProgressRequestDetailsContent: React.FC<InProgressRequestDetailsContentProps> = ({ requestId, onBack, setActivePage }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestDetails, setRequestDetails] = useState<RequestDetailsResponse | null>(null);

    // Get requestId from sessionStorage if prop is 0 or invalid
    const actualRequestId = React.useMemo(() => {
        if (requestId && requestId > 0) {
            return requestId;
        }
        // Fallback to sessionStorage
        const storedId = sessionStorage.getItem('selectedRequestId');
        if (storedId) {
            const parsedId = parseInt(storedId, 10);
            if (!isNaN(parsedId) && parsedId > 0) {
                return parsedId;
            }
        }
        return requestId; // Return original even if 0, let the error handling deal with it
    }, [requestId]);

    const [showHistory, setShowHistory] = useState(false);
    const [historyData, setHistoryData] = useState<ScheduleHistoryEntry[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [completeLoading, setCompleteLoading] = useState(false);
    const [showCancelAssignmentModal, setShowCancelAssignmentModal] = useState(false);
    const handleHistoryClick = async () => {
        if (showHistory) {
            setShowHistory(false);
            return;
        }

        try {
            setHistoryLoading(true);
            setHistoryError(null);

            const userTimezone = new Date().getTimezoneOffset() / -60;
            const response = await partnerService.getScheduleRequestHistory({
                request_id: requestId,
                user_timezone: userTimezone
            });

            if (response?.success && response.data?.historys) {
                setHistoryData(response.data.historys);
                setShowHistory(true);
            } else {
                setHistoryError('No schedule history found');
                setShowHistory(true);
            }
        } catch (err) {
            console.error('Error fetching schedule history:', err);
            setHistoryError('Failed to load schedule history');
            setShowHistory(true);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleCompleteRequest = async (rating: number, feedback: string) => {
        try {
            setCompleteLoading(true);

            const response = await partnerService.completeRequest({
                request_id: requestId,
                rating: rating,
                feedback: feedback
            });

            if (response?.success) {
                setShowCompleteModal(false);
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Request completed successfully',
                    timer: 1000,
                    showConfirmButton: false
                });

                // Store requestId in sessionStorage for the completed request details page
                sessionStorage.setItem('selectedRequestId', requestId.toString());

                // Navigate to completed request details page (matching Laravel behavior)
                if (setActivePage) {
                    setActivePage("completed-request-details");
                } else {
                    // Fallback to onBack if setActivePage is not provided
                    onBack();
                }
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response?.message || 'Failed to complete request. Please try again.',
                    confirmButtonColor: '#e2626b'
                });
            }
        } catch (err) {
            console.error('Error completing request:', err);
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while completing the request. Please try again.';
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonColor: '#e2626b'
            });
        } finally {
            setCompleteLoading(false);
        }
    };

    // Fetch request details from API
    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);


                // Call the API with the exact payload you specified
                const payload = {
                    id: actualRequestId,
                    type: "in process",
                    user_timezone: 5.5,
                    currentPage: 1
                };

                const response = await partnerService.getRequestDetails(payload);

                if (response && response.success && response.data) {
                    setRequestDetails(response);
                } /* else {
                    console.log('API response not successful, using fallback data');
                    // Fallback to mock data if API response is not successful

                } */
            } catch (error) {
                console.error('Error fetching request details:', error);
                setError('Failed to fetch request details. Please try again.');

                // Use fallback data on error

            } finally {
                setIsLoading(false);
            }
        };

        fetchRequestDetails();
    }, [actualRequestId]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorState error={error} onBack={onBack} />;
    }

    if (!requestDetails) {
        return <EmptyState onBack={onBack} />;
    }

  const scheduleLabel = String(requestDetails.data.request.service_tier_tag || '').toLowerCase() === 'emergency'
    ? 'Emergency Time'
    : 'Scheduled time';

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f0f9fb' }}>
            <RequestHeader
                requestId={requestDetails.data.request.request_id}
                onBack={onBack}
            />

            <div className="row mt-4">
                <div className="col-lg-6">
                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <div className="mb-3 service-tier-tag">
                                <u className="text-bold">Request Type: </u>
                                <b>{String(requestDetails.data.request.service_tier_tag)} Service</b>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <EmployeeInfo
                                member={requestDetails.data.request.member || requestDetails.data.request.provider}
                                statusIcon={requestDetails.data.status_icon}
                                channelName={requestDetails.data.channel_name}
                                message={requestDetails.data.message}
                            />
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <ScheduleInfo
                                createdAt={requestDetails.data.request.created_at}
                                onHistoryClick={handleHistoryClick}
                                historyLoading={historyLoading}
                                label={scheduleLabel}
                            />

                            <button
                                className="btn rounded-pill btn-primary d-flex m-auto gap-2 mt-3"
                                onClick={() => setShowCompleteModal(true)}
                            >
                                <i className="uil uil-check-circle"></i> Complete Request
                            </button>
                        </div>
                    </div>

                    {showHistory && (
                        <div className="card mb-3">
                            <div className="card-body p-3">
                                <ScheduleHistoryTable
                                    historyData={historyData}
                                    loading={historyLoading}
                                    error={historyError}
                                />
                            </div>
                        </div>
                    )}

                </div>
                <div className="col-lg-6">

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <ServiceDetails request={requestDetails.data.request} />
                        </div>
                    </div>

                    {/* Attachments */}
                    {(() => {
                        let attachmentFiles: string[] = [];
                        try {
                            const filesRaw = requestDetails.data.request.files;
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

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <div className="text-end text-muted fs-sm" style={{ fontSize: '0.9em' }}>
                                Last updated on {new Date(requestDetails.data.request.updated_at).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-3 d-flex justify-content-center">
                            <button
                                className="btn rounded-pill btn-danger text-white"
                                data-bs-toggle="modal"
                                data-bs-target="#cancelAssignmentModal"
                                onClick={() => setShowCancelAssignmentModal(true)}
                            >
                                Cancel Assignment
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <CompleteRequestModal
                isOpen={showCompleteModal}
                onClose={() => setShowCompleteModal(false)}
                requestId={requestId}
                onSubmit={handleCompleteRequest}
                loading={completeLoading}
            />

            <CancelAssignmentModal
                isOpen={showCancelAssignmentModal}
                onClose={() => setShowCancelAssignmentModal(false)}
                requestId={requestId}
                onCancelSuccess={() => {
                    setShowCancelAssignmentModal(false);
                    onBack();
                }}
            />
        </div>
    );
};

export default InProgressRequestDetailsContent;
